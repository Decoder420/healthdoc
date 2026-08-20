"""Per-role notification preferences (#230).

The half of #230 that never shipped. What matters here is the default
direction: absence of a row means *enabled*, so a newly added event_type
reaches everyone rather than silently reaching no one.
"""
from __future__ import annotations

import uuid

import pytest

from app.notifications.service import (
    is_enabled, list_preferences, set_preference, silenced_event_types,
)

pytestmark = pytest.mark.asyncio


@pytest.fixture
def scope():
    return uuid.uuid4(), uuid.uuid4()   # facility_id, actor_id


async def test_absent_row_means_enabled(db, scope):
    """Opt-out, not opt-in.

    If this ever flips, every event_type added afterwards becomes invisible to
    every role until someone remembers to switch it on — and the one that
    matters most (lab_critical_result) is the one nobody notices missing.
    """
    facility_id, _ = scope
    assert await is_enabled(
        db, facility_id=facility_id, role="nurse", event_type="never_configured") is True


async def test_silencing_one_event_type_for_one_role(db, scope):
    facility_id, actor = scope
    await set_preference(db, facility_id=facility_id, role="nurse",
                         event_type="low_stock_alert", enabled=False, actor_id=actor)

    assert await is_enabled(db, facility_id=facility_id, role="nurse",
                            event_type="low_stock_alert") is False
    # Another role is untouched.
    assert await is_enabled(db, facility_id=facility_id, role="pharmacist",
                            event_type="low_stock_alert") is True
    # And another event_type for the same role is untouched.
    assert await is_enabled(db, facility_id=facility_id, role="nurse",
                            event_type="lab_critical_result") is True


async def test_preferences_do_not_leak_across_facilities(db, scope):
    """An admin at one hospital must not silence alerts at another."""
    facility_id, actor = scope
    other_facility = uuid.uuid4()
    await set_preference(db, facility_id=facility_id, role="nurse",
                         event_type="token_called", enabled=False, actor_id=actor)

    assert await is_enabled(db, facility_id=other_facility, role="nurse",
                            event_type="token_called") is True


async def test_re_enabling_updates_rather_than_deletes(db, scope):
    """The record of the earlier decision, and who made it, must survive."""
    facility_id, actor = scope
    await set_preference(db, facility_id=facility_id, role="nurse",
                         event_type="token_called", enabled=False, actor_id=actor)

    second_actor = uuid.uuid4()
    pref = await set_preference(db, facility_id=facility_id, role="nurse",
                                event_type="token_called", enabled=True, actor_id=second_actor)

    assert pref.enabled is True
    assert pref.updated_by == second_actor
    assert pref.created_by == actor, "the original decision's author is preserved"

    rows = await list_preferences(db, facility_id=facility_id)
    assert len(rows) == 1, "re-enabling must not create a second row"


async def test_setting_the_same_decision_twice_is_idempotent(db, scope):
    facility_id, actor = scope
    for _ in range(3):
        await set_preference(db, facility_id=facility_id, role="hod",
                             event_type="roster_availability_changed",
                             enabled=False, actor_id=actor)

    assert len(await list_preferences(db, facility_id=facility_id)) == 1


async def test_silenced_set_is_one_query_per_role(db, scope):
    facility_id, actor = scope
    for event_type in ("low_stock_alert", "token_called"):
        await set_preference(db, facility_id=facility_id, role="nurse",
                             event_type=event_type, enabled=False, actor_id=actor)
    # An explicitly-enabled row must not appear in the silenced set.
    await set_preference(db, facility_id=facility_id, role="nurse",
                         event_type="lab_critical_result", enabled=True, actor_id=actor)

    silenced = await silenced_event_types(db, facility_id=facility_id, role="nurse")
    assert silenced == {"low_stock_alert", "token_called"}


async def test_listing_can_be_filtered_to_one_role(db, scope):
    facility_id, actor = scope
    await set_preference(db, facility_id=facility_id, role="nurse",
                         event_type="token_called", enabled=False, actor_id=actor)
    await set_preference(db, facility_id=facility_id, role="pharmacist",
                         event_type="low_stock_alert", enabled=False, actor_id=actor)

    assert len(await list_preferences(db, facility_id=facility_id)) == 2
    nurse_only = await list_preferences(db, facility_id=facility_id, role="nurse")
    assert [p.event_type for p in nurse_only] == ["token_called"]
