"""Patient-portal reads whose patient identity comes only from a verified binding."""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import func, select

from app.auth.deps import CurrentDbUser, require_roles
from app.common.enums import AccessChannel
from app.consent.models import ConsentPurpose, ConsentRecord, DataAccessLog
from app.patients.models import Patient, PatientPortalBinding
from app.patients.portal_router import ActivePatientBinding, DbSession
from app.users.models import User

router = APIRouter(
    prefix="/patient-portal/me",
    tags=["patient-portal"],
    dependencies=[Depends(require_roles("patient"))],
)


class MyAbhaOut(BaseModel):
    patient_id: uuid.UUID
    abha_number: str | None
    linked_at: datetime | None
    linked: bool


class MyConsentOut(BaseModel):
    id: uuid.UUID
    purpose_code: str
    purpose_description: str | None
    status: str
    granted_at: datetime
    expires_at: datetime | None
    scope: list[str] | None
    channel: str


class MyAccessItem(BaseModel):
    accessed_at: datetime
    staff_name: str | None
    role: str | None
    resource_type: str | None
    purpose_code: str | None
    access_channel: str
    emergency_access: bool


class MyAccessHistoryOut(BaseModel):
    total: int
    limit: int
    offset: int
    items: list[MyAccessItem]


async def _record_self_access(
    db: DbSession,
    *,
    caller: CurrentDbUser,
    binding: PatientPortalBinding,
    resource_type: str,
) -> None:
    db.add(
        DataAccessLog(
            id=uuid.uuid4(),
            user_id=caller.id,
            role="patient",
            resource_type=resource_type,
            resource_id=binding.patient_id,
            patient_id=binding.patient_id,
            purpose_code="self_review",
            access_channel=AccessChannel.API.value,
            emergency_access=False,
            consent_required=False,
            consent_verified=None,
        )
    )
    await db.flush()


@router.get("/abha", response_model=MyAbhaOut)
async def get_my_abha(
    binding: ActivePatientBinding,
    caller: CurrentDbUser,
    db: DbSession,
) -> MyAbhaOut:
    await _record_self_access(db, caller=caller, binding=binding, resource_type="abha_identity")
    patient = await db.get(Patient, binding.patient_id)
    return MyAbhaOut(
        patient_id=patient.id,
        abha_number=patient.abha_number,
        linked_at=patient.abha_linked_at,
        linked=patient.abha_number is not None,
    )


@router.get("/consents", response_model=list[MyConsentOut])
async def get_my_consents(
    binding: ActivePatientBinding,
    caller: CurrentDbUser,
    db: DbSession,
) -> list[MyConsentOut]:
    await _record_self_access(db, caller=caller, binding=binding, resource_type="consent_records")
    rows = (
        await db.execute(
            select(ConsentRecord, ConsentPurpose)
            .join(ConsentPurpose, ConsentPurpose.id == ConsentRecord.purpose_id)
            .where(ConsentRecord.patient_id == binding.patient_id)
            .order_by(ConsentRecord.granted_at.desc())
        )
    ).all()
    return [
        MyConsentOut(
            id=record.id,
            purpose_code=purpose.purpose_code,
            purpose_description=purpose.description,
            status=record.status,
            granted_at=record.granted_at,
            expires_at=record.expires_at,
            scope=record.scope,
            channel=record.channel,
        )
        for record, purpose in rows
    ]


@router.get("/access-history", response_model=MyAccessHistoryOut)
async def get_my_access_history(
    binding: ActivePatientBinding,
    caller: CurrentDbUser,
    db: DbSession,
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> MyAccessHistoryOut:
    await _record_self_access(db, caller=caller, binding=binding, resource_type="data_access_log")
    base = DataAccessLog.patient_id == binding.patient_id
    total = (
        await db.execute(select(func.count()).select_from(DataAccessLog).where(base))
    ).scalar_one()
    rows = (
        await db.execute(
            select(DataAccessLog, User.full_name)
            .outerjoin(User, User.id == DataAccessLog.user_id)
            .where(base)
            .order_by(DataAccessLog.accessed_at.desc())
            .limit(limit)
            .offset(offset)
        )
    ).all()
    return MyAccessHistoryOut(
        total=total,
        limit=limit,
        offset=offset,
        items=[
            MyAccessItem(
                accessed_at=entry.accessed_at,
                staff_name=staff_name,
                role=entry.role,
                resource_type=entry.resource_type,
                purpose_code=entry.purpose_code,
                access_channel=entry.access_channel,
                emergency_access=entry.emergency_access,
            )
            for entry, staff_name in rows
        ],
    )
