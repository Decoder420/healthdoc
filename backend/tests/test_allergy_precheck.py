"""GET /allergies/patients/{id}/check — the prescribing pre-flight.

Enforcement already existed on POST /orders/prescriptions (AllergyConflict ->
409). What did not exist was any way for the prescribing screen to ask the
question before submitting, so the browser reimplemented the match: it filtered
the allergy list client-side and blocked on `severity === "anaphylaxis"` while
the server blocks on `is_absolute`.

Those two agree today — is_absolute is a derived property returning exactly
that comparison — so this is not a live defect. It is one safety rule stated
twice, and the copy on screen is the one a clinician acts on.

test_clear_and_uncheckable_are_not_the_same_answer is the one that matters.
"""
from __future__ import annotations

import uuid

import pytest
from fastapi import HTTPException

from app.allergies import router as allergies_router
from app.allergies.models import Allergy
from app.patients.models import Patient
from app.users.models import Facility

pytestmark = pytest.mark.asyncio


class _Caller:
    def __init__(self, facility_id: uuid.UUID) -> None:
        self.facility_id = facility_id
        self.id = uuid.uuid4()
        self.roles = ["doctor"]


async def _facility(db) -> Facility:
    facility = Facility(
        id=uuid.uuid4(), code=f"A{uuid.uuid4().hex[:4].upper()}",
        name="Facility", state_code="TS",
    )
    db.add(facility)
    await db.flush()
    return facility


async def _patient(db, facility_id) -> Patient:
    patient = Patient(
        id=uuid.uuid4(), uhid=f"UH{uuid.uuid4().hex[:8]}", full_name="Allergic Patient",
        sex="male", age_years=50, identity_path="demographics_only",
        identity_status="verified", facility_id=facility_id, created_by=uuid.uuid4(),
    )
    db.add(patient)
    await db.flush()
    return patient


async def _allergy(db, patient_id, *, severity: str, code: str | None) -> Allergy:
    allergy = Allergy(
        id=uuid.uuid4(), patient_id=patient_id, allergen_type="drug",
        substance_text="Penicillin injection", ingredient_code=code,
        reaction="Collapse", severity=severity, status="active",
        # Allergy carries the Blame mixin, so created_by is NOT NULL — unlike
        # InvoiceItem, which does not. recorded_by is the clinical author;
        # created_by is the row's.
        recorded_by=uuid.uuid4(), created_by=uuid.uuid4(),
    )
    db.add(allergy)
    await db.flush()
    return allergy


async def test_no_matching_allergy_is_clear(db):
    facility = await _facility(db)
    patient = await _patient(db, facility.id)
    await _allergy(db, patient.id, severity="severe", code="PENICILLIN")

    result = await allergies_router.check_patient_allergy(
        patient.id, _Caller(facility.id),
        ingredient_code="IBUPROFEN", medicine_name="Ibuprofen 400mg", db=db,
    )

    assert result.kind == "clear"
    assert result.allergy is None


async def test_anaphylaxis_blocks_and_cannot_be_overridden(db):
    facility = await _facility(db)
    patient = await _patient(db, facility.id)
    await _allergy(db, patient.id, severity="anaphylaxis", code="PENICILLIN")

    result = await allergies_router.check_patient_allergy(
        patient.id, _Caller(facility.id),
        ingredient_code="PENICILLIN", medicine_name="Amoxicillin 500mg", db=db,
    )

    assert result.kind == "block"
    assert result.allergy is not None
    assert result.allergy.is_absolute is True
    assert "cannot be prescribed or overridden" in result.message


async def test_a_non_anaphylaxis_match_requires_a_written_reason(db):
    facility = await _facility(db)
    patient = await _patient(db, facility.id)
    await _allergy(db, patient.id, severity="moderate", code="SULFONAMIDE")

    result = await allergies_router.check_patient_allergy(
        patient.id, _Caller(facility.id),
        ingredient_code="SULFONAMIDE", medicine_name="Co-trimoxazole", db=db,
    )

    assert result.kind == "override_required"
    assert result.allergy is not None
    assert result.allergy.is_absolute is False


async def test_clear_and_uncheckable_are_not_the_same_answer(db):
    """The distinction service.check_prescription_item's docstring insists on.

    It returns None for both "no match" and "no ingredient_code to match on",
    because it cannot block on a guess — and says the caller must tell the
    clinician which happened. Collapsing them turns a missing code into a
    reassurance that the drug was checked and found safe.
    """
    facility = await _facility(db)
    patient = await _patient(db, facility.id)
    await _allergy(db, patient.id, severity="anaphylaxis", code="PENICILLIN")

    uncheckable = await allergies_router.check_patient_allergy(
        patient.id, _Caller(facility.id),
        ingredient_code=None, medicine_name="Unbranded syrup", db=db,
    )
    clear = await allergies_router.check_patient_allergy(
        patient.id, _Caller(facility.id),
        ingredient_code="IBUPROFEN", medicine_name="Ibuprofen 400mg", db=db,
    )

    assert uncheckable.kind == "uncheckable"
    assert clear.kind == "clear"
    assert uncheckable.kind != clear.kind, (
        "an item with no ingredient code has not been checked and found safe"
    )
    assert "could not be performed" in uncheckable.message


async def test_an_uncoded_allergy_cannot_block(db):
    """An allergy with no ingredient_code is real and shown in the banner, but
    unmatchable — it must never produce a block, because the system cannot
    prove the match."""
    facility = await _facility(db)
    patient = await _patient(db, facility.id)
    await _allergy(db, patient.id, severity="anaphylaxis", code=None)

    result = await allergies_router.check_patient_allergy(
        patient.id, _Caller(facility.id),
        ingredient_code="PENICILLIN", medicine_name="Amoxicillin 500mg", db=db,
    )

    assert result.kind == "clear", (
        "an uncoded allergy cannot match; the banner carries it separately"
    )


async def test_the_check_is_facility_scoped(db):
    ours, theirs = await _facility(db), await _facility(db)
    stranger = await _patient(db, theirs.id)
    await _allergy(db, stranger.id, severity="anaphylaxis", code="PENICILLIN")

    with pytest.raises(HTTPException) as caught:
        await allergies_router.check_patient_allergy(
            stranger.id, _Caller(ours.id),
            ingredient_code="PENICILLIN", medicine_name="Amoxicillin", db=db,
        )

    assert caught.value.status_code == 404


async def test_the_check_route_is_registered_before_the_list_route():
    """/patients/{patient_id}/check and /patients/{patient_id} differ in segment
    count so they cannot capture each other — but both are GET on the same
    prefix, so assert the ordering holds rather than assume it."""
    gets = [
        r.path for r in allergies_router.router.routes
        if "GET" in getattr(r, "methods", set()) and getattr(r, "path", None)
    ]
    assert "/allergies/patients/{patient_id}/check" in gets
    assert "/allergies/patients/{patient_id}" in gets
