"""Nursing service — vitals, eMAR, fluid balance (#390).

BMI and WHR are computed here and never accepted from the client. A derived
value a caller can set is a derived value that can disagree with its inputs,
and a wrong BMI in a chart is read as a measurement rather than as arithmetic.
"""
import uuid
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import MedicationAdministrationStatus
from app.nursing.models import IntakeOutputRecord, MedicationAdministration, Vitals
from app.nursing.schemas import (
    IntakeOutputCreate, MedicationAdministrationCreate, VitalsCreate,
)


class AdmissionNotFound(Exception):
    def __init__(self, admission_id: uuid.UUID) -> None:
        self.admission_id = admission_id


def _bmi(height_cm: Decimal | None, weight_kg: Decimal | None) -> Decimal | None:
    """kg / m². None unless both inputs are present and height is non-zero."""
    if height_cm is None or weight_kg is None or Decimal(height_cm) == 0:
        return None
    metres = Decimal(height_cm) / Decimal(100)
    return (Decimal(weight_kg) / (metres * metres)).quantize(Decimal("0.1"), ROUND_HALF_UP)


def _whr(waist_cm: Decimal | None, hip_cm: Decimal | None) -> Decimal | None:
    if waist_cm is None or hip_cm is None or Decimal(hip_cm) == 0:
        return None
    return (Decimal(waist_cm) / Decimal(hip_cm)).quantize(Decimal("0.01"), ROUND_HALF_UP)


async def record_vitals(
    db: AsyncSession, payload: VitalsCreate, *, recorded_by: uuid.UUID
) -> Vitals:
    """One measurement set, against an encounter (OPD) or an admission (IPD).

    `measured_at` defaults to now but may be backdated — a paper observation
    transcribed an hour later must keep the time it was actually taken, or the
    chart in #193 draws the wrong line.
    """
    vitals = Vitals(
        id=uuid.uuid4(),
        patient_id=payload.patient_id,
        encounter_id=payload.encounter_id,
        admission_id=payload.admission_id,
        measured_at=payload.measured_at or datetime.now(timezone.utc),
        height_cm=payload.height_cm,
        weight_kg=payload.weight_kg,
        bmi=_bmi(payload.height_cm, payload.weight_kg),
        waist_cm=payload.waist_cm,
        hip_cm=payload.hip_cm,
        whr=_whr(payload.waist_cm, payload.hip_cm),
        temp_c=payload.temp_c,
        pulse_bpm=payload.pulse_bpm,
        resp_rate=payload.resp_rate,
        bp_systolic=payload.bp_systolic,
        bp_diastolic=payload.bp_diastolic,
        spo2_pct=payload.spo2_pct,
        pain_score=payload.pain_score,
        created_by=recorded_by,
    )
    db.add(vitals)
    await db.flush()
    await db.refresh(vitals)
    return vitals


async def list_vitals(
    db: AsyncSession,
    patient_id: uuid.UUID,
    *,
    since: datetime | None = None,
    until: datetime | None = None,
) -> list[Vitals]:
    """The time-series behind #193's chart.

    Filtered by patient, NOT by encounter or admission: a patient seen in OPD
    and later admitted has vitals hanging off both, and a chart that showed only
    one side would silently drop half the trend at the moment it matters most.

    Ordered oldest-first — that is the order a chart plots in, and it saves the
    caller reversing it.
    """
    stmt = select(Vitals).where(Vitals.patient_id == patient_id)
    if since is not None:
        stmt = stmt.where(Vitals.measured_at >= since)
    if until is not None:
        stmt = stmt.where(Vitals.measured_at <= until)
    rows = await db.execute(stmt.order_by(Vitals.measured_at.asc()))
    return list(rows.scalars().all())


async def record_administration(
    db: AsyncSession, payload: MedicationAdministrationCreate, *, recorded_by: uuid.UUID
) -> MedicationAdministration:
    """One eMAR entry. `held` and `refused` carry a reason; the schema and the
    0043 CHECK both enforce it, deliberately — the API should reject it with a
    422 that names the field, and the database should still refuse if anything
    ever writes around the API."""
    record = MedicationAdministration(
        id=uuid.uuid4(),
        prescription_item_id=payload.prescription_item_id,
        admission_id=payload.admission_id,
        patient_id=payload.patient_id,
        scheduled_at=payload.scheduled_at,
        administered_at=payload.administered_at or datetime.now(timezone.utc),
        status=payload.status,
        dose_given=payload.dose_given,
        reason=payload.reason,
        notes=payload.notes,
        created_by=recorded_by,
    )
    db.add(record)
    await db.flush()
    await db.refresh(record)
    return record


async def list_administrations(
    db: AsyncSession, admission_id: uuid.UUID
) -> list[MedicationAdministration]:
    """The ward eMAR table for one admission, most recent first."""
    rows = await db.execute(
        select(MedicationAdministration)
        .where(MedicationAdministration.admission_id == admission_id)
        .order_by(MedicationAdministration.administered_at.desc())
    )
    return list(rows.scalars().all())


async def record_intake_output(
    db: AsyncSession, payload: IntakeOutputCreate, *, recorded_by: uuid.UUID
) -> IntakeOutputRecord:
    record = IntakeOutputRecord(
        id=uuid.uuid4(),
        admission_id=payload.admission_id,
        recorded_at=payload.recorded_at or datetime.now(timezone.utc),
        entry_type=payload.entry_type,
        volume_ml=payload.volume_ml,
        notes=payload.notes,
        created_by=recorded_by,
    )
    db.add(record)
    await db.flush()
    await db.refresh(record)
    return record


async def fluid_balance(db: AsyncSession, admission_id: uuid.UUID) -> dict:
    """Running intake/output totals for one admission.

    Direction comes from the entry_type prefix, not from the sign of volume_ml,
    which 0023's CHECK keeps positive. That is why a new IntakeOutputType value
    must keep the intake_/output_ prefix convention — anything else silently
    lands in neither total.
    """
    rows = await db.execute(
        select(IntakeOutputRecord.entry_type, IntakeOutputRecord.volume_ml)
        .where(IntakeOutputRecord.admission_id == admission_id)
    )
    intake = output = 0
    for entry_type, volume_ml in rows.all():
        if entry_type.startswith("intake_"):
            intake += volume_ml
        elif entry_type.startswith("output_"):
            output += volume_ml
    return {
        "admission_id": admission_id,
        "total_intake_ml": intake,
        "total_output_ml": output,
        "net_ml": intake - output,
    }


#: Re-exported so callers can compare without importing the enum module.
GIVEN = MedicationAdministrationStatus.GIVEN.value


# ============================================================ order check-off (#210)
#
# The nurse task queue. Uses orders.status plus 0045's accepted/completed
# evidence columns rather than a parallel nursing_tasks table: a nurse checking
# off a doctor's order is the same state transition a lab tech performs when
# accepting a sample, and two tables answering "what is outstanding?" would
# disagree the first time an order completed through the other path.

from app.common.enums import OrderStatus  # noqa: E402
from app.orders.models import Order  # noqa: E402


class OrderNotFound(Exception):
    def __init__(self, order_id: uuid.UUID) -> None:
        self.order_id = order_id


class OrderAlreadyCompleted(Exception):
    """Re-completing would overwrite who checked it off, and when."""

    def __init__(self, order_id: uuid.UUID, completed_at) -> None:
        self.order_id = order_id
        self.completed_at = completed_at


async def pending_orders(
    db: AsyncSession,
    *,
    patient_id: uuid.UUID | None = None,
    order_type: str | None = None,
) -> list[Order]:
    """Everything still outstanding — the queue in #210.

    'Outstanding' is placed / accepted / in_progress. Cancelled orders are not
    tasks, and completed ones have their evidence recorded.
    """
    open_statuses = (
        OrderStatus.PLACED.value,
        OrderStatus.ACCEPTED.value,
        OrderStatus.IN_PROGRESS.value,
    )
    stmt = select(Order).where(Order.status.in_(open_statuses))
    if patient_id is not None:
        stmt = stmt.where(Order.patient_id == patient_id)
    if order_type is not None:
        stmt = stmt.where(Order.order_type == order_type)
    rows = await db.execute(stmt.order_by(Order.ordered_at.asc()))
    return list(rows.scalars().all())


async def accept_order(
    db: AsyncSession, order_id: uuid.UUID, *, accepted_by: uuid.UUID
) -> Order:
    """Take ownership of an order. Idempotent: re-accepting keeps the first
    acceptance, because the first is the one that says when the ward picked
    it up."""
    order = await db.get(Order, order_id)
    if order is None:
        raise OrderNotFound(order_id)

    if order.accepted_at is None:
        order.accepted_at = datetime.now(timezone.utc)
        order.accepted_by = accepted_by
        if order.status == OrderStatus.PLACED.value:
            order.status = OrderStatus.ACCEPTED.value
        await db.flush()
        await db.refresh(order)
    return order


async def complete_order(
    db: AsyncSession,
    order_id: uuid.UUID,
    *,
    completed_by: uuid.UUID,
    note: str | None = None,
) -> Order:
    """Check off an order: who, when, and optionally why it went the way it did.

    Refuses to re-complete. A second check-off would overwrite the first
    timestamp and actor, and in a dispute about when something was given, the
    original entry is the only one that matters.
    """
    order = await db.get(Order, order_id)
    if order is None:
        raise OrderNotFound(order_id)
    if order.completed_at is not None:
        raise OrderAlreadyCompleted(order_id, order.completed_at)

    now = datetime.now(timezone.utc)
    # A directly-completed order was implicitly accepted at the same moment;
    # leaving accepted_at NULL would lose that it was ever picked up.
    if order.accepted_at is None:
        order.accepted_at = now
        order.accepted_by = completed_by
    order.completed_at = now
    order.completed_by = completed_by
    order.completion_note = note
    order.status = OrderStatus.COMPLETED.value

    await db.flush()
    await db.refresh(order)
    return order
