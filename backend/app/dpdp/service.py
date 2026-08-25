"""Transactional DPDP governance services."""
from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit.service import write_audit_log
from app.common.enums import GrievanceStatus
from app.dpdp.models import (
    ConsentManager,
    DataProtectionOfficer,
    GrievanceCounter,
    PatientGrievance,
)
from app.dpdp.schemas import (
    ConsentManagerCreate,
    ConsentManagerUpdate,
    DpoAppointmentCreate,
    GrievanceCreate,
    GrievanceTransition,
)
from app.opd.service import _business_date
from app.patients.models import Patient
from app.users.models import Facility, User


class DpoNotFound(Exception):
    pass


class DpoConflict(Exception):
    def __init__(self, code: str) -> None:
        self.code = code


class GrievanceNotFound(Exception):
    pass


class GrievanceConflict(Exception):
    def __init__(self, code: str) -> None:
        self.code = code


class ResourceNotFound(Exception):
    def __init__(self, code: str) -> None:
        self.code = code


class ConsentManagerNotFound(Exception):
    pass


class ConsentManagerConflict(Exception):
    def __init__(self, code: str) -> None:
        self.code = code


async def _facility_user(
    db: AsyncSession, *, user_id: uuid.UUID, facility_id: uuid.UUID
) -> User:
    user = (
        await db.execute(
            select(User).where(
                User.id == user_id,
                User.facility_id == facility_id,
                User.is_active.is_(True),
            )
        )
    ).scalar_one_or_none()
    if user is None:
        raise ResourceNotFound("user_not_found")
    return user


async def appoint_dpo(
    db: AsyncSession,
    *,
    payload: DpoAppointmentCreate,
    facility_id: uuid.UUID,
    actor_id: uuid.UUID,
) -> DataProtectionOfficer:
    await _facility_user(db, user_id=payload.user_id, facility_id=facility_id)
    current = (
        await db.execute(
            select(DataProtectionOfficer)
            .where(
                DataProtectionOfficer.facility_id == facility_id,
                DataProtectionOfficer.is_active.is_(True),
            )
            .with_for_update()
        )
    ).scalar_one_or_none()
    if current is not None:
        if payload.replaces_dpo_id != current.id:
            raise DpoConflict("active_dpo_exists")
        current.is_active = False
        current.updated_by = actor_id
    elif payload.replaces_dpo_id is not None:
        raise DpoNotFound

    row = DataProtectionOfficer(
        id=uuid.uuid4(),
        facility_id=facility_id,
        user_id=payload.user_id,
        appointed_at=datetime.now(UTC),
        contact_published=payload.contact_published,
        published_contact=payload.published_contact,
        is_active=True,
        created_by=actor_id,
    )
    db.add(row)
    try:
        await db.flush()
    except IntegrityError as exc:
        raise DpoConflict("active_dpo_exists") from exc
    if current is not None:
        await write_audit_log(
            db,
            facility_id=facility_id,
            action="update",
            resource_type="data_protection_officers",
            resource_id=current.id,
            user_id=actor_id,
            old_value={"is_active": True},
            new_value={"is_active": False, "replaced_by_dpo_id": str(row.id)},
        )
    await write_audit_log(
        db,
        facility_id=facility_id,
        action="create",
        resource_type="data_protection_officers",
        resource_id=row.id,
        user_id=actor_id,
        new_value={
            "user_id": str(row.user_id),
            "contact_published": row.contact_published,
            "replaces_dpo_id": str(payload.replaces_dpo_id)
            if payload.replaces_dpo_id
            else None,
        },
    )
    await db.refresh(row)
    return row


async def get_active_dpo(
    db: AsyncSession, *, facility_id: uuid.UUID
) -> DataProtectionOfficer:
    row = (
        await db.execute(
            select(DataProtectionOfficer).where(
                DataProtectionOfficer.facility_id == facility_id,
                DataProtectionOfficer.is_active.is_(True),
            )
        )
    ).scalar_one_or_none()
    if row is None:
        raise DpoNotFound
    return row


async def list_dpo_history(
    db: AsyncSession, *, facility_id: uuid.UUID
) -> list[DataProtectionOfficer]:
    rows = await db.execute(
        select(DataProtectionOfficer)
        .where(DataProtectionOfficer.facility_id == facility_id)
        .order_by(
            DataProtectionOfficer.appointed_at.desc(),
            DataProtectionOfficer.created_at.desc(),
            DataProtectionOfficer.id.desc(),
        )
    )
    return list(rows.scalars().all())


async def deactivate_dpo(
    db: AsyncSession,
    *,
    dpo_id: uuid.UUID,
    facility_id: uuid.UUID,
    actor_id: uuid.UUID,
) -> DataProtectionOfficer:
    row = (
        await db.execute(
            select(DataProtectionOfficer)
            .where(
                DataProtectionOfficer.id == dpo_id,
                DataProtectionOfficer.facility_id == facility_id,
            )
            .with_for_update()
        )
    ).scalar_one_or_none()
    if row is None:
        raise DpoNotFound
    if not row.is_active:
        raise DpoConflict("dpo_already_inactive")
    row.is_active = False
    row.updated_by = actor_id
    await db.flush()
    await write_audit_log(
        db,
        facility_id=facility_id,
        action="update",
        resource_type="data_protection_officers",
        resource_id=row.id,
        user_id=actor_id,
        old_value={"is_active": True},
        new_value={"is_active": False},
    )
    await db.refresh(row)
    return row


async def _next_grievance_number(
    db: AsyncSession, *, facility_id: uuid.UUID
) -> str:
    facility = await db.get(Facility, facility_id)
    if facility is None:
        raise ResourceNotFound("facility_not_found")
    counter_date = _business_date(facility.timezone)
    table = GrievanceCounter.__table__
    insert_factory = (
        sqlite_insert if db.get_bind().dialect.name == "sqlite" else pg_insert
    )
    statement = (
        insert_factory(table)
        .values(facility_id=facility_id, counter_date=counter_date, last_value=1)
        .on_conflict_do_update(
            index_elements=[table.c.facility_id, table.c.counter_date],
            set_={"last_value": table.c.last_value + 1},
        )
        .returning(table.c.last_value)
    )
    sequence = (await db.execute(statement)).scalar_one()
    return f"GRV-{facility.code}-{counter_date:%Y%m%d}-{sequence:04d}"


async def _grievance(
    db: AsyncSession,
    *,
    grievance_id: uuid.UUID,
    facility_id: uuid.UUID,
    lock: bool = False,
) -> PatientGrievance:
    statement = select(PatientGrievance).where(
        PatientGrievance.id == grievance_id,
        PatientGrievance.facility_id == facility_id,
    )
    if lock:
        statement = statement.with_for_update()
    row = (await db.execute(statement)).scalar_one_or_none()
    if row is None:
        raise GrievanceNotFound
    return row


async def create_grievance(
    db: AsyncSession,
    *,
    payload: GrievanceCreate,
    facility_id: uuid.UUID,
    actor_id: uuid.UUID,
) -> PatientGrievance:
    patient = (
        await db.execute(
            select(Patient).where(
                Patient.id == payload.patient_id,
                Patient.facility_id == facility_id,
            )
        )
    ).scalar_one_or_none()
    if patient is None:
        raise ResourceNotFound("patient_not_found")
    if payload.assigned_to is not None:
        await _facility_user(
            db, user_id=payload.assigned_to, facility_id=facility_id
        )

    row = PatientGrievance(
        id=uuid.uuid4(),
        grievance_number=await _next_grievance_number(
            db, facility_id=facility_id
        ),
        patient_id=patient.id,
        facility_id=facility_id,
        grievance_type=payload.grievance_type.value,
        description=payload.description,
        status=GrievanceStatus.PENDING.value,
        assigned_to=payload.assigned_to,
        due_at=payload.due_at,
        created_by=actor_id,
    )
    db.add(row)
    await db.flush()
    await write_audit_log(
        db,
        facility_id=facility_id,
        action="create",
        resource_type="patient_grievances",
        resource_id=row.id,
        patient_id=row.patient_id,
        user_id=actor_id,
        new_value={
            "grievance_number": row.grievance_number,
            "grievance_type": row.grievance_type,
            "due_at": row.due_at.isoformat(),
            "assigned_to": str(row.assigned_to) if row.assigned_to else None,
        },
    )
    await db.refresh(row)
    return row


_LEGAL_GRIEVANCE_TRANSITIONS = {
    GrievanceStatus.PENDING.value: {
        GrievanceStatus.UNDER_REVIEW.value,
        GrievanceStatus.ESCALATED_DPB.value,
    },
    GrievanceStatus.UNDER_REVIEW.value: {
        GrievanceStatus.RESOLVED.value,
        GrievanceStatus.ESCALATED_DPB.value,
    },
    GrievanceStatus.ESCALATED_DPB.value: {GrievanceStatus.RESOLVED.value},
    GrievanceStatus.RESOLVED.value: {GrievanceStatus.CLOSED.value},
}


async def transition_grievance(
    db: AsyncSession,
    *,
    grievance_id: uuid.UUID,
    payload: GrievanceTransition,
    facility_id: uuid.UUID,
    actor_id: uuid.UUID,
) -> PatientGrievance:
    row = await _grievance(
        db, grievance_id=grievance_id, facility_id=facility_id, lock=True
    )
    target = payload.status.value
    if target not in _LEGAL_GRIEVANCE_TRANSITIONS.get(row.status, set()):
        raise GrievanceConflict("illegal_grievance_transition")
    if payload.assigned_to is not None:
        await _facility_user(
            db, user_id=payload.assigned_to, facility_id=facility_id
        )
    if target == GrievanceStatus.RESOLVED.value and payload.resolution is None:
        raise GrievanceConflict("resolution_required")
    if target != GrievanceStatus.RESOLVED.value and payload.resolution is not None:
        raise GrievanceConflict("resolution_not_allowed_for_status")
    if target == GrievanceStatus.ESCALATED_DPB.value:
        if payload.escalation_reason is None:
            raise GrievanceConflict("escalation_reason_required")
    elif payload.escalation_reason is not None:
        raise GrievanceConflict("escalation_reason_not_allowed_for_status")
    if target == GrievanceStatus.CLOSED.value:
        if row.resolution is None or row.resolved_at is None:
            raise GrievanceConflict("resolution_required_before_close")

    old_status = row.status
    row.status = target
    row.updated_by = actor_id
    if payload.assigned_to is not None:
        row.assigned_to = payload.assigned_to
    if payload.resolution is not None:
        row.resolution = payload.resolution
    if payload.escalation_reason is not None:
        row.escalation_reason = payload.escalation_reason
    if target == GrievanceStatus.RESOLVED.value:
        row.resolved_at = datetime.now(UTC)
    await db.flush()
    await write_audit_log(
        db,
        facility_id=facility_id,
        action="update",
        resource_type="patient_grievances",
        resource_id=row.id,
        patient_id=row.patient_id,
        user_id=actor_id,
        old_value={"status": old_status},
        new_value={
            "status": row.status,
            "assigned_to": str(row.assigned_to) if row.assigned_to else None,
            "resolved_at": row.resolved_at.isoformat() if row.resolved_at else None,
        },
        reason=payload.escalation_reason or payload.resolution,
    )
    await db.refresh(row)
    return row


async def get_grievance(
    db: AsyncSession, *, grievance_id: uuid.UUID, facility_id: uuid.UUID
) -> PatientGrievance:
    return await _grievance(
        db, grievance_id=grievance_id, facility_id=facility_id
    )


async def list_grievances(
    db: AsyncSession,
    *,
    facility_id: uuid.UUID,
    patient_id: uuid.UUID | None = None,
    grievance_type: str | None = None,
    status: str | None = None,
    due_before: datetime | None = None,
    page: int = 1,
    page_size: int = 20,
) -> tuple[list[PatientGrievance], int]:
    statement = select(PatientGrievance).where(
        PatientGrievance.facility_id == facility_id
    )
    if patient_id is not None:
        statement = statement.where(PatientGrievance.patient_id == patient_id)
    if grievance_type is not None:
        statement = statement.where(
            PatientGrievance.grievance_type == grievance_type
        )
    if status is not None:
        statement = statement.where(PatientGrievance.status == status)
    if due_before is not None:
        statement = statement.where(PatientGrievance.due_at <= due_before)
    total = (
        await db.execute(select(func.count()).select_from(statement.subquery()))
    ).scalar_one()
    rows = await db.execute(
        statement.order_by(
            PatientGrievance.created_at.desc(), PatientGrievance.id.desc()
        )
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    return list(rows.scalars().all()), total


async def create_consent_manager(
    db: AsyncSession,
    *,
    payload: ConsentManagerCreate,
    audit_facility_id: uuid.UUID,
    actor_id: uuid.UUID,
) -> ConsentManager:
    duplicate = (
        await db.execute(
            select(ConsentManager.id).where(
                ConsentManager.cm_registration_id == payload.cm_registration_id
            )
        )
    ).scalar_one_or_none()
    if duplicate is not None:
        raise ConsentManagerConflict("cm_registration_id_exists")
    row = ConsentManager(
        id=uuid.uuid4(),
        cm_registration_id=payload.cm_registration_id,
        name=payload.name,
        endpoint_url=str(payload.endpoint_url) if payload.endpoint_url else None,
        is_active=True,
    )
    db.add(row)
    try:
        await db.flush()
    except IntegrityError as exc:
        raise ConsentManagerConflict("cm_registration_id_exists") from exc
    await write_audit_log(
        db,
        facility_id=audit_facility_id,
        action="create",
        resource_type="consent_managers",
        resource_id=row.id,
        user_id=actor_id,
        new_value={
            "cm_registration_id": row.cm_registration_id,
            "name": row.name,
            "is_active": row.is_active,
        },
    )
    await db.refresh(row)
    return row


async def get_consent_manager(
    db: AsyncSession, *, manager_id: uuid.UUID
) -> ConsentManager:
    row = await db.get(ConsentManager, manager_id)
    if row is None:
        raise ConsentManagerNotFound
    return row


async def list_consent_managers(
    db: AsyncSession, *, is_active: bool | None = None
) -> list[ConsentManager]:
    statement = select(ConsentManager)
    if is_active is not None:
        statement = statement.where(ConsentManager.is_active == is_active)
    rows = await db.execute(
        statement.order_by(ConsentManager.name.asc(), ConsentManager.id.asc())
    )
    return list(rows.scalars().all())


async def update_consent_manager(
    db: AsyncSession,
    *,
    manager_id: uuid.UUID,
    payload: ConsentManagerUpdate,
    audit_facility_id: uuid.UUID,
    actor_id: uuid.UUID,
) -> ConsentManager:
    row = await get_consent_manager(db, manager_id=manager_id)
    old_value = {
        "name": row.name,
        "endpoint_url": row.endpoint_url,
        "is_active": row.is_active,
    }
    if "name" in payload.model_fields_set:
        row.name = payload.name  # type: ignore[assignment]
    if "endpoint_url" in payload.model_fields_set:
        row.endpoint_url = str(payload.endpoint_url) if payload.endpoint_url else None
    if payload.is_active is not None:
        row.is_active = payload.is_active
    await db.flush()
    await write_audit_log(
        db,
        facility_id=audit_facility_id,
        action="update",
        resource_type="consent_managers",
        resource_id=row.id,
        user_id=actor_id,
        old_value=old_value,
        new_value={
            "name": row.name,
            "endpoint_url": row.endpoint_url,
            "is_active": row.is_active,
        },
    )
    await db.refresh(row)
    return row
