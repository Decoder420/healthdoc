"""
prescriptions module router - issue #182: e-prescription creation API
with prescription_items.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit.service import write_audit_log
from app.common.db import get_db
from app.auth.deps import require_roles, CurrentDbUser
from app.opd.models import Encounter
from app.prescriptions.schemas import PrescriptionCreate, PrescriptionOut, PrescriptionItemOut
from app.prescriptions.models import Prescription, PrescriptionItem

router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])

_ENCOUNTER_NOT_FOUND = HTTPException(404, "Encounter not found")


async def _get_scoped_encounter(
    db: AsyncSession, encounter_id, caller_facility_id
) -> Encounter:
    """Same shape as queue/service.py's _get_scoped_queue: 404 rather
    than 403 so a caller can't distinguish "doesn't exist" from
    "exists in another facility" by probing. Without this, any doctor
    could write a prescription against any facility's encounter_id --
    the FK alone only confirms the row exists somewhere, not that the
    caller is allowed to touch it."""
    result = await db.execute(select(Encounter).where(Encounter.id == encounter_id))
    encounter = result.scalar_one_or_none()
    if encounter is None or encounter.facility_id != caller_facility_id:
        raise _ENCOUNTER_NOT_FOUND
    return encounter


@router.post("", response_model=PrescriptionOut, status_code=201)
async def create_prescription(
    current_db_user: CurrentDbUser,
    payload: PrescriptionCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles("doctor")),
):
    if not payload.items:
        raise HTTPException(status_code=422, detail="At least one prescription item is required")

    encounter = await _get_scoped_encounter(db, payload.encounter_id, current_db_user.facility_id)

    prescription = Prescription(
        encounter_id=payload.encounter_id,
        patient_id=payload.patient_id,
        notes=payload.notes,
        created_by=current_db_user.id,
    )
    db.add(prescription)
    await db.flush()

    items = [
        PrescriptionItem(
            prescription_id=prescription.id,
            medicine_item_id=item_in.medicine_item_id,
            medicine_name=item_in.medicine_name,
            dosage=item_in.dosage,
            frequency=item_in.frequency,
            duration_days=item_in.duration_days,
            route=item_in.route,
            instructions=item_in.instructions,
            status="prescribed",
        )
        for item_in in payload.items
    ]
    db.add_all(items)
    await db.flush()

    # prescriptions/prescription_items have no facility_id column - reached
    # only via encounter -> visit -> facility_id (same as radiology_order_items).
    # Auto-audit (listeners.py) needs __audit_facility_id_field__ naming a real
    # column, which doesn't exist here - so this is the manual path, deliberately.
    # facility_id is the encounter's, not the caller's -- for a same-facility
    # write they're identical, but now that encounter_id is scope-checked
    # above, the audit trail must record which facility the prescription
    # actually belongs to, not which facility the doctor happened to be in.
    await write_audit_log(
        db,
        resource_type="prescriptions",
        resource_id=prescription.id,
        action="create",
        user_id=current_db_user.id,
        facility_id=encounter.facility_id,
    )

    await db.refresh(prescription)
    for item in items:
        await db.refresh(item)

    return PrescriptionOut(
        id=prescription.id,
        encounter_id=prescription.encounter_id,
        patient_id=prescription.patient_id,
        notes=prescription.notes,
        created_at=prescription.created_at,
        items=[PrescriptionItemOut.model_validate(item) for item in items],
    )
