"""
Actor-context dependency for the audit module — fills in
app/audit/context.py per request.

Repo path: backend/app/audit/deps.py

REPLACES middleware.py. Now that app/auth/deps.py is visible: auth here
is dependency-based (get_current_user / require_roles), not
middleware-based. Starlette's BaseHTTPMiddleware runs BEFORE FastAPI's
Depends() chain resolves, so a plain HTTP middleware genuinely cannot
see the authenticated user in this repo's setup — middleware.py's
"Option A" (decode the JWT again inside middleware) would have meant
duplicating and re-verifying the token a second time for no reason.
This dependency runs alongside your existing auth chain instead, so it
sees the same resolved user require_roles() already checked.

IMPORTANT GAP this file surfaces, not hides:
get_current_user() only decodes the JWT — it returns
AuthUser(sub, username, roles), where `sub` is the Keycloak subject
string. It does NOT look up the app's own users.id (a UUID). But
audit_logs.user_id is a UUID FOREIGN KEY to users.id (schema doc §3
0002: "users.keycloak_sub varchar(64) UNIQUE NOT NULL -- Keycloak
subject; JWT 'sub' maps here"). So this dependency does that lookup
itself — one extra DB query per protected request. If no users row
exists yet for a given keycloak_sub (token valid but profile row not
yet provisioned), user_id is left None and a warning is logged instead
of failing the request. Flag for Tech Lead: should that be a hard 403
instead of a warning?

This dependency does NOT do authorization — require_roles() still owns
the actual 401/403 decision. This only captures context for audit rows.
"""
from __future__ import annotations

import logging

from fastapi import Depends, Request
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit.context import AuditActor, set_current_actor
from app.auth.deps import AuthUser, get_current_user
from app.common.db import get_db

logger = logging.getLogger(__name__)


def _extract_ip(request: Request) -> str | None:
    # Respect a reverse proxy's forwarded header if present (nginx/ingress),
    # otherwise fall back to the direct connecting client.
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else None


async def get_current_actor_dependency(
    request: Request,
    user: AuthUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> AuditActor:
    """
    Resolves the JWT's `sub` -> users.id, builds an AuditActor, stores it
    in the request-scoped context (app/audit/context.py) so write_audit_log()
    picks it up automatically, and also returns it in case a route wants
    it directly.

    Usage — add alongside require_roles() on any route that mutates data:

        @router.post(
            "/",
            dependencies=[Depends(require_roles("receptionist", "admin"))],
        )
        async def create_thing(
            actor: AuditActor = Depends(get_current_actor_dependency),
            session: AsyncSession = Depends(get_db),
        ):
            ...
    """
    # Raw SQL here (not an ORM select) to avoid app.audit importing
    # app.users.models — sidesteps a cross-module import cycle. If a
    # shared users table reference already exists somewhere common,
    # swap this for a real ORM select instead.
    result = await session.execute(
        text("SELECT id FROM users WHERE keycloak_sub = :sub"),
        {"sub": user.sub},
    )
    row = result.first()

    user_id = row.id if row else None
    if row is None:
        logger.warning(
            "get_current_actor_dependency: no users row for keycloak_sub=%s — "
            "audit rows on this request will have user_id=NULL",
            user.sub,
        )

    # audit_logs.role is a single text column; the JWT can carry several
    # realm roles. Joining them with commas is a placeholder — confirm
    # with Tech Lead whether a single "primary" role should be picked
    # instead (and if so, how "primary" is decided).
    role = ",".join(user.roles) if user.roles else None

    actor = AuditActor(
        user_id=user_id,
        role=role,
        ip_address=_extract_ip(request),
        device_id=request.headers.get("x-device-id"),
    )
    set_current_actor(actor)
    return actor
