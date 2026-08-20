"""Tests for bed occupancy: admit/transfer race-condition handling and
the ward bed grid. Tested directly against the service layer, no
HTTP/JWT needed.
"""
import uuid
from contextlib import contextmanager
from datetime import date, datetime, timezone

import pytest
from sqlalchemy import event
from sqlalchemy.engine import Engine

from app.admissions import service
from app.admissions.models import Admission, Bed, Ward
from app.opd.models import Visit
from app.patients.models import Patient
from app.users.models import Facility

pytestmark = pytest.mark.asyncio


async def _make_facility(db):
    facility_id = uuid.uuid4()
    db.add(Facility(id=facility_id, code=f"F{uuid.uuid4().hex[:4]}", name="Test Facility", state_code="TS"))
    await db.flush()
    return facility_id


async def _make_patient(db, facility_id):
    patient_id = uuid.uuid4()
    db.add(Patient(
        id=patient_id, uhid=f"UHID{uuid.uuid4().hex[:8]}", full_name="Test Patient",
        sex="male", dob=date(1990, 1, 1), facility_id=facility_id,
        identity_path="demographics_only", identity_status="verified",
        created_by=uuid.uuid4(),
    ))
    await db.flush()
    return patient_id


async def _make_visit(db, patient_id, facility_id):
    visit_id = uuid.uuid4()
    db.add(Visit(
        id=visit_id, visit_number=f"V{uuid.uuid4().hex[:8]}", patient_id=patient_id,
        facility_id=facility_id, visit_type="ipd", visit_date=datetime.now(timezone.utc),
        created_by=uuid.uuid4(),
    ))
    await db.flush()
    return visit_id


async def _make_ward_and_bed(db, facility_id, bed_status="vacant"):
    ward_id = uuid.uuid4()
    bed_id = uuid.uuid4()
    db.add(Ward(id=ward_id, name="Test Ward", facility_id=facility_id))
    db.add(Bed(id=bed_id, ward_id=ward_id, bed_number="B1", status=bed_status))
    await db.flush()
    return ward_id, bed_id


async def test_admit_patient_succeeds_into_vacant_bed(db):
    facility_id = await _make_facility(db)
    patient_id = await _make_patient(db, facility_id)
    visit_id = await _make_visit(db, patient_id, facility_id)
    ward_id, bed_id = await _make_ward_and_bed(db, facility_id)

    admission = await service.admit_patient(
        db, visit_id=visit_id, ward_id=ward_id, bed_id=bed_id, created_by=uuid.uuid4(),
    )
    assert admission.status == "admitted"

    bed = await db.get(Bed, bed_id)
    assert bed.status == "occupied"


async def test_admit_patient_rejects_occupied_bed(db):
    facility_id = await _make_facility(db)
    patient_id = await _make_patient(db, facility_id)
    visit_id = await _make_visit(db, patient_id, facility_id)
    ward_id, bed_id = await _make_ward_and_bed(db, facility_id, bed_status="occupied")

    with pytest.raises(service.BedNotAvailable):
        await service.admit_patient(
            db, visit_id=visit_id, ward_id=ward_id, bed_id=bed_id, created_by=uuid.uuid4(),
        )


async def test_admit_patient_rejects_maintenance_bed(db):
    facility_id = await _make_facility(db)
    patient_id = await _make_patient(db, facility_id)
    visit_id = await _make_visit(db, patient_id, facility_id)
    ward_id, bed_id = await _make_ward_and_bed(db, facility_id, bed_status="maintenance")

    with pytest.raises(service.BedNotAvailable):
        await service.admit_patient(
            db, visit_id=visit_id, ward_id=ward_id, bed_id=bed_id, created_by=uuid.uuid4(),
        )


async def test_admit_patient_catches_race_condition(db):
    """NOTE: this only proves the upfront status check works correctly
    when re-run against a bed that's been reset to vacant -- it does
    NOT prove the real uq_admissions_active_bed race is caught, since
    SQLite's IntegrityError carries no `sqlstate` attribute (that's a
    Postgres/psycopg2 concept), so our `sqlstate == "23505"` check can
    never match here and the code falls through to re-raising the raw
    error. The real proof of that is
    test_admissions_concurrency.py's test_concurrent_admission_never_double_books_bed,
    which runs against real Postgres with two genuinely separate
    sessions."""
    facility_id = await _make_facility(db)
    patient_id = await _make_patient(db, facility_id)
    visit_id = await _make_visit(db, patient_id, facility_id)
    ward_id, bed_id = await _make_ward_and_bed(db, facility_id)

    await service.admit_patient(
        db, visit_id=visit_id, ward_id=ward_id, bed_id=bed_id, created_by=uuid.uuid4(),
    )

    bed = await db.get(Bed, bed_id)
    bed.status = "vacant"
    await db.flush()

    visit_id_2 = await _make_visit(db, patient_id, facility_id)
    # On SQLite this raises the raw IntegrityError, not BedNotAvailable --
    # see the docstring above. Asserting that honestly rather than
    # asserting the wrong (currently unreachable-on-SQLite) exception.
    with pytest.raises(Exception):
        await service.admit_patient(
            db, visit_id=visit_id_2, ward_id=ward_id, bed_id=bed_id, created_by=uuid.uuid4(),
        )


async def test_ward_bed_grid_shows_occupant(db):
    facility_id = await _make_facility(db)
    patient_id = await _make_patient(db, facility_id)
    visit_id = await _make_visit(db, patient_id, facility_id)
    ward_id, bed_id = await _make_ward_and_bed(db, facility_id)

    await service.admit_patient(
        db, visit_id=visit_id, ward_id=ward_id, bed_id=bed_id, created_by=uuid.uuid4(),
    )

    grid = await service.get_ward_bed_grid(db, ward_id, facility_id)
    assert len(grid) == 1
    assert grid[0]["status"] == "occupied"
    assert grid[0]["occupant"]["patient_name"] == "Test Patient"


async def test_ward_bed_grid_shows_vacant_bed_with_no_occupant(db):
    facility_id = await _make_facility(db)
    ward_id, bed_id = await _make_ward_and_bed(db, facility_id)

    grid = await service.get_ward_bed_grid(db, ward_id, facility_id)
    assert len(grid) == 1
    assert grid[0]["status"] == "vacant"
    assert grid[0]["occupant"] is None


async def test_ward_bed_grid_rejects_wrong_facility(db):
    facility_id = await _make_facility(db)
    other_facility_id = uuid.uuid4()
    ward_id, _bed_id = await _make_ward_and_bed(db, facility_id)

    with pytest.raises(service.WardNotFound):
        await service.get_ward_bed_grid(db, ward_id, other_facility_id)


async def _make_ward_with_beds(db, facility_id, bed_numbers):
    ward_id = uuid.uuid4()
    db.add(Ward(id=ward_id, name="Test Ward", facility_id=facility_id))
    bed_ids = []
    for bed_number in bed_numbers:
        bed_id = uuid.uuid4()
        db.add(Bed(id=bed_id, ward_id=ward_id, bed_number=bed_number, status="vacant"))
        bed_ids.append(bed_id)
    await db.flush()
    return ward_id, bed_ids


@contextmanager
def _count_queries():
    """Every statement any engine executes inside the block.

    Listens on the Engine class rather than one bound engine so it works
    unchanged on SQLite and on Postgres — SQLAlchemy's async layer is a
    greenlet wrapper over the sync engine, so before_cursor_execute still
    fires.
    """
    statements = []

    def _on_execute(conn, cursor, statement, parameters, context, executemany):
        statements.append(statement)

    event.listen(Engine, "before_cursor_execute", _on_execute)
    try:
        yield statements
    finally:
        event.remove(Engine, "before_cursor_execute", _on_execute)


async def test_ward_bed_grid_lists_every_bed_in_a_mixed_ward(db):
    """The join that finds occupants must not hide the empty beds.

    Both grid tests above use a one-bed ward, so a query that dropped vacant
    beds — an inner join, or the admitted-status filter in WHERE where it
    belongs in ON — passed them both. A bed board that shows only occupied beds
    is worse than no bed board: it tells the ward it is full.
    """
    facility_id = await _make_facility(db)
    ward_id, bed_ids = await _make_ward_with_beds(db, facility_id, ["B1", "B2", "B3"])

    patient_id = await _make_patient(db, facility_id)
    visit_id = await _make_visit(db, patient_id, facility_id)
    await service.admit_patient(
        db, visit_id=visit_id, ward_id=ward_id, bed_id=bed_ids[1], created_by=uuid.uuid4(),
    )

    grid = await service.get_ward_bed_grid(db, ward_id, facility_id)

    assert [row["bed_number"] for row in grid] == ["B1", "B2", "B3"], \
        "every bed appears, in a stable order"
    occupied = [row for row in grid if row["occupant"] is not None]
    assert len(occupied) == 1
    assert occupied[0]["bed_id"] == bed_ids[1]
    assert occupied[0]["occupant"]["patient_name"] == "Test Patient"


async def test_ward_bed_grid_cost_does_not_grow_with_the_ward(db):
    """Pins the absence of the N+1, not a specific query count.

    The first version ran an admission lookup and a patient fetch per bed, so a
    40-bed ward cost 81 round trips on the screen a nurse refreshes most. A
    hardcoded expected count would break on unrelated session bookkeeping;
    what actually matters is that a six-times-larger ward costs the same.
    """
    facility_id = await _make_facility(db)
    small_ward, _ = await _make_ward_with_beds(db, facility_id, ["B1", "B2"])
    big_ward, _ = await _make_ward_with_beds(
        db, facility_id, [f"C{i:02d}" for i in range(1, 13)])

    with _count_queries() as small:
        await service.get_ward_bed_grid(db, small_ward, facility_id)
    with _count_queries() as big:
        await service.get_ward_bed_grid(db, big_ward, facility_id)

    assert len(big) == len(small), (
        f"grid cost scales with bed count: 2 beds took {len(small)} queries, "
        f"12 beds took {len(big)}"
    )
