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

import contextlib
import uuid
from datetime import datetime, timezone

import pytest
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

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


# ---------------------------------------------------------------- allergies + incidents

async def test_another_facilitys_allergy_register_is_not_readable(db):
    """The prescribing gate reads this register on every save, and an allergy
    marked refuted by someone who never saw the patient is the failure 0032's
    status enum exists to prevent."""
    from app.allergies import router as allergies_router

    ours, theirs = await _facility(db), await _facility(db)
    stranger = await _patient(db, theirs.id)

    with pytest.raises(HTTPException) as caught:
        await allergies_router.list_patient_allergies(
            stranger.id, _Caller(ours.id), include_inactive=False, db=db,
        )

    assert caught.value.status_code == 404


async def test_another_facilitys_incident_cannot_be_reviewed(db):
    """Closing an incident demands a root cause and a corrective action, so a
    cross-facility close records our words against their register."""
    from app.nursing.incidents import IncidentNotFound, report_incident, review_incident

    ours, theirs = await _facility(db), await _facility(db)

    incident = await report_incident(
        db, facility_id=theirs.id, reported_by=uuid.uuid4(),
        incident_type="patient_fall", severity="minor",
        occurred_at=datetime.now(timezone.utc),
        description="Their incident, their register.",
        immediate_action="Assessed by their staff.",
    )

    with pytest.raises(IncidentNotFound):
        await review_incident(
            db, incident.id, status="under_review", reviewed_by=uuid.uuid4(),
            caller_facility_id=ours.id,
        )


# ---------------------------------------------------------------- radiology

async def _radiology_item(db, facility_id):
    """radiology_order_items has no facility_id of its own — it reaches one
    through order_id -> orders.facility_id, which is why every handler in that
    module was able to skip the comparison without it looking wrong."""
    from app.radiology.models import RadiologyOrderItem

    visit = await _visit(db, facility_id)
    order = Order(
        id=uuid.uuid4(), order_number=f"ORD-{uuid.uuid4().hex[:10]}",
        encounter_id=uuid.uuid4(), patient_id=visit.patient_id,
        facility_id=facility_id, order_type="radiology", priority="routine",
        status="placed", ordered_at=datetime.now(timezone.utc),
        created_by=uuid.uuid4(),
    )
    db.add(order)
    await db.flush()

    item = RadiologyOrderItem(
        id=uuid.uuid4(), order_id=order.id,
        accession_number=f"RAD{uuid.uuid4().hex[:10]}",
        modality="ct", scan_type="CT head plain", status="scanned",
        created_by=uuid.uuid4(),
    )
    db.add(item)
    await db.flush()
    return item


async def test_radiology_worklist_lists_only_our_own_scans(db):
    """The list had no join and no role dependency: every radiology item in the
    deployment, paged, filterable by status, to any authenticated account."""
    from app.radiology import router as radiology_router

    ours, theirs = await _facility(db), await _facility(db)
    mine = await _radiology_item(db, ours.id)
    await _radiology_item(db, theirs.id)

    listing = await radiology_router.list_radiology_order_items(
        _Caller(ours.id), page=1, page_size=100, status=None, db=db,
    )

    returned = {row.id for row in listing.items}
    assert returned == {mine.id}
    assert listing.total == 1, "the count must be scoped too, not just the page"


async def test_another_facilitys_scan_cannot_be_signed_off(db):
    """A signed radiology report is the version a clinician acts on. Without
    the scope this writes one against another hospital's scan, attributed to a
    doctor who never saw the images."""
    from app.radiology import router as radiology_router
    from app.radiology.models import RadiologyReport
    from app.radiology.schemas import RadiologyReportSignOff

    ours, theirs = await _facility(db), await _facility(db)
    stranger = await _radiology_item(db, theirs.id)

    draft = RadiologyReport(
        id=uuid.uuid4(), radiology_order_item_id=stranger.id, version=1,
        is_current=True, findings="Their radiologist's findings.",
        impression="Their impression.", status="preliminary",
        created_by=uuid.uuid4(),
    )
    db.add(draft)
    await db.flush()

    # Deliberately tolerant of *how* an unscoped sign-off fails. Verified
    # against the un-fixed code, it does not raise HTTPException at all: it
    # runs the whole transition and then trips on a refresh, several statements
    # after their report has already been superseded. Asserting on the
    # exception type would have made this test go red for that incidental
    # reason rather than for the write it is meant to catch. What is asserted
    # is the surviving state.
    with contextlib.suppress(HTTPException, SQLAlchemyError):
        await radiology_router.sign_off_radiology_report(
            _Caller(ours.id), stranger.id,
            RadiologyReportSignOff(findings="Signed by the wrong hospital",
                                   impression="Signed by the wrong hospital"),
            db=db,
        )

    surviving = (await db.execute(
        select(RadiologyReport)
        .where(RadiologyReport.radiology_order_item_id == stranger.id)
    )).scalars().all()

    assert len(surviving) == 1, "no second version may have been written"
    assert surviving[0].is_current is True, "their report must still be current"
    assert surviving[0].status == "preliminary", "it must not have been finalised"
    assert surviving[0].findings == "Their radiologist's findings."


async def test_another_facilitys_fhir_bundle_is_not_readable(db):
    """The bundle carries patient demographics alongside findings and
    impression. This route had no role dependency either."""
    from app.radiology import router as radiology_router
    from app.radiology.models import RadiologyReport

    ours, theirs = await _facility(db), await _facility(db)
    stranger = await _radiology_item(db, theirs.id)

    # A signed report has to exist, or the un-fixed code stops at "no report
    # yet" (409) and the test would pass for a reason unrelated to scoping.
    db.add(RadiologyReport(
        id=uuid.uuid4(), radiology_order_item_id=stranger.id, version=1,
        is_current=True, findings="Their findings.", impression="Their impression.",
        status="final", created_by=uuid.uuid4(),
    ))
    await db.flush()

    with pytest.raises(HTTPException) as caught:
        await radiology_router.get_fhir_bundle(_Caller(ours.id), stranger.id, db=db)

    assert caught.value.status_code == 404


async def test_a_scan_cannot_be_attached_to_another_facilitys_order(db):
    """The accession number is allocated from the caller's counter, so this
    would stamp our sequence onto their order.

    Verification note: unlike the other three, removing the facility predicate
    does not make this fail on its assertion. Control runs past the boundary
    into allocate_accession_number and dies there on SQLite, which has no
    `timezone` function for the business-date expression. That still
    demonstrates the hole — reaching the allocator at all is the bug — but the
    404 below is only properly exercised by the fixed code. Do not read a green
    run here as proof on its own.
    """
    from app.radiology import router as radiology_router
    from app.radiology.schemas import RadiologyOrderItemCreate

    ours, theirs = await _facility(db), await _facility(db)
    stranger = await _radiology_item(db, theirs.id)

    with pytest.raises(HTTPException) as caught:
        await radiology_router.create_radiology_order_item(
            _Caller(ours.id),
            RadiologyOrderItemCreate(modality="ct", scan_type="CT head plain"),
            order_id=stranger.order_id, db=db,
        )

    assert caught.value.status_code == 404
