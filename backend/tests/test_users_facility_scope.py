"""Staff accounts are scoped to the admin's own facility (P0.4).

The module was cross-tenant in five ways at once: list took facility_id as an
OPTIONAL query parameter, so omitting it returned every staff account in the
deployment; get/update/activate/deactivate performed no facility check at all;
and create read facility_id from the request body, which — since Keycloak is
written first — could leave a real credential inside another hospital.

These tests exercise the route functions directly rather than over HTTP: the
routes carry `Depends(require_roles("admin"))` at router level, and what is
under test is the facility boundary, not the role gate.
"""
from __future__ import annotations

import uuid

import pytest
from fastapi import HTTPException

from app.users import router as users_router
from app.users.models import User
from app.users.schemas import UserUpdate
from app.users.models import Facility

pytestmark = pytest.mark.asyncio


class _Caller:
    """Stands in for CurrentDbUser — only facility_id is read by these routes."""

    def __init__(self, facility_id: uuid.UUID) -> None:
        self.facility_id = facility_id
        self.id = uuid.uuid4()


async def _facility(db) -> Facility:
    facility = Facility(
        id=uuid.uuid4(), code=f"F{uuid.uuid4().hex[:4].upper()}",
        name="Facility", state_code="TS",
    )
    db.add(facility)
    await db.flush()
    return facility


async def _user(db, facility_id, *, active: bool = True) -> User:
    user = User(
        id=uuid.uuid4(), keycloak_sub=f"sub-{uuid.uuid4().hex[:12]}",
        username=f"u{uuid.uuid4().hex[:8]}", full_name="Staff Member",
        facility_id=facility_id, is_active=active,
    )
    db.add(user)
    await db.flush()
    return user


async def test_list_returns_only_the_callers_facility(db):
    """The old signature made this omission-shaped: no facility_id, no scope."""
    ours, theirs = await _facility(db), await _facility(db)
    mine = await _user(db, ours.id)
    await _user(db, theirs.id)

    result = await users_router.list_users(_Caller(ours.id), db=db)

    assert [item["id"] for item in result["items"]] == [str(mine.id)]


async def test_list_takes_no_facility_argument():
    """Removed, not defaulted. An optional scope filter is one forgotten
    argument away from being no scope at all — which is what happened here."""
    import inspect

    assert "facility_id" not in inspect.signature(users_router.list_users).parameters


async def test_another_facilitys_user_is_not_readable(db):
    ours, theirs = await _facility(db), await _facility(db)
    stranger = await _user(db, theirs.id)

    with pytest.raises(HTTPException) as caught:
        await users_router.get_user(stranger.id, _Caller(ours.id), db=db)

    assert caught.value.status_code == 404, (
        "404 and not 403 — 403 confirms the id exists, turning this into an "
        "enumeration oracle for another facility's staff list"
    )


async def test_another_facilitys_user_cannot_be_updated(db):
    ours, theirs = await _facility(db), await _facility(db)
    stranger = await _user(db, theirs.id)

    with pytest.raises(HTTPException) as caught:
        await users_router.update_user(
            stranger.id, UserUpdate(full_name="Renamed"), _Caller(ours.id), db=db,
        )

    assert caught.value.status_code == 404
    await db.refresh(stranger)
    assert stranger.full_name == "Staff Member", "the write must not have landed"


async def test_another_facilitys_user_cannot_be_deactivated(db):
    """Disabling someone else's clinician is a denial-of-service on their ward,
    and it reaches Keycloak, so it is not undone by a database rollback."""
    ours, theirs = await _facility(db), await _facility(db)
    stranger = await _user(db, theirs.id, active=True)

    with pytest.raises(HTTPException) as caught:
        await users_router.deactivate_user(stranger.id, _Caller(ours.id), db=db)

    assert caught.value.status_code == 404
    await db.refresh(stranger)
    assert stranger.is_active is True


async def test_own_facility_user_is_readable(db):
    """The scoping must not break the ordinary case."""
    ours = await _facility(db)
    colleague = await _user(db, ours.id)

    result = await users_router.get_user(colleague.id, _Caller(ours.id), db=db)
    assert result["id"] == str(colleague.id)


async def test_create_refuses_a_foreign_facility_before_touching_keycloak(db):
    """Refused early, deliberately.

    create_user writes Keycloak first because it is the identity source of
    truth. A facility check discovered after that point would leave a usable
    credential for a hospital the caller has no rights over — so the check runs
    before any external call, and this test would hang or fail on a Keycloak
    connection if it ever moved.
    """
    from app.users.schemas import UserCreate

    ours, theirs = await _facility(db), await _facility(db)

    payload = UserCreate(
        username=f"u{uuid.uuid4().hex[:8]}", full_name="Intruder",
        facility_id=theirs.id, temporary_password="temp-password-1",
    )

    with pytest.raises(HTTPException) as caught:
        await users_router.create_user(payload, _Caller(ours.id), db=db)

    assert caught.value.status_code == 403
    assert caught.value.detail["code"] == "facility_mismatch"
