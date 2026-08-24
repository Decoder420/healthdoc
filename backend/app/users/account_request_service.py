"""Maker-checker for staff account creation (migration 0028).

The table, the migration and the ORM model all existed. There was no router, no
service, and **nothing imported the model** — so `user_account_requests` was not
even in `Base.metadata`, and the SQLite test fixture never created it. A
governance control with a schema and no code.

Why it matters more than an ordinary CRUD gap: `create_user` writes Keycloak
FIRST and the profile row second, because Keycloak is the identity source of
truth. So "who may mint a credential" is not an administrative nicety — an
approved request produces a real, usable login. Segregation of duties is the
control that keeps one person from doing that unilaterally.

The database already enforces the essential rule:

    CheckConstraint("decided_by IS NULL OR decided_by != requested_by")

That is deliberately re-checked in Python too. The constraint is the backstop
that cannot be bypassed; the application check exists so the caller gets a 409
explaining what happened instead of an IntegrityError, and so the rule is
visible where the decision is made rather than only in DDL.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.users.account_requests import UserAccountRequest
from app.users.models import User


class AccountRequestNotFound(Exception):
    """Raised for a missing id AND for one at another facility — the caller
    cannot tell which, so the endpoint is not an enumeration oracle."""


class AccountRequestNotPending(Exception):
    def __init__(self, status: str) -> None:
        self.status = status
        super().__init__(f"request is '{status}', not 'pending'")


class SelfApproval(Exception):
    """The maker-checker violation. Named for what it is, not 'forbidden'."""


class UsernameTaken(Exception):
    def __init__(self, username: str) -> None:
        self.username = username
        super().__init__(f"username '{username}' already exists")


async def _scoped(
    db: AsyncSession, request_id: uuid.UUID, facility_id: uuid.UUID
) -> UserAccountRequest:
    row = await db.get(UserAccountRequest, request_id)
    if row is None or row.facility_id != facility_id:
        raise AccountRequestNotFound(str(request_id))
    return row


async def list_requests(
    db: AsyncSession,
    *,
    facility_id: uuid.UUID,
    status: str | None = None,
    page: int = 1,
    page_size: int = 20,
) -> list[UserAccountRequest]:
    q = select(UserAccountRequest).where(UserAccountRequest.facility_id == facility_id)
    if status:
        q = q.where(UserAccountRequest.status == status)
    q = (
        q.order_by(UserAccountRequest.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    return list((await db.execute(q)).scalars().all())


async def get_request(
    db: AsyncSession, *, request_id: uuid.UUID, facility_id: uuid.UUID
) -> UserAccountRequest:
    return await _scoped(db, request_id, facility_id)


async def create_request(
    db: AsyncSession,
    *,
    facility_id: uuid.UUID,
    requested_by: uuid.UUID,
    payload,
) -> UserAccountRequest:
    """Raise a request. Creates nothing in Keycloak — that happens on approval.

    The username is checked here as well as on approval. Checking only on
    approval would let a request sit in the queue for days and then fail at the
    moment somebody acts on it, which wastes the approver's attention rather
    than the requester's.
    """
    existing = await db.execute(
        select(User.id).where(User.username == payload.requested_username)
    )
    if existing.scalar_one_or_none() is not None:
        raise UsernameTaken(payload.requested_username)

    row = UserAccountRequest(
        id=uuid.uuid4(),
        facility_id=facility_id,
        requested_by=requested_by,
        status="pending",
        requested_for_full_name=payload.requested_for_full_name,
        requested_username=payload.requested_username,
        requested_roles=payload.requested_roles,
        designation=payload.designation,
        employee_id=payload.employee_id,
        registration_number=payload.registration_number,
        qualification=payload.qualification,
        email=payload.email,
        mobile=payload.mobile,
        justification=payload.justification,
    )
    db.add(row)
    await db.flush()
    return row


async def reject_request(
    db: AsyncSession,
    *,
    request_id: uuid.UUID,
    facility_id: uuid.UUID,
    decided_by: uuid.UUID,
    reason: str,
) -> UserAccountRequest:
    row = await _scoped(db, request_id, facility_id)
    if row.status != "pending":
        raise AccountRequestNotPending(row.status)
    if decided_by == row.requested_by:
        raise SelfApproval()

    row.status = "rejected"
    row.decided_by = decided_by
    row.decided_at = datetime.now(timezone.utc)
    row.rejection_reason = reason
    await db.flush()
    return row


async def approve_request(
    db: AsyncSession,
    *,
    request_id: uuid.UUID,
    facility_id: uuid.UUID,
    decided_by: uuid.UUID,
    temporary_password: str,
    keycloak,
) -> tuple[UserAccountRequest, User]:
    """Approve, and create the account the request asked for.

    Order matters and mirrors `create_user`: every refusal — not found, not
    pending, self-approval, username taken — happens BEFORE Keycloak is touched.
    Keycloak is the identity source of truth and there is no transaction across
    it, so a rejection discovered after the write would leave a usable
    credential behind with no request to account for it.
    """
    row = await _scoped(db, request_id, facility_id)
    if row.status != "pending":
        raise AccountRequestNotPending(row.status)
    if decided_by == row.requested_by:
        # Also enforced by ck_user_account_requests_requester_ne_approver. This
        # check exists so the caller gets an explanation rather than an
        # IntegrityError, and so the rule is legible at the decision point.
        raise SelfApproval()

    existing = await db.execute(
        select(User.id).where(User.username == row.requested_username)
    )
    if existing.scalar_one_or_none() is not None:
        # Someone created this username directly while the request was queued.
        raise UsernameTaken(row.requested_username)

    sub = await keycloak.create_user(
        username=row.requested_username,
        full_name=row.requested_for_full_name,
        email=row.email,
        temporary_password=temporary_password,
        roles=row.requested_roles,
    )

    user = User(
        id=uuid.uuid4(),
        keycloak_sub=sub,
        username=row.requested_username,
        full_name=row.requested_for_full_name,
        email=row.email,
        mobile=row.mobile,
        designation=row.designation,
        employee_id=row.employee_id,
        registration_number=row.registration_number,
        qualification=row.qualification,
        # The request's facility, which _scoped already proved is the approver's.
        facility_id=row.facility_id,
    )
    db.add(user)
    await db.flush()

    row.status = "approved"
    row.decided_by = decided_by
    row.decided_at = datetime.now(timezone.utc)
    row.created_user_id = user.id
    await db.flush()
    return row, user
