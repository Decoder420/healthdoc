"""Facility-scoped procedure creation and read-back."""

from __future__ import annotations

import uuid
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit.service import write_audit_log
from app.opd.models import Encounter
from app.orders.models import Order
from app.ot.models import OtSchedule
from app.procedures.models import ProcedureRecord
from app.procedures.schemas import ProcedureCreate
from app.users.models import User


class ProcedureOrderNotFound(Exception):
    pass


class ProcedureOrderTypeMismatch(Exception):
    pass


class ProcedureAlreadyExists(Exception):
    pass


class ProcedureAssistantNotFound(Exception):
    pass


class ProcedureOtScheduleNotFound(Exception):
    pass


async def create_procedure(
    db: AsyncSession,
    payload: ProcedureCreate,
    *,
    facility_id: UUID,
    performed_by: UUID,
) -> ProcedureRecord:
    """Create one procedure detail for a facility-scoped procedure order.

    The order row is locked while checking for an existing detail so two
    concurrent requests with different idempotency keys cannot both attach a
    procedure record to the same header.
    """
    order = (
        await db.execute(
            select(Order)
            .where(Order.id == payload.order_id, Order.facility_id == facility_id)
            .with_for_update()
        )
    ).scalar_one_or_none()
    if order is None:
        raise ProcedureOrderNotFound
    if order.order_type != "procedure":
        raise ProcedureOrderTypeMismatch

    existing = (
        await db.execute(select(ProcedureRecord).where(ProcedureRecord.order_id == order.id))
    ).scalar_one_or_none()
    if existing is not None:
        raise ProcedureAlreadyExists

    encounter = await db.get(Encounter, order.encounter_id)
    if encounter is None or encounter.facility_id != facility_id:
        # A malformed legacy order must not become a cross-facility record.
        raise ProcedureOrderNotFound

    if payload.assisted_by is not None:
        assistant = (
            await db.execute(
                select(User).where(
                    User.id == payload.assisted_by,
                    User.facility_id == facility_id,
                    User.is_active.is_(True),
                )
            )
        ).scalar_one_or_none()
        if assistant is None:
            raise ProcedureAssistantNotFound

    if payload.ot_schedule_id is not None:
        schedule = (
            await db.execute(
                select(OtSchedule).where(
                    OtSchedule.id == payload.ot_schedule_id,
                    OtSchedule.facility_id == facility_id,
                    OtSchedule.patient_id == order.patient_id,
                )
            )
        ).scalar_one_or_none()
        if schedule is None:
            raise ProcedureOtScheduleNotFound

    procedure = ProcedureRecord(
        id=uuid.uuid4(),
        order_id=order.id,
        encounter_id=order.encounter_id,
        patient_id=order.patient_id,
        procedure_name=payload.procedure_name,
        procedure_code=payload.procedure_code,
        code_system=payload.code_system,
        setting=payload.setting.value,
        ot_schedule_id=payload.ot_schedule_id,
        performed_by=performed_by,
        assisted_by=payload.assisted_by,
        started_at=payload.started_at,
        ended_at=payload.ended_at,
        outcome=payload.outcome,
        complications=payload.complications,
    )
    db.add(procedure)
    await db.flush()

    await write_audit_log(
        db,
        facility_id=facility_id,
        action="create",
        resource_type="procedure_records",
        resource_id=procedure.id,
        user_id=performed_by,
        patient_id=order.patient_id,
        visit_id=encounter.visit_id,
        new_value={
            "order_id": str(order.id),
            "encounter_id": str(order.encounter_id),
            "procedure_name": procedure.procedure_name,
            "setting": procedure.setting,
            "performed_by": str(performed_by),
        },
    )
    await db.refresh(procedure)
    return procedure


async def list_procedures_for_encounter(
    db: AsyncSession,
    *,
    encounter_id: UUID,
    facility_id: UUID,
) -> list[ProcedureRecord]:
    rows = await db.execute(
        select(ProcedureRecord)
        .join(Encounter, Encounter.id == ProcedureRecord.encounter_id)
        .where(
            ProcedureRecord.encounter_id == encounter_id,
            Encounter.facility_id == facility_id,
        )
        .order_by(ProcedureRecord.created_at.desc())
    )
    return list(rows.scalars().all())
