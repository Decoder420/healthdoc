"""Maker-checker for staff account creation (0028).

The table, the migration and the ORM model existed. There was no router, no
service, and nothing imported the model — so `user_account_requests` was not in
`Base.metadata` and the SQLite fixture never created it. A governance control
with a schema and no code.

It matters more than an ordinary CRUD gap because `create_user` writes Keycloak
FIRST: an approved request produces a real, usable login. Segregation of duties
is what stops one person doing that unilaterally.

test_an_admin_cannot_approve_their_own_request is the control. Everything else
here is scaffolding around it.

Runs against real PostgreSQL (see this package's conftest). requested_roles is
ARRAY(Text), which the shared SQLite fixture can render but cannot bind — and
ck_user_account_requests_requester_ne_approver does not exist in the ORM-built
schema at all.
"""
from __future__ import annotations

import uuid

import pytest

from app.users import account_request_service as service
from app.users.models import Facility, User
from app.users.schemas import AccountRequestCreate

pytestmark = pytest.mark.asyncio


class _FakeKeycloak:
    """Records what it was asked to create, and whether it was called at all.

    `called` is the interesting attribute: several tests assert Keycloak was
    NOT touched, because every refusal must happen before the credential is
    minted — there is no transaction across Keycloak to roll one back.
    """

    def __init__(self) -> None:
        self.called = False
        self.last: dict | None = None

    async def create_user(self, **kwargs) -> str:
        self.called = True
        self.last = kwargs
        return f"kc-{uuid.uuid4().hex[:12]}"


async def _facility(db) -> Facility:
    facility = Facility(
        id=uuid.uuid4(), code=f"R{uuid.uuid4().hex[:4].upper()}",
        name="Facility", state_code="TS",
    )
    db.add(facility)
    await db.flush()
    return facility


async def _staff(db, facility_id) -> User:
    user = User(
        id=uuid.uuid4(), keycloak_sub=f"sub-{uuid.uuid4().hex[:12]}",
        username=f"u{uuid.uuid4().hex[:8]}", full_name="Existing Staff",
        facility_id=facility_id,
    )
    db.add(user)
    await db.flush()
    return user


def _payload(**overrides) -> AccountRequestCreate:
    fields = dict(
        requested_for_full_name="Anita Rao",
        requested_username=f"arao{uuid.uuid4().hex[:6]}",
        requested_roles=["nurse"],
        justification="Night shift cover for the medical ward from 1 September.",
    )
    fields.update(overrides)
    return AccountRequestCreate(**fields)


async def test_a_request_creates_nothing_until_approved(db):
    """The whole premise: raising a request must not mint a credential."""
    facility = await _facility(db)
    requester = await _staff(db, facility.id)

    row = await service.create_request(
        db, facility_id=facility.id, requested_by=requester.id, payload=_payload(),
    )

    assert row.status == "pending"
    assert row.created_user_id is None
    assert row.decided_by is None


async def test_an_admin_cannot_approve_their_own_request(db):
    """The control.

    An approver who raised the request has maker-checker in name only, and this
    endpoint mints a working Keycloak credential. Also enforced by
    ck_user_account_requests_requester_ne_approver — the Python check exists so
    the caller gets an explanation instead of an IntegrityError.
    """
    facility = await _facility(db)
    requester = await _staff(db, facility.id)
    keycloak = _FakeKeycloak()

    row = await service.create_request(
        db, facility_id=facility.id, requested_by=requester.id, payload=_payload(),
    )

    with pytest.raises(service.SelfApproval):
        await service.approve_request(
            db, request_id=row.id, facility_id=facility.id,
            decided_by=requester.id,          # the same person
            temporary_password="tempPass123", keycloak=keycloak,
        )

    assert keycloak.called is False, (
        "Keycloak must not be touched — a credential created before the refusal "
        "is discovered cannot be rolled back"
    )
    await db.refresh(row)
    assert row.status == "pending"


async def test_a_second_person_can_approve_and_the_account_is_created(db):
    facility = await _facility(db)
    requester = await _staff(db, facility.id)
    approver = await _staff(db, facility.id)
    keycloak = _FakeKeycloak()

    row = await service.create_request(
        db, facility_id=facility.id, requested_by=requester.id,
        payload=_payload(requested_username="anitarao", requested_roles=["nurse"]),
    )

    row, user = await service.approve_request(
        db, request_id=row.id, facility_id=facility.id, decided_by=approver.id,
        temporary_password="tempPass123", keycloak=keycloak,
    )

    assert row.status == "approved"
    assert row.decided_by == approver.id
    assert row.decided_at is not None
    assert row.created_user_id == user.id, "the request must name the account it produced"
    assert user.username == "anitarao"
    assert user.facility_id == facility.id
    assert keycloak.called is True
    assert keycloak.last["roles"] == ["nurse"]


async def test_the_new_account_lands_at_the_requests_facility(db):
    """Not the approver's — they are proven equal by the facility scope, but the
    request is the record of intent and is what the account is created from."""
    facility = await _facility(db)
    requester = await _staff(db, facility.id)
    approver = await _staff(db, facility.id)

    row = await service.create_request(
        db, facility_id=facility.id, requested_by=requester.id, payload=_payload(),
    )
    _row, user = await service.approve_request(
        db, request_id=row.id, facility_id=facility.id, decided_by=approver.id,
        temporary_password="tempPass123", keycloak=_FakeKeycloak(),
    )

    assert user.facility_id == facility.id


async def test_another_facilitys_request_cannot_be_approved(db):
    ours, theirs = await _facility(db), await _facility(db)
    their_requester = await _staff(db, theirs.id)
    our_admin = await _staff(db, ours.id)
    keycloak = _FakeKeycloak()

    row = await service.create_request(
        db, facility_id=theirs.id, requested_by=their_requester.id, payload=_payload(),
    )

    with pytest.raises(service.AccountRequestNotFound):
        await service.approve_request(
            db, request_id=row.id, facility_id=ours.id, decided_by=our_admin.id,
            temporary_password="tempPass123", keycloak=keycloak,
        )

    assert keycloak.called is False


async def test_a_decided_request_cannot_be_decided_again(db):
    """Approving twice would create a second account for one authorisation."""
    facility = await _facility(db)
    requester = await _staff(db, facility.id)
    approver = await _staff(db, facility.id)

    row = await service.create_request(
        db, facility_id=facility.id, requested_by=requester.id, payload=_payload(),
    )
    await service.approve_request(
        db, request_id=row.id, facility_id=facility.id, decided_by=approver.id,
        temporary_password="tempPass123", keycloak=_FakeKeycloak(),
    )

    second = _FakeKeycloak()
    with pytest.raises(service.AccountRequestNotPending):
        await service.approve_request(
            db, request_id=row.id, facility_id=facility.id, decided_by=approver.id,
            temporary_password="tempPass123", keycloak=second,
        )

    assert second.called is False


async def test_a_username_taken_while_queued_is_refused_before_keycloak(db):
    """A request can sit for days. Somebody may create that username directly in
    the meantime, and the check on approval is what catches it."""
    facility = await _facility(db)
    requester = await _staff(db, facility.id)
    approver = await _staff(db, facility.id)

    row = await service.create_request(
        db, facility_id=facility.id, requested_by=requester.id,
        payload=_payload(requested_username="contested"),
    )

    db.add(User(
        id=uuid.uuid4(), keycloak_sub=f"sub-{uuid.uuid4().hex[:12]}",
        username="contested", full_name="Got There First",
        facility_id=facility.id,
    ))
    await db.flush()

    keycloak = _FakeKeycloak()
    with pytest.raises(service.UsernameTaken):
        await service.approve_request(
            db, request_id=row.id, facility_id=facility.id, decided_by=approver.id,
            temporary_password="tempPass123", keycloak=keycloak,
        )

    assert keycloak.called is False


async def test_rejection_records_who_and_why(db):
    """A refusal with no reason is not reviewable afterwards."""
    facility = await _facility(db)
    requester = await _staff(db, facility.id)
    approver = await _staff(db, facility.id)

    row = await service.create_request(
        db, facility_id=facility.id, requested_by=requester.id, payload=_payload(),
    )
    row = await service.reject_request(
        db, request_id=row.id, facility_id=facility.id, decided_by=approver.id,
        reason="Post already filled internally.",
    )

    assert row.status == "rejected"
    assert row.decided_by == approver.id
    assert row.rejection_reason == "Post already filled internally."
    assert row.created_user_id is None


async def test_self_rejection_is_refused_too(db):
    """Withdrawing your own request and having it *decided* against you are
    different events in an audit trail."""
    facility = await _facility(db)
    requester = await _staff(db, facility.id)

    row = await service.create_request(
        db, facility_id=facility.id, requested_by=requester.id, payload=_payload(),
    )

    with pytest.raises(service.SelfApproval):
        await service.reject_request(
            db, request_id=row.id, facility_id=facility.id,
            decided_by=requester.id, reason="changed my mind",
        )


async def test_the_list_is_facility_scoped(db):
    ours, theirs = await _facility(db), await _facility(db)
    our_requester = await _staff(db, ours.id)
    their_requester = await _staff(db, theirs.id)

    await service.create_request(
        db, facility_id=ours.id, requested_by=our_requester.id,
        payload=_payload(requested_username="oursone"),
    )
    await service.create_request(
        db, facility_id=theirs.id, requested_by=their_requester.id,
        payload=_payload(requested_username="theirsone"),
    )

    rows = await service.list_requests(db, facility_id=ours.id)

    assert [r.requested_username for r in rows] == ["oursone"]


async def test_the_routes_are_registered_before_the_user_id_route():
    """/users/account-requests and /users/{user_id} are both one segment under
    /users. Registered the wrong way round, "account-requests" is parsed as a
    UUID and every call 422s."""
    from app.main import app

    paths = list(app.openapi()["paths"].keys())
    assert paths.index("/api/v1/users/account-requests") < paths.index(
        "/api/v1/users/{user_id}"
    )
