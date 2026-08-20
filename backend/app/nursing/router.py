"""backend/app/nursing/router.py -- /nursing endpoints (#390).

0023 created vitals, intake_output_records and the handover tables in July;
this module was a `/ping` stub until now, so none of it could be read or
written over the API. #193 (vitals chart + eMAR) and #210 (nurse task queue)
were blocked on it.

There is no DELETE. A nursing observation is a clinical record: corrections go
through a new entry, so the original and the correction are both visible.
"""
from __future__ import annotations

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status as http_status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentDbUser, require_roles
from app.common.db import get_db
from app.nursing import incidents, service
from app.nursing.schemas import (
    FluidBalanceOut, IncidentOut, IncidentReport, IncidentReviewRequest,
    IntakeOutputCreate, IntakeOutputOut,
    MedicationAdministrationCreate, MedicationAdministrationOut,
    OrderCompleteRequest, OrderTaskOut, VitalsCreate, VitalsOut,
)

router = APIRouter(prefix="/nursing", tags=["nursing"])

#: Who records observations at the bedside. Doctors included because in a small
#: facility the doctor often takes the observation themselves.
_RECORD_ROLES = ("nurse", "doctor", "admin")
_READ_ROLES = ("nurse", "doctor", "pharmacist", "admin")


@router.get("/ping")
async def ping() -> dict:
    return {"module": "nursing", "status": "ok"}


@router.post(
    "/vitals",
    response_model=VitalsOut,
    status_code=http_status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles(*_RECORD_ROLES))],
)
async def create_vitals(
    payload: VitalsCreate,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> VitalsOut:
    vitals = await service.record_vitals(db, payload, recorded_by=current_db_user.id)
    return VitalsOut.model_validate(vitals)


@router.get(
    "/patients/{patient_id}/vitals",
    response_model=list[VitalsOut],
    dependencies=[Depends(require_roles(*_READ_ROLES))],
)
async def get_patient_vitals(
    patient_id: UUID,
    current_db_user: CurrentDbUser,
    since: datetime | None = Query(default=None, description="Inclusive lower bound on measured_at."),
    until: datetime | None = Query(default=None, description="Inclusive upper bound on measured_at."),
    db: AsyncSession = Depends(get_db),
) -> list[VitalsOut]:
    """Time-series for #193's chart, oldest first.

    Spans OPD and IPD: vitals hang off an encounter or an admission, and a
    patient who was seen then admitted has both. Filtering by one would drop
    half the trend.
    """
    rows = await service.list_vitals(db, patient_id, since=since, until=until)
    return [VitalsOut.model_validate(r) for r in rows]


@router.post(
    "/medication-administrations",
    response_model=MedicationAdministrationOut,
    status_code=http_status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles("nurse", "admin"))],
)
async def create_medication_administration(
    payload: MedicationAdministrationCreate,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> MedicationAdministrationOut:
    """Record what happened to one prescribed dose: given, held or refused.

    Restricted to nurses: administration is theirs to record, and the eMAR is
    read in an adverse-event review as a statement of who did what.
    """
    record = await service.record_administration(db, payload, recorded_by=current_db_user.id)
    return MedicationAdministrationOut.model_validate(record)


@router.get(
    "/admissions/{admission_id}/medication-administrations",
    response_model=list[MedicationAdministrationOut],
    dependencies=[Depends(require_roles(*_READ_ROLES))],
)
async def get_admission_emar(
    admission_id: UUID,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> list[MedicationAdministrationOut]:
    rows = await service.list_administrations(db, admission_id)
    return [MedicationAdministrationOut.model_validate(r) for r in rows]


@router.post(
    "/intake-output",
    response_model=IntakeOutputOut,
    status_code=http_status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles(*_RECORD_ROLES))],
)
async def create_intake_output(
    payload: IntakeOutputCreate,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> IntakeOutputOut:
    record = await service.record_intake_output(db, payload, recorded_by=current_db_user.id)
    return IntakeOutputOut.model_validate(record)


@router.get(
    "/admissions/{admission_id}/fluid-balance",
    response_model=FluidBalanceOut,
    dependencies=[Depends(require_roles(*_READ_ROLES))],
)
async def get_fluid_balance(
    admission_id: UUID,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> FluidBalanceOut:
    return FluidBalanceOut(**await service.fluid_balance(db, admission_id))


# ============================================================ nurse task queue (#210)

@router.get(
    "/tasks",
    response_model=list[OrderTaskOut],
    dependencies=[Depends(require_roles(*_READ_ROLES))],
)
async def list_pending_tasks(
    current_db_user: CurrentDbUser,
    patient_id: UUID | None = Query(default=None),
    order_type: str | None = Query(default=None, description="lab | radiology | procedure | ..."),
    db: AsyncSession = Depends(get_db),
) -> list[OrderTaskOut]:
    """Doctor's orders still outstanding, oldest first.

    Outstanding is placed / accepted / in_progress. Cancelled orders are not
    tasks; completed ones carry their check-off evidence.
    """
    rows = await service.pending_orders(db, patient_id=patient_id, order_type=order_type)
    return [OrderTaskOut.model_validate(r) for r in rows]


@router.post(
    "/tasks/{order_id}/accept",
    response_model=OrderTaskOut,
    dependencies=[Depends(require_roles(*_RECORD_ROLES))],
)
async def accept_task(
    order_id: UUID,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> OrderTaskOut:
    """Take ownership. Idempotent — re-accepting keeps the first acceptance,
    because that is the one that says when the ward picked the order up."""
    try:
        order = await service.accept_order(db, order_id, accepted_by=current_db_user.id)
    except service.OrderNotFound:
        raise HTTPException(http_status.HTTP_404_NOT_FOUND, "order_not_found")
    return OrderTaskOut.model_validate(order)


@router.post(
    "/tasks/{order_id}/complete",
    response_model=OrderTaskOut,
    dependencies=[Depends(require_roles(*_RECORD_ROLES))],
)
async def complete_task(
    order_id: UUID,
    payload: OrderCompleteRequest,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> OrderTaskOut:
    """Check off an order: who, when, and optionally a note.

    Refuses a second check-off with 409. Overwriting the first timestamp and
    actor would destroy the only record that matters in a dispute about when
    something was actually done.
    """
    try:
        order = await service.complete_order(
            db, order_id, completed_by=current_db_user.id, note=payload.note)
    except service.OrderNotFound:
        raise HTTPException(http_status.HTTP_404_NOT_FOUND, "order_not_found")
    except service.OrderAlreadyCompleted as exc:
        raise HTTPException(
            http_status.HTTP_409_CONFLICT,
            detail={"code": "already_completed",
                    "message": f"order was completed at {exc.completed_at.isoformat()}"},
        ) from exc
    return OrderTaskOut.model_validate(order)


# ============================================================ incident register (#236)

@router.post(
    "/incidents",
    response_model=IncidentOut,
    status_code=http_status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles(*_RECORD_ROLES))],
)
async def report_incident(
    payload: IncidentReport,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> IncidentOut:
    """File a clinical incident (NABH DHS).

    Distinct from the DPDP/CERT-In data-breach path in 0022a — a patient fall
    and a leaked record have different reporters, reviewers and statutory
    clocks.
    """
    incident = await incidents.report_incident(
        db,
        facility_id=current_db_user.facility_id,
        reported_by=current_db_user.id,
        **payload.model_dump(exclude_none=False),
    )
    return IncidentOut.model_validate(incident)


@router.get(
    "/incidents",
    response_model=list[IncidentOut],
    dependencies=[Depends(require_roles("nurse", "doctor", "hod", "admin", "auditor"))],
)
async def list_incidents(
    current_db_user: CurrentDbUser,
    status: str | None = Query(default=None),
    patient_id: UUID | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
) -> list[IncidentOut]:
    rows = await incidents.list_incidents(
        db, current_db_user.facility_id, status=status, patient_id=patient_id)
    return [IncidentOut.model_validate(r) for r in rows]


@router.patch(
    "/incidents/{incident_id}/review",
    response_model=IncidentOut,
    dependencies=[Depends(require_roles("hod", "admin"))],
)
async def review_incident(
    incident_id: UUID,
    payload: IncidentReviewRequest,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> IncidentOut:
    """Advance an incident through review. There is no DELETE — an incident
    register that can be emptied is not a register."""
    try:
        incident = await incidents.review_incident(
            db, incident_id,
            status=payload.status,
            reviewed_by=current_db_user.id,
            root_cause=payload.root_cause,
            corrective_action=payload.corrective_action,
        )
    except incidents.IncidentNotFound:
        raise HTTPException(http_status.HTTP_404_NOT_FOUND, "incident_not_found")
    except incidents.IncidentClosureIncomplete as exc:
        raise HTTPException(
            http_status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": "closure_incomplete", "message": str(exc)},
        ) from exc
    return IncidentOut.model_validate(incident)
