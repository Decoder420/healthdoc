"""Cross-facility reads and writes are refused (P0.4).

Four endpoints fetched a row by id and never compared its facility:

  * GET  /visits/{id}          — and carried no role dependency at all, so any
                                 authenticated account of any role could read
                                 any visit in the deployment
  * PATCH /visits/{id}/status  — a write: cancel another facility's visit
  * GET  /orders/{id}
  * GET|PATCH /encounters/{id} — PATCH rewrites a clinical note

Every one of these tables has carried facility_id for months (visits since
0007, orders since 0022, encounters since 0021). Nothing was reading it.

404 is asserted rather than 403 throughout: 403 confirms the id exists, which
is enough to enumerate another facility's visits, orders and encounters.

Exercised against the route functions directly. What is under test is the
facility boundary, not the role dependency, which FastAPI applies at the router.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

import pytest
from fastapi import HTTPException

from app.encounters import router as encounters_router
from app.opd import router as opd_router
from app.opd.models import Encounter, Visit
from app.orders import router as orders_router
from app.orders.models import Order
from app.patients.models import Patient
from app.users.models import Facility, User

pytestmark = pytest.mark.asyncio


class _Caller:
    """Stands in for CurrentDbUser — these routes read facility_id and id."""

    def __init__(self, facility_id: uuid.UUID) -> None:
        self.facility_id = facility_id
        self.id = uuid.uuid4()
        self.roles = ["doctor", "admin"]


async def _facility(db) -> Facility:
    facility = Facility(
        id=uuid.uuid4(), code=f"X{uuid.uuid4().hex[:4].upper()}",
        name="Facility", state_code="TS",
    )
    db.add(facility)
    await db.flush()
    return facility


async def _visit(db, facility_id) -> Visit:
    patient = Patient(
        id=uuid.uuid4(), uhid=f"UH{uuid.uuid4().hex[:8]}", full_name="Someone",
        sex="male", age_years=40, identity_path="demographics_only",
        identity_status="verified", facility_id=facility_id, created_by=uuid.uuid4(),
    )
    db.add(patient)
    await db.flush()

    visit = Visit(
        id=uuid.uuid4(), visit_number=f"VST-{uuid.uuid4().hex[:10]}",
        patient_id=patient.id, facility_id=facility_id, visit_type="opd",
        status="registered", visit_date=datetime.now(timezone.utc),
        created_by=uuid.uuid4(),
    )
    db.add(visit)
    await db.flush()
    return visit


async def test_visit_at_another_facility_is_not_readable(db):
    ours, theirs = await _facility(db), await _facility(db)
    stranger = await _visit(db, theirs.id)

    with pytest.raises(HTTPException) as caught:
        await opd_router.get_visit(stranger.id, _Caller(ours.id), db=db)

    assert caught.value.status_code == 404


async def test_own_facility_visit_is_readable(db):
    """The scoping must not break the ordinary case."""
    ours = await _facility(db)
    visit = await _visit(db, ours.id)

    result = await opd_router.get_visit(visit.id, _Caller(ours.id), db=db)
    assert result.id == visit.id


async def test_get_visit_now_carries_a_role_dependency():
    """It previously had none — only get_current_user — so every authenticated
    account could reach it regardless of role."""
    route = next(
        r for r in opd_router.router.routes
        if getattr(r, "path", None) == "/visits/{visit_id}" and "GET" in getattr(r, "methods", set())
    )
    assert route.dependant.dependencies, "GET /visits/{visit_id} must gate on role"


async def test_visit_status_cannot_be_changed_across_facilities(db):
    """A write. Without the scope, a receptionist could cancel another
    facility's visit."""
    from app.opd.schemas import VisitStatusUpdate

    ours, theirs = await _facility(db), await _facility(db)
    stranger = await _visit(db, theirs.id)

    with pytest.raises(HTTPException) as caught:
        await opd_router.update_visit_status(
            stranger.id,
            VisitStatusUpdate(status="cancelled", reason="not mine to cancel",
                              updated_by=uuid.uuid4()),
            _Caller(ours.id),
            db=db,
            if_match=str(stranger.row_version),
        )

    assert caught.value.status_code == 404
    await db.refresh(stranger)
    assert stranger.status == "registered", "the transition must not have landed"


async def test_order_at_another_facility_is_not_readable(db):
    ours, theirs = await _facility(db), await _facility(db)
    visit = await _visit(db, theirs.id)

    order = Order(
        id=uuid.uuid4(), order_number=f"ORD-{uuid.uuid4().hex[:10]}",
        encounter_id=uuid.uuid4(), patient_id=visit.patient_id,
        facility_id=theirs.id, order_type="lab", priority="routine",
        status="placed", ordered_at=datetime.now(timezone.utc),
        created_by=uuid.uuid4(),
    )
    db.add(order)
    await db.flush()

    with pytest.raises(HTTPException) as caught:
        await orders_router.get_order(order.id, _Caller(ours.id), db=db)

    assert caught.value.status_code == 404


async def test_encounter_at_another_facility_is_neither_readable_nor_writable(db):
    """The PATCH is the serious half: rewriting another hospital's clinical
    note, attributed to a clinician who never saw the patient."""
    from app.encounters.schemas import EncounterUpdate

    ours, theirs = await _facility(db), await _facility(db)
    visit = await _visit(db, theirs.id)

    encounter = Encounter(
        id=uuid.uuid4(), visit_id=visit.id, facility_id=theirs.id,
        provider_user_id=uuid.uuid4(), created_by=uuid.uuid4(),
    )
    db.add(encounter)
    await db.flush()

    with pytest.raises(HTTPException) as caught:
        await encounters_router.get_encounter(encounter.id, _Caller(ours.id), db=db)
    assert caught.value.status_code == 404

    with pytest.raises(HTTPException) as caught:
        await encounters_router.update_encounter(
            encounter.id,
            EncounterUpdate(subjective="written by the wrong hospital",
                            updated_by=uuid.uuid4()),
            _Caller(ours.id),
            db=db,
        )
    assert caught.value.status_code == 404

    await db.refresh(encounter)
    assert encounter.subjective is None, "the note must be untouched"



async def _user(db, facility_id) -> User:
    """patient_merge_log.requested_by is a real FK to users.id."""
    user = User(
        id=uuid.uuid4(), keycloak_sub=f"sub-{uuid.uuid4().hex[:12]}",
        username=f"u{uuid.uuid4().hex[:8]}", full_name="Actor",
        facility_id=facility_id,
    )
    db.add(user)
    await db.flush()
    return user


# ---------------------------------------------------------------- patient merge

async def _patient(db, facility_id) -> Patient:
    patient = Patient(
        id=uuid.uuid4(), uhid=f"UH{uuid.uuid4().hex[:8]}", full_name="Merge Subject",
        sex="female", age_years=33, identity_path="demographics_only",
        identity_status="verified", facility_id=facility_id, created_by=uuid.uuid4(),
    )
    db.add(patient)
    await db.flush()
    return patient


async def test_a_merge_cannot_be_requested_across_facilities(db):
    """A merge repoints every child row. Splicing one hospital's patient into
    another's is not an edit anyone can cleanly undo afterwards."""
    from app.patients.service import request_merge

    ours, theirs = await _facility(db), await _facility(db)
    mine = await _patient(db, ours.id)
    stranger = await _patient(db, theirs.id)

    with pytest.raises(ValueError, match="not found"):
        await request_merge(
            db,
            source_patient_id=stranger.id,
            target_patient_id=mine.id,
            source_type="duplicate_uhid",
            reason="not mine to merge",
            requested_by=uuid.uuid4(),
            caller_facility_id=ours.id,
        )


async def test_both_sides_of_a_merge_must_be_ours(db):
    """Neither direction: ours-into-theirs is the same splice as
    theirs-into-ours."""
    from app.patients.service import request_merge

    ours, theirs = await _facility(db), await _facility(db)
    mine = await _patient(db, ours.id)
    stranger = await _patient(db, theirs.id)

    with pytest.raises(ValueError, match="not found"):
        await request_merge(
            db,
            source_patient_id=mine.id,
            target_patient_id=stranger.id,
            source_type="duplicate_uhid",
            reason="still not mine",
            requested_by=uuid.uuid4(),
            caller_facility_id=ours.id,
        )


async def test_another_facilitys_merge_cannot_be_approved(db):
    """Maker-checker only means something if both parties belong to the
    hospital whose records are being merged."""
    from app.patients.models import PatientMergeLog
    from app.patients.service import approve_merge

    ours, theirs = await _facility(db), await _facility(db)
    source = await _patient(db, theirs.id)
    target = await _patient(db, theirs.id)
    requester = await _user(db, theirs.id)

    # Inserted directly rather than through request_merge: what is under test
    # is approve_merge's scope, and request_merge is already covered above.
    merge_log = PatientMergeLog(
        id=uuid.uuid4(), source_type="duplicate_uhid",
        source_patient_id=source.id, target_patient_id=target.id,
        requested_by=requester.id, status="pending",
        reason="their own merge, correctly raised",
        before_snapshot={"source": {}, "target": {}},
    )
    db.add(merge_log)
    await db.flush()

    with pytest.raises(ValueError, match="not found"):
        await approve_merge(
            db, merge_log_id=merge_log.id, approved_by=uuid.uuid4(),
            caller_facility_id=ours.id,
        )
