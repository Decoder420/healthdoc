"""Regression tests for the authenticated doctor critical-alert stream."""
from __future__ import annotations

import uuid

import pytest

from app.auth.deps import AuthUser, DbUser
from app.pathology import router as pathology_router


@pytest.mark.asyncio
async def test_stream_releases_identity_session_before_it_starts(monkeypatch):
    """An SSE connection must not reserve one DB-pool slot for its lifetime."""

    class ShortSession:
        exited = False

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, traceback):
            self.exited = True

    session = ShortSession()
    app_user = DbUser(
        id=uuid.uuid4(),
        keycloak_sub="doctor-sub",
        username="doctor",
        facility_id=uuid.uuid4(),
        roles=["doctor"],
    )

    async def resolve_user(current_user, db):
        assert current_user.username == "doctor"
        assert db is session
        return app_user

    monkeypatch.setattr(pathology_router, "SessionLocal", lambda: session)
    monkeypatch.setattr(pathology_router, "get_current_db_user", resolve_user)

    response = await pathology_router.critical_alerts_stream(
        current_user=AuthUser(sub="doctor-sub", username="doctor", roles=["doctor"])
    )

    assert session.exited, (
        "the identity lookup session is still open after the StreamingResponse "
        "was created; each doctor tab would permanently consume a pool slot"
    )

    iterator = response.body_iterator
    first_frame = await anext(iterator)
    assert first_frame == ": connected\n\n"
    await iterator.aclose()
    assert str(app_user.id) not in pathology_router._critical_alert_subscribers
