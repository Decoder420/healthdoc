"""Tests for task 7's roster + queue pause/resume service functions.
Tested directly against the service layer, not through HTTP -- no real
JWT needed, uses the existing SQLite db fixture from conftest.py.
"""
import uuid
from datetime import date

import pytest

from app.departments.models import Department
from app.queue import service
from app.queue.models import Queue
from app.users.models import Facility, User

pytestmark = pytest.mark.asyncio


async def _make_facility_and_department(db):
    facility_id = uuid.uuid4()
    department_id = uuid.uuid4()
    db.add(Facility(id=facility_id, code=f"F{uuid.uuid4().hex[:4]}", name="Test Facility", state_code="TS"))
    db.add(Department(id=department_id, code=f"D{uuid.uuid4().hex[:4]}", name="Test Dept", facility_id=facility_id))
    await db.flush()
    return facility_id, department_id


# ---------------- ROSTER: CREATE ----------------
async def test_create_roster_entry_succeeds_for_admin(db):
    facility_id, department_id = await _make_facility_and_department(db)
    staff_id = uuid.uuid4()

    entry = await service.create_roster_entry(
        db,
        staff_user_id=staff_id,
        department_id=department_id,
        room_id=None,
        shift="morning",
        roster_date=date.today(),
        caller_facility_id=facility_id,
        caller_roles=["admin"],
        caller_department_id=None,
    )
    assert entry.staff_user_id == staff_id
    assert entry.is_available is True  # default


async def test_create_roster_entry_rejects_non_hod_non_admin(db):
    facility_id, department_id = await _make_facility_and_department(db)

    with pytest.raises(Exception) as exc_info:
        await service.create_roster_entry(
            db,
            staff_user_id=uuid.uuid4(),
            department_id=department_id,
            room_id=None,
            shift="morning",
            roster_date=date.today(),
            caller_facility_id=facility_id,
            caller_roles=["doctor"],
            caller_department_id=None,
        )
    assert "403" in str(exc_info.value) or "Only hod or admin" in str(exc_info.value)


async def test_create_roster_entry_rejects_hod_wrong_department(db):
    facility_id, department_id = await _make_facility_and_department(db)
    other_department_id = uuid.uuid4()

    with pytest.raises(Exception) as exc_info:
        await service.create_roster_entry(
            db,
            staff_user_id=uuid.uuid4(),
            department_id=department_id,
            room_id=None,
            shift="morning",
            roster_date=date.today(),
            caller_facility_id=facility_id,
            caller_roles=["hod"],
            caller_department_id=other_department_id,
        )
    assert "own department" in str(exc_info.value)


# ---------------- ROSTER: AVAILABILITY + NOTIFY CASCADE ----------------
async def test_availability_change_by_admin_produces_notification(db):
    facility_id, department_id = await _make_facility_and_department(db)
    staff_id = uuid.uuid4()
    db.add(User(
        id=staff_id, keycloak_sub=f"sub-{uuid.uuid4()}", username=f"u{uuid.uuid4().hex[:6]}",
        full_name="Dr. Test", facility_id=facility_id,
    ))
    await db.flush()

    entry = await service.create_roster_entry(
        db, staff_id, department_id, None, "morning", date.today(),
        facility_id, ["admin"], None,
    )

    updated_entry, pending_event = await service.update_roster_availability(
        db, entry.id, is_available=False,
        caller_facility_id=facility_id, caller_roles=["admin"], caller_department_id=None,
    )
    assert updated_entry.is_available is False
    assert pending_event is not None
    assert pending_event["event_type"] == "roster_availability_changed"
    assert pending_event["payload"]["is_available"] is False


async def test_availability_change_by_hod_produces_no_notification(db):
    facility_id, department_id = await _make_facility_and_department(db)
    staff_id = uuid.uuid4()

    entry = await service.create_roster_entry(
        db, staff_id, department_id, None, "morning", date.today(),
        facility_id, ["hod"], department_id,
    )

    updated_entry, pending_event = await service.update_roster_availability(
        db, entry.id, is_available=False,
        caller_facility_id=facility_id, caller_roles=["hod"], caller_department_id=department_id,
    )
    assert updated_entry.is_available is False
    assert pending_event is None  # <<< the key assertion: hod acting themselves gets no notification


# ---------------- QUEUE: PAUSE / RESUME + NOTIFY CASCADE ----------------
async def test_pause_queue_by_hod_produces_notification(db):
    facility_id, department_id = await _make_facility_and_department(db)
    doctor_id = uuid.uuid4()
    db.add(User(
        id=doctor_id, keycloak_sub=f"doc-{uuid.uuid4()}", username=f"doc{uuid.uuid4().hex[:6]}",
        full_name="Dr. Pause", facility_id=facility_id,
    ))
    await db.flush()

    queue = Queue(
        id=uuid.uuid4(), facility_id=facility_id, department_id=department_id,
        doctor_user_id=doctor_id, service_date=date.today(), is_open=True,
    )
    db.add(queue)
    await db.flush()

    updated_queue, pending_event = await service.pause_queue(
        db, queue.id, caller_facility_id=facility_id, caller_roles=["hod"], caller_department_id=department_id,
    )
    assert updated_queue.is_open is False
    assert pending_event is not None
    assert pending_event["event_type"] == "queue_paused"
    assert pending_event["payload"]["is_open"] is False


async def test_pause_queue_rejects_doctor(db):
    facility_id, department_id = await _make_facility_and_department(db)
    doctor_id = uuid.uuid4()
    queue = Queue(
        id=uuid.uuid4(), facility_id=facility_id, department_id=department_id,
        doctor_user_id=doctor_id, service_date=date.today(), is_open=True,
    )
    db.add(queue)
    await db.flush()

    with pytest.raises(Exception) as exc_info:
        await service.pause_queue(
            db, queue.id, caller_facility_id=facility_id, caller_roles=["doctor"], caller_department_id=None,
        )
    assert "Only hod or admin" in str(exc_info.value)


async def test_resume_queue_sets_is_open_true(db):
    facility_id, department_id = await _make_facility_and_department(db)
    doctor_id = uuid.uuid4()
    queue = Queue(
        id=uuid.uuid4(), facility_id=facility_id, department_id=department_id,
        doctor_user_id=doctor_id, service_date=date.today(), is_open=False,
    )
    db.add(queue)
    await db.flush()

    updated_queue, pending_event = await service.resume_queue(
        db, queue.id, caller_facility_id=facility_id, caller_roles=["admin"], caller_department_id=None,
    )
    assert updated_queue.is_open is True
    assert pending_event["event_type"] == "queue_resumed"
