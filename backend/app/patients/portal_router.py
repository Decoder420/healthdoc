"""Verified identity provisioning and self-binding lookup for the patient portal."""
from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit.actions import AuditAction
from app.audit.context import AuditActor
from app.audit.deps import get_current_actor_dependency
from app.audit.service import audited_mutation
from app.auth.deps import CurrentDbUser, require_roles
from app.common.db import get_db
from app.patients.models import Patient, PatientPortalBinding
from app.users.models import User

router = APIRouter(prefix="/patient-portal", tags=["patient-portal"])
DbSession = Annotated[AsyncSession, Depends(get_db)]
AuditActorDependency = Annotated[AuditActor, Depends(get_current_actor_dependency)]


class BindingCreate(BaseModel):
    user_id: uuid.UUID
    patient_id: uuid.UUID
    verification_method: Literal["abha_otp", "in_person_document"]
    verification_reference: str = Field(min_length=6, max_length=200)


class BindingRevoke(BaseModel):
    reason: str = Field(min_length=10, max_length=500)


class BindingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    patient_id: uuid.UUID
    facility_id: uuid.UUID
    verification_method: str
    verified_by: uuid.UUID
    verified_at: datetime
    revoked_at: datetime | None
    revoked_by: uuid.UUID | None
    revocation_reason: str | None


async def get_active_patient_binding(user: CurrentDbUser, db: DbSession) -> PatientPortalBinding:
    """Resolve self identity exclusively from the authenticated app user."""
    binding = (
        await db.execute(
            select(PatientPortalBinding)
            .join(Patient, Patient.id == PatientPortalBinding.patient_id)
            .where(
                PatientPortalBinding.user_id == user.id,
                PatientPortalBinding.facility_id == user.facility_id,
                PatientPortalBinding.revoked_at.is_(None),
                Patient.facility_id == user.facility_id,
                Patient.deleted_at.is_(None),
                Patient.status == "active",
            )
        )
    ).scalar_one_or_none()
    if binding is None:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            {
                "code": "patient_identity_not_bound",
                "message": "Complete verified portal activation at registration",
            },
        )
    return binding


ActivePatientBinding = Annotated[PatientPortalBinding, Depends(get_active_patient_binding)]


@router.post(
    "/bindings",
    response_model=BindingOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles("receptionist", "admin"))],
)
async def create_binding(
    payload: BindingCreate,
    caller: CurrentDbUser,
    db: DbSession,
    _actor: AuditActorDependency,
) -> PatientPortalBinding:
    target_user = await db.get(User, payload.user_id)
    patient = await db.get(Patient, payload.patient_id)
    if (
        target_user is None
        or patient is None
        or target_user.facility_id != caller.facility_id
        or patient.facility_id != caller.facility_id
        or not target_user.is_active
        or patient.deleted_at is not None
        or patient.status != "active"
    ):
        raise HTTPException(404, {"code": "binding_subject_not_found"})

    conflict = (
        await db.execute(
            select(PatientPortalBinding.id).where(
                PatientPortalBinding.revoked_at.is_(None),
                or_(
                    PatientPortalBinding.user_id == payload.user_id,
                    PatientPortalBinding.patient_id == payload.patient_id,
                ),
            )
        )
    ).first()
    if conflict:
        raise HTTPException(409, {"code": "active_patient_binding_exists"})

    binding = PatientPortalBinding(
        id=uuid.uuid4(),
        user_id=payload.user_id,
        patient_id=payload.patient_id,
        facility_id=caller.facility_id,
        verification_method=payload.verification_method,
        verification_reference=payload.verification_reference.strip(),
        verified_by=caller.id,
    )
    try:
        async with audited_mutation(
            db,
            facility_id=caller.facility_id,
            action=AuditAction.CREATE,
            resource_type="patient_portal_bindings",
            user_id=caller.id,
            patient_id=patient.id,
        ) as audit:
            audit.resource_id = binding.id
            audit.new_value = {
                "user_id": str(binding.user_id),
                "patient_id": str(binding.patient_id),
                "verification_method": binding.verification_method,
            }
            audit.reason = "verified_patient_portal_activation"
            db.add(binding)
            await db.flush()
    except IntegrityError as exc:
        raise HTTPException(409, {"code": "active_patient_binding_exists"}) from exc
    return binding


@router.get(
    "/bindings",
    response_model=list[BindingOut],
    dependencies=[Depends(require_roles("receptionist", "admin", "supervisor"))],
)
async def list_bindings(
    caller: CurrentDbUser,
    db: DbSession,
    active_only: Annotated[bool, Query()] = True,
) -> list[PatientPortalBinding]:
    statement = select(PatientPortalBinding).where(
        PatientPortalBinding.facility_id == caller.facility_id
    )
    if active_only:
        statement = statement.where(PatientPortalBinding.revoked_at.is_(None))
    return list((await db.execute(statement.order_by(PatientPortalBinding.created_at.desc()))).scalars())


@router.patch(
    "/bindings/{binding_id}/revoke",
    response_model=BindingOut,
    dependencies=[Depends(require_roles("admin", "supervisor"))],
)
async def revoke_binding(
    binding_id: uuid.UUID,
    payload: BindingRevoke,
    caller: CurrentDbUser,
    db: DbSession,
    _actor: AuditActorDependency,
) -> PatientPortalBinding:
    binding = (
        await db.execute(
            select(PatientPortalBinding)
            .where(
                PatientPortalBinding.id == binding_id,
                PatientPortalBinding.facility_id == caller.facility_id,
            )
            .with_for_update()
        )
    ).scalar_one_or_none()
    if binding is None:
        raise HTTPException(404, {"code": "patient_binding_not_found"})
    if binding.revoked_at is not None:
        raise HTTPException(409, {"code": "patient_binding_already_revoked"})

    now = datetime.now(UTC)
    async with audited_mutation(
        db,
        facility_id=caller.facility_id,
        action=AuditAction.UPDATE,
        resource_type="patient_portal_bindings",
        user_id=caller.id,
        patient_id=binding.patient_id,
    ) as audit:
        audit.resource_id = binding.id
        audit.old_value = {"revoked_at": None}
        binding.revoked_at = now
        binding.revoked_by = caller.id
        binding.revocation_reason = payload.reason.strip()
        audit.new_value = {"revoked_at": now.isoformat()}
        audit.reason = binding.revocation_reason
        await db.flush()
    return binding


@router.get(
    "/binding",
    response_model=BindingOut,
    dependencies=[Depends(require_roles("patient"))],
)
async def get_my_binding(binding: ActivePatientBinding) -> PatientPortalBinding:
    return binding
