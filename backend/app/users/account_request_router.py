"""/users/account-requests — maker-checker for staff account creation (0028).

A separate router, for two reasons.

**Roles differ by verb.** `app/users/router.py` is admin-only at the APIRouter,
which is right for direct account administration. But the point of maker-checker
is that the person asking is not the person approving, so raising a request has
to be available to someone who is not an admin — a department head asking for a
nurse account. Create is open to supervisor/admin; approve and reject are
admin-only.

**Route ordering.** `/users/account-requests` and `/users/{user_id}` are both
one segment under `/users`. Whichever is registered first wins, and
"account-requests" parsed as a UUID is a 422 that reads like a validation bug.
main.py includes this before the MODULES loop, alongside `app.users.me`.

Segregation of duties is enforced at three levels, deliberately:
  * the DB constraint ck_user_account_requests_requester_ne_approver;
  * a service-level check that turns it into a 409 with an explanation;
  * different role sets on the create and decide routes.

The third alone would be insufficient — an admin can create requests too, and
role separation does not stop one *person* doing both. Only the id comparison
does.
"""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentDbUser, require_roles
from app.common.db import get_db
from app.users import account_request_service as service
from app.users.schemas import (
    AccountRequestApprove,
    AccountRequestCreate,
    AccountRequestListOut,
    AccountRequestOut,
    AccountRequestReject,
)
from app.users.service import KeycloakAdmin

router = APIRouter(prefix="/users/account-requests", tags=["users"])

_RAISE_ROLES = ("supervisor", "admin")
_DECIDE_ROLES = ("admin",)


def _not_found() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"code": "account_request_not_found"},
    )


@router.get(
    "",
    response_model=AccountRequestListOut,
    dependencies=[Depends(require_roles(*_RAISE_ROLES))],
)
async def list_account_requests(
    current_db_user: CurrentDbUser,
    request_status: str | None = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> AccountRequestListOut:
    """Requests at the caller's facility. No facility parameter — the token
    carries it, for the same reason list_users no longer takes one."""
    rows = await service.list_requests(
        db,
        facility_id=current_db_user.facility_id,
        status=request_status,
        page=page,
        page_size=page_size,
    )
    return AccountRequestListOut(
        items=[AccountRequestOut.model_validate(r) for r in rows],
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{request_id}",
    response_model=AccountRequestOut,
    dependencies=[Depends(require_roles(*_RAISE_ROLES))],
)
async def get_account_request(
    request_id: uuid.UUID,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> AccountRequestOut:
    try:
        row = await service.get_request(
            db, request_id=request_id, facility_id=current_db_user.facility_id
        )
    except service.AccountRequestNotFound:
        raise _not_found()
    return AccountRequestOut.model_validate(row)


@router.post(
    "",
    response_model=AccountRequestOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles(*_RAISE_ROLES))],
)
async def create_account_request(
    payload: AccountRequestCreate,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> AccountRequestOut:
    """Raise a request at the caller's own facility. Touches Keycloak not at
    all — nothing exists until somebody else approves."""
    try:
        row = await service.create_request(
            db,
            facility_id=current_db_user.facility_id,
            requested_by=current_db_user.id,
            payload=payload,
        )
    except service.UsernameTaken as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "username_taken", "message": str(exc)},
        )
    await db.commit()
    await db.refresh(row)
    return AccountRequestOut.model_validate(row)


@router.post(
    "/{request_id}/approve",
    response_model=AccountRequestOut,
    dependencies=[Depends(require_roles(*_DECIDE_ROLES))],
)
async def approve_account_request(
    request_id: uuid.UUID,
    payload: AccountRequestApprove,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> AccountRequestOut:
    """Approve and create the account.

    409 `self_approval` when the approver raised the request. That is the whole
    control: an admin who could approve their own request has maker-checker in
    name only, and this endpoint mints a working Keycloak credential.
    """
    try:
        row, _user = await service.approve_request(
            db,
            request_id=request_id,
            facility_id=current_db_user.facility_id,
            decided_by=current_db_user.id,
            temporary_password=payload.temporary_password,
            keycloak=KeycloakAdmin(),
        )
    except service.AccountRequestNotFound:
        raise _not_found()
    except service.SelfApproval:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": "self_approval",
                "message": "The approver cannot be the requester.",
            },
        )
    except service.AccountRequestNotPending as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "not_pending", "message": str(exc)},
        )
    except service.UsernameTaken as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "username_taken", "message": str(exc)},
        )
    await db.commit()
    await db.refresh(row)
    return AccountRequestOut.model_validate(row)


@router.post(
    "/{request_id}/reject",
    response_model=AccountRequestOut,
    dependencies=[Depends(require_roles(*_DECIDE_ROLES))],
)
async def reject_account_request(
    request_id: uuid.UUID,
    payload: AccountRequestReject,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> AccountRequestOut:
    """Reject with a recorded reason. Self-rejection is refused on the same
    grounds as self-approval: a request withdrawn by its own author should be
    withdrawn, not decided, and the two are different things in an audit."""
    try:
        row = await service.reject_request(
            db,
            request_id=request_id,
            facility_id=current_db_user.facility_id,
            decided_by=current_db_user.id,
            reason=payload.reason,
        )
    except service.AccountRequestNotFound:
        raise _not_found()
    except service.SelfApproval:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": "self_approval",
                "message": "The decider cannot be the requester.",
            },
        )
    except service.AccountRequestNotPending as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "not_pending", "message": str(exc)},
        )
    await db.commit()
    await db.refresh(row)
    return AccountRequestOut.model_validate(row)
