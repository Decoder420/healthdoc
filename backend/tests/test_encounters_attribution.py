"""POST /encounters wrote three things it should never have taken from the body.

`create_encounter` accepted `current_db_user` as a parameter and never
referenced it. Authorship, the attending clinician, and the facility the record
lands in all came from the request. Line 1 of app/encounters/router.py has
always said "created_by/updated_by come from current_db_user, never the request
body" — the docstring was the specification and the code was the bug.

WHY THIS SURVIVED THE P0.4 AUDIT. That pass added `_get_scoped_encounter` and
routed every READ through it. A create has no encounter yet to scope: it
reaches facility through `visits`, and the visit lookup had no facility
predicate. The same join-scoping shape as the other P0.4 findings, on the write
side, where the consequence is a row written into another hospital rather than
a row read out of one.

WHY IT SURVIVED REVIEW. `create_review`, twenty lines below in the same file,
does it correctly — `reviewed_by=current_db_user.id, created_by=current_db_user.id`.
The module contains a correct example of the rule sitting next to a violation
of it, and reading either alone looks fine. Third time this release that
comparing siblings found the bug.

Service level rather than HTTP: the defects are all in what the service trusts,
and nothing here depends on a migration-only constraint, so the shared `db`
fixture is honest for once.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

import pytest

from app.encounters import service
from app.encounters.schemas import DiagnosisCreate, EncounterCreate, EncounterUpdate
from app.opd.models import Visit
from app.patients.models import Patient
from app.users.models import Facility, User


@pytest.fixture
async def visit(db, seed):
    dept, room, doctor = seed
    patient = Patient(
        id=uuid.uuid4(), uhid=f"UH{uuid.uuid4().hex[:8]}", facility_id=dept.facility_id,
        full_name="Attribution Patient", sex="female", age_years=41,
        identity_path="demographics_only", created_by=doctor.id,
    )
    db.add(patient)
    await db.flush()
    v = Visit(
        id=uuid.uuid4(), visit_number=f"V{uuid.uuid4().hex[:8]}", patient_id=patient.id,
        facility_id=dept.facility_id, department_id=dept.id, visit_type="opd",
        visit_date=datetime.now(timezone.utc), created_by=doctor.id,
    )
    db.add(v)
    await db.flush()
    return v, doctor


@pytest.fixture
async def other_facility(db):
    """A second hospital with its own visit and its own doctor.

    Every cross-facility assertion below needs a *real* row elsewhere, not a
    random UUID: a random id would be refused by the foreign key alone and the
    test would pass without the facility predicate ever running.
    """
    facility = Facility(id=uuid.uuid4(), code="OTH01", name="Other Hospital", state_code="OT")
    doctor = User(
        id=uuid.uuid4(), keycloak_sub=f"other-sub-{uuid.uuid4()}",
        username=f"otherdoc{uuid.uuid4().hex[:6]}", full_name="Dr. Elsewhere",
        facility_id=facility.id,
    )
    db.add_all([facility, doctor])
    await db.flush()
    return facility, doctor


async def test_authorship_comes_from_the_token_not_the_body(db, visit, other_facility):
    """created_by is the audit answer to "who wrote this". It is never the
    caller's to choose."""
    v, doctor = visit
    _, impostor = other_facility

    encounter = await service.create_encounter(
        db,
        EncounterCreate(visit_id=v.id, provider_user_id=doctor.id, created_by=impostor.id),
        actor_id=doctor.id,
        facility_id=v.facility_id,
    )

    assert encounter.created_by == doctor.id, (
        "the authenticated caller authored this, whatever the body claimed"
    )
    assert encounter.created_by != impostor.id


async def test_an_encounter_cannot_be_opened_on_another_hospitals_visit(
    db, visit, other_facility
):
    """The write-side leak.

    facility_id is copied from the visit that comes back, so an unscoped lookup
    does not merely read another hospital's data — it writes a clinical
    encounter into their records, under their facility_id, where their staff
    will see it on their worklists.
    """
    _, doctor = visit
    other_fac, other_doc = other_facility

    patient = Patient(
        id=uuid.uuid4(), uhid=f"UH{uuid.uuid4().hex[:8]}", facility_id=other_fac.id,
        full_name="Their Patient", sex="male", age_years=55,
        identity_path="demographics_only", created_by=other_doc.id,
    )
    db.add(patient)
    await db.flush()
    their_visit = Visit(
        id=uuid.uuid4(), visit_number=f"V{uuid.uuid4().hex[:8]}", patient_id=patient.id,
        facility_id=other_fac.id, department_id=None, visit_type="opd",
        visit_date=datetime.now(timezone.utc), created_by=other_doc.id,
    )
    db.add(their_visit)
    await db.flush()

    with pytest.raises(service.VisitNotFound):
        await service.create_encounter(
            db,
            EncounterCreate(visit_id=their_visit.id, provider_user_id=doctor.id),
            actor_id=doctor.id,
            facility_id=visit[0].facility_id,
        )


async def test_the_attending_must_be_a_user_of_this_facility(db, visit, other_facility):
    """provider_user_id is not forced to the caller — delegation is real — but
    it is no longer taken on trust.

    Unchecked, an encounter and every diagnosis under it could name a doctor at
    another hospital: a medico-legal record asserting a clinician saw a patient
    they have never met, in a facility they do not work at.
    """
    v, doctor = visit
    _, other_doc = other_facility

    with pytest.raises(service.ProviderNotInFacility):
        await service.create_encounter(
            db,
            EncounterCreate(visit_id=v.id, provider_user_id=other_doc.id),
            actor_id=doctor.id,
            facility_id=v.facility_id,
        )


async def test_a_deactivated_clinician_cannot_be_named_as_attending(db, visit, seed):
    """A departed clinician's account is deactivated, not deleted — the rows
    they authored must keep resolving. That is exactly why an is_active check is
    needed on the way in: without it, the account still satisfies the facility
    predicate and keeps appearing on new notes after they have left."""
    v, doctor = visit
    dept, _room, _doc = seed

    departed = User(
        id=uuid.uuid4(), keycloak_sub=f"gone-{uuid.uuid4()}",
        username=f"gone{uuid.uuid4().hex[:6]}", full_name="Dr. Departed",
        facility_id=dept.facility_id, is_active=False,
    )
    db.add(departed)
    await db.flush()

    with pytest.raises(service.ProviderNotInFacility):
        await service.create_encounter(
            db,
            EncounterCreate(visit_id=v.id, provider_user_id=departed.id),
            actor_id=doctor.id,
            facility_id=v.facility_id,
        )


async def test_delegation_still_works(db, visit, seed):
    """The case the fix must NOT break: a nurse opens the encounter for the
    doctor who will see the patient. Author and attending are different people
    and both are recorded — which is the whole reason provider_user_id cannot
    simply be overwritten with the caller."""
    v, doctor = visit
    dept, _room, _doc = seed

    nurse = User(
        id=uuid.uuid4(), keycloak_sub=f"nurse-{uuid.uuid4()}",
        username=f"nurse{uuid.uuid4().hex[:6]}", full_name="Nurse Test",
        facility_id=dept.facility_id,
    )
    db.add(nurse)
    await db.flush()

    encounter = await service.create_encounter(
        db,
        EncounterCreate(visit_id=v.id, provider_user_id=doctor.id),
        actor_id=nurse.id,
        facility_id=v.facility_id,
    )

    assert encounter.provider_user_id == doctor.id, "the attending is the doctor"
    assert encounter.created_by == nurse.id, "the author is the nurse who opened it"


async def test_a_patch_that_omits_updated_by_does_not_erase_the_last_editor(db, visit):
    """updated_by was assigned unconditionally from an optional field, so a
    PATCH that did not send it NULLed the last-editor of a clinical note —
    losing, rather than falsifying, an audit answer."""
    v, doctor = visit
    encounter = await service.create_encounter(
        db,
        EncounterCreate(visit_id=v.id, provider_user_id=doctor.id),
        actor_id=doctor.id,
        facility_id=v.facility_id,
    )

    updated = await service.update_encounter(
        db, encounter, EncounterUpdate(assessment="Viral fever"), actor_id=doctor.id,
    )

    assert updated.updated_by == doctor.id
    assert updated.assessment == "Viral fever"


async def test_a_diagnosis_is_attributed_to_the_caller(db, visit, other_facility):
    """The most consequential attribution in the record: a diagnosis drives
    billing, statutory reporting and the discharge summary."""
    v, doctor = visit
    _, impostor = other_facility

    encounter = await service.create_encounter(
        db,
        EncounterCreate(visit_id=v.id, provider_user_id=doctor.id),
        actor_id=doctor.id,
        facility_id=v.facility_id,
    )
    diagnosis = await service.create_diagnosis(
        db,
        DiagnosisCreate(
            encounter_id=encounter.id, created_by=impostor.id,
            icd_code="J11", icd_version="ICD-10", diagnosis_text="Influenza",
            diagnosis_type="provisional", is_primary=True,
        ),
        actor_id=doctor.id,
    )

    assert diagnosis.created_by == doctor.id
    assert diagnosis.created_by != impostor.id
