"""Notification preferences on the publish path (#400).

Follow-up to #230: notification_preferences (0044) was honoured when
reading history, but publish_event() and the SSE fan-out never checked it
-- a role that silenced an event_type still saw it arrive live, so the
setting appeared to work and didn't.

publish_event() itself can't filter by role: it's a pure broadcast to a
Redis channel with no caller in scope. The fix lives where the caller
*is* known -- the SSE endpoints in notifications/router.py -- via two
helpers:

  service.is_enabled_for_any_roles() -- the live-path check. A caller can
  hold more than one role, so an event is suppressed only if every role
  they hold has silenced it; showing it is the safe default.

  router._filter_by_preferences() -- the same ALL-roles-silenced rule
  applied to the reconnect/Last-Event-ID catch-up batch, so a client that
  reconnects doesn't see silenced events either.
"""
from __future__ import annotations

import uuid

import pytest

from app.notifications.models import NotificationHistory
from app.notifications.router import _filter_by_preferences
from app.notifications.service import is_enabled_for_any_roles, set_preference

pytestmark = pytest.mark.asyncio


@pytest.fixture
def scope():
    return uuid.uuid4(), uuid.uuid4()   # facility_id, actor_id


# ---------------- is_enabled_for_any_roles: the live-path check ----------------

async def test_visible_when_no_role_has_silenced_it(db, scope):
    facility_id, _ = scope
    assert await is_enabled_for_any_roles(
        db, facility_id=facility_id, roles=["nurse", "hod"],
        event_type="low_stock_alert",
    ) is True


async def test_suppressed_when_the_only_role_silenced_it(db, scope):
    facility_id, actor = scope
    await set_preference(db, facility_id=facility_id, role="nurse",
                         event_type="low_stock_alert", enabled=False, actor_id=actor)

    assert await is_enabled_for_any_roles(
        db, facility_id=facility_id, roles=["nurse"],
        event_type="low_stock_alert",
    ) is False


async def test_visible_when_only_some_of_several_roles_silenced_it(db, scope):
    """Safe default: showing wins unless every held role agrees to hide it.

    A caller holding both nurse and hod, where only nurse silenced this
    event_type, still sees it -- they're plausibly here as hod.
    """
    facility_id, actor = scope
    await set_preference(db, facility_id=facility_id, role="nurse",
                         event_type="low_stock_alert", enabled=False, actor_id=actor)
    # hod never touched this event_type -- stays enabled by default.

    assert await is_enabled_for_any_roles(
        db, facility_id=facility_id, roles=["nurse", "hod"],
        event_type="low_stock_alert",
    ) is True


async def test_suppressed_only_once_every_held_role_has_silenced_it(db, scope):
    facility_id, actor = scope
    await set_preference(db, facility_id=facility_id, role="nurse",
                         event_type="low_stock_alert", enabled=False, actor_id=actor)
    await set_preference(db, facility_id=facility_id, role="hod",
                         event_type="low_stock_alert", enabled=False, actor_id=actor)

    assert await is_enabled_for_any_roles(
        db, facility_id=facility_id, roles=["nurse", "hod"],
        event_type="low_stock_alert",
    ) is False


async def test_unrelated_event_type_is_untouched(db, scope):
    facility_id, actor = scope
    await set_preference(db, facility_id=facility_id, role="nurse",
                         event_type="low_stock_alert", enabled=False, actor_id=actor)

    assert await is_enabled_for_any_roles(
        db, facility_id=facility_id, roles=["nurse"],
        event_type="lab_critical_result",
    ) is True


# ---------------- _filter_by_preferences: the reconnect catch-up path ----------------

def _history_row(*, department_id, facility_id, event_type):
    return NotificationHistory(
        id=uuid.uuid4(), event_type=event_type, payload={},
        department_id=department_id, facility_id=facility_id,
    )


async def test_catch_up_drops_rows_silenced_for_every_held_role(db, scope):
    facility_id, actor = scope
    department_id = uuid.uuid4()
    await set_preference(db, facility_id=facility_id, role="nurse",
                         event_type="low_stock_alert", enabled=False, actor_id=actor)

    kept = _history_row(department_id=department_id, facility_id=facility_id,
                        event_type="lab_critical_result")
    dropped = _history_row(department_id=department_id, facility_id=facility_id,
                           event_type="low_stock_alert")

    result = await _filter_by_preferences(
        db, facility_id=facility_id, roles=["nurse"], rows=[kept, dropped],
    )
    assert result == [kept]


async def test_catch_up_keeps_rows_silenced_for_only_some_held_roles(db, scope):
    facility_id, actor = scope
    department_id = uuid.uuid4()
    await set_preference(db, facility_id=facility_id, role="nurse",
                         event_type="low_stock_alert", enabled=False, actor_id=actor)
    # hod hasn't silenced it -- caller holding both roles should still see it.

    row = _history_row(department_id=department_id, facility_id=facility_id,
                       event_type="low_stock_alert")

    result = await _filter_by_preferences(
        db, facility_id=facility_id, roles=["nurse", "hod"], rows=[row],
    )
    assert result == [row]


async def test_catch_up_with_no_roles_returns_rows_unchanged(db, scope):
    """Defensive only -- an authenticated caller always holds at least one of
    _STAFF_ROLES to have reached this endpoint at all."""
    facility_id, _ = scope
    department_id = uuid.uuid4()
    row = _history_row(department_id=department_id, facility_id=facility_id,
                       event_type="low_stock_alert")

    result = await _filter_by_preferences(
        db, facility_id=facility_id, roles=[], rows=[row],
    )
    assert result == [row]
