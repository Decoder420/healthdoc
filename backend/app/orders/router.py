"""backend/app/orders/router.py -- /orders endpoints. created_by comes
from current_db_user, never the request body."""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status as http_status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentDbUser, require_roles
from app.common.db import get_db
from app.allergies.service import AllergyConflict
from app.orders import results_worklist, service
from app.orders.schemas import (
    ResultWorklistItemOut,
    ResultWorklistOut,
    OrderCreate, OrderOut, PrescriptionCreate, PrescriptionItemOut, PrescriptionOut,
)

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderOut, status_code=http_status.HTTP_201_CREATED,
             dependencies=[Depends(require_roles("doctor", "nurse", "admin"))])
async def create_order(payload: OrderCreate, current_db_user: CurrentDbUser,
                        db: AsyncSession = Depends(get_db)) -> OrderOut:
    """No facility lookup here (see #362) -- create_order() resolves
    the business-date timezone from the encounter's own facility now,
    not the caller's. current_db_user.facility_id was never the right
    facility for this: it's whoever is logged in, which can legitimately
    differ from the facility the encounter/order actually belongs to.

    created_by, however, IS the caller's. It used to be a required body field
    written straight to orders.created_by, so any caller could file a lab test
    or a scan under a colleague's name — contradicting this module's docstring.
    A disagreeing body value is refused rather than silently overridden, so an
    attempted misattribution leaves a trace.
    """
    if payload.created_by is not None and payload.created_by != current_db_user.id:
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail={
                "code": "created_by_mismatch",
                "message": "created_by must be the authenticated user",
            },
        )
    payload.created_by = current_db_user.id

    try:
        order = await service.create_order(db, payload)
    except service.EncounterNotFound:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="encounter_not_found")
    return OrderOut.model_validate(order)


@router.get("/results-worklist", response_model=ResultWorklistOut,
            dependencies=[Depends(require_roles("doctor", "admin"))],
            summary="Lab and radiology results awaiting this doctor's review")
async def get_results_worklist(
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> ResultWorklistOut:
    """The doctor's outstanding results, lab and radiology ranked together.

    Registered BEFORE GET /{order_id}: both are one segment under /orders, so
    whichever is declared first wins, and "results-worklist" parsed as a UUID
    is a 422 that reads like a validation bug rather than a routing one.

    Scope follows queue.service.get_doctor_worklist — a doctor sees the orders
    they placed, an admin sees the facility. It is derived from the caller's
    roles, never from a query parameter: a doctor able to pass `all=true` would
    be reading colleagues' worklists, which is the thing the scope prevents.
    """
    rows = await results_worklist.get_results_worklist(
        db,
        caller_id=current_db_user.id,
        facility_id=current_db_user.facility_id,
        caller_roles=current_db_user.roles,
    )
    return ResultWorklistOut(
        items=[ResultWorklistItemOut(**row) for row in rows]
    )


@router.get("/{order_id}", response_model=OrderOut,
            dependencies=[Depends(require_roles("doctor", "nurse", "receptionist", "admin"))])
async def get_order(order_id: UUID, current_db_user: CurrentDbUser,
                     db: AsyncSession = Depends(get_db)) -> OrderOut:
    order = await service.get_order(db, order_id)
    # orders.facility_id has existed since 0022 and nothing was reading it here.
    # 404 rather than 403 — 403 confirms the id exists.
    if order is None or order.facility_id != current_db_user.facility_id:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="order_not_found")
    return OrderOut.model_validate(order)


@router.post("/prescriptions", response_model=PrescriptionOut, status_code=http_status.HTTP_201_CREATED,
             dependencies=[Depends(require_roles("doctor", "admin"))])
async def create_prescription(payload: PrescriptionCreate, current_db_user: CurrentDbUser,
                               db: AsyncSession = Depends(get_db)) -> PrescriptionOut:
    """created_by is taken from current_db_user, never the request body
    (PrescriptionCreate deliberately has no created_by field, unlike
    OrderCreate). AllergyConflict -> 409: retry the same request with
    override_reason set on the conflicting item (>=20 chars) unless the
    allergy is anaphylaxis, which can never be overridden by any role.
    Interaction warnings never block -- they come back on a 201 inside
    the response body, not as an error."""
    try:
        prescription, warnings = await service.create_prescription(
            db, payload, current_db_user.id,
        )
    except service.EncounterNotFound:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="encounter_not_found")
    except AllergyConflict as e:
        raise HTTPException(
            status_code=http_status.HTTP_409_CONFLICT,
            detail={
                "code": "allergy_conflict",
                "message": str(e),
                "absolute": e.absolute,
                "allergy_id": str(e.allergy.id),
            },
        )
    items = await service.get_prescription_items(db, prescription.id)
    return PrescriptionOut(
        id=prescription.id, encounter_id=prescription.encounter_id, facility_id=prescription.facility_id,
        patient_id=prescription.patient_id, notes=prescription.notes,
        created_at=prescription.created_at, updated_at=prescription.updated_at,
        items=[PrescriptionItemOut.model_validate(i) for i in items],
        interaction_warnings=warnings,
    )


@router.get("/prescriptions/{prescription_id}", response_model=PrescriptionOut,
            dependencies=[Depends(require_roles("doctor", "nurse", "pharmacist", "admin"))])
async def get_prescription(prescription_id: UUID, current_db_user: CurrentDbUser,
                            db: AsyncSession = Depends(get_db)) -> PrescriptionOut:
    prescription = await service.get_prescription(
        db, prescription_id, current_db_user.facility_id
    )
    if prescription is None:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="prescription_not_found")
    items = await service.get_prescription_items(db, prescription_id)
    return PrescriptionOut(
        id=prescription.id, encounter_id=prescription.encounter_id, facility_id=prescription.facility_id,
        patient_id=prescription.patient_id, notes=prescription.notes,
        created_at=prescription.created_at, updated_at=prescription.updated_at,
        items=[PrescriptionItemOut.model_validate(i) for i in items],
    )
