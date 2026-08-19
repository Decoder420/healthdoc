"""Tests for per-role notification preferences (opt-out). Tested
directly against the service layer, no HTTP/JWT needed.
"""
import uuid

import pytest

from app.notifications import service
from app.users.models import Facility

pytestmark = pytest.mark.asyncio


async def _make_facility(db):
    facility_id = uuid.uuid4()
    db.add(Facility(id=facility_id, code=f"F{uuid.uuid4().hex[:4]}", name="Test Facility", state_code="TS"))
    await db.flush()
    return facility_id


async def test_list_returns_empty_when_nothing_set(db):
    facility_id = await _make_facility(db)
    preferences = await service.list_notification_preferences(db, facility_id)
    assert preferences == []


async def test_set_creates_new_preference(db):
    facility_id = await _make_facility(db)
    caller_id = uuid.uuid4()

    preference = await service.set_notification_preference(
        db, facility_id, role="nurse", event_type="low_stock_alert", is_enabled=False,
        caller_user_id=caller_id,
    )

    assert preference.role == "nurse"
    assert preference.event_type == "low_stock_alert"
    assert preference.is_enabled is False
    assert preference.created_by == caller_id


async def test_set_updates_existing_preference_instead_of_duplicating(db):
    facility_id = await _make_facility(db)
    caller_id = uuid.uuid4()

    first = await service.set_notification_preference(
        db, facility_id, role="nurse", event_type="low_stock_alert", is_enabled=False,
        caller_user_id=caller_id,
    )
    second = await service.set_notification_preference(
        db, facility_id, role="nurse", event_type="low_stock_alert", is_enabled=True,
        caller_user_id=caller_id,
    )

    assert first.id == second.id  # same row, updated in place
    assert second.is_enabled is True

    all_preferences = await service.list_notification_preferences(db, facility_id)
    assert len(all_preferences) == 1  # not two rows


async def test_set_records_updated_by_on_update(db):
    facility_id = await _make_facility(db)
    creator_id = uuid.uuid4()
    updater_id = uuid.uuid4()

    await service.set_notification_preference(
        db, facility_id, role="nurse", event_type="low_stock_alert", is_enabled=False,
        caller_user_id=creator_id,
    )
    updated = await service.set_notification_preference(
        db, facility_id, role="nurse", event_type="low_stock_alert", is_enabled=True,
        caller_user_id=updater_id,
    )

    assert updated.created_by == creator_id  # unchanged
    assert updated.updated_by == updater_id


async def test_list_scoped_to_facility(db):
    facility_a = await _make_facility(db)
    facility_b = await _make_facility(db)
    caller_id = uuid.uuid4()

    await service.set_notification_preference(
        db, facility_a, role="nurse", event_type="low_stock_alert", is_enabled=False,
        caller_user_id=caller_id,
    )
    await service.set_notification_preference(
        db, facility_b, role="nurse", event_type="low_stock_alert", is_enabled=False,
        caller_user_id=caller_id,
    )

    facility_a_preferences = await service.list_notification_preferences(db, facility_a)
    assert len(facility_a_preferences) == 1
    assert facility_a_preferences[0].facility_id == facility_a


async def test_different_event_types_create_separate_rows(db):
    facility_id = await _make_facility(db)
    caller_id = uuid.uuid4()

    await service.set_notification_preference(
        db, facility_id, role="nurse", event_type="low_stock_alert", is_enabled=False,
        caller_user_id=caller_id,
    )
    await service.set_notification_preference(
        db, facility_id, role="nurse", event_type="token_called", is_enabled=False,
        caller_user_id=caller_id,
    )

    preferences = await service.list_notification_preferences(db, facility_id)
    assert len(preferences) == 2
