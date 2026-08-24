"""Break-glass revoke and review — columns that existed with no code.

break_glass_grants has carried revoked_at/revoked_by and
reviewed_at/reviewed_by/review_outcome since 0004. Nothing wrote any of them.

The review gap was the worse of the two. GET /break-glass/expired-unreviewed is
a compliance worklist of grants awaiting review, and with no way to record a
review that list could only ever grow — a control that looks like a control
while guaranteeing a backlog.

Revocation was the other: a grant ran its full two hours regardless. Emergency
access opened on the wrong patient could not be cut short.
"""
import uuid
from datetime import datetime, timedelta, timezone

import pytest
import sqlalchemy as sa
from fastapi import HTTPException

from app.security_audit import breakglass as bg

pytestmark = pytest.mark.asyncio


class _Caller:
    """Stands in for the JWT user. Only `sub` is read — the handler resolves it
    to a users.id itself, which is the behaviour under test."""

    def __init__(self, sub: str) -> None:
        self.sub = sub
        self.amr = ["otp"]


async def _facility(db) -> uuid.UUID:
    fid = uuid.uuid4()
    await db.execute(sa.text(
        "INSERT INTO facilities (id, code, name, state_code) "
        "VALUES (:id, :c, 'BG Facility', 'TS')"),
        {"id": fid, "c": f"B{uuid.uuid4().hex[:5].upper()}"})
    await db.flush()
    return fid


async def _user(db, facility_id) -> tuple[uuid.UUID, str]:
    uid, sub = uuid.uuid4(), f"sub-{uuid.uuid4().hex[:12]}"
    await db.execute(sa.text(
        "INSERT INTO users (id, keycloak_sub, username, full_name, facility_id) "
        "VALUES (:id, :sub, :un, 'Emergency Clinician', :f)"),
        {"id": uid, "sub": sub, "un": f"u{uuid.uuid4().hex[:8]}", "f": facility_id})
    await db.flush()
    return uid, sub


async def _patient(db, facility_id, created_by) -> uuid.UUID:
    pid = uuid.uuid4()
    await db.execute(sa.text(
        "INSERT INTO patients (id, uhid, full_name, sex, age_years, identity_path, "
        " identity_status, facility_id, created_by) "
        "VALUES (:id, :u, 'BG Patient', 'female', 51, 'demographics_only', "
        " 'verified', :f, :b)"),
        {"id": pid, "u": f"UH{uuid.uuid4().hex[:8]}", "f": facility_id, "b": created_by})
    await db.flush()
    return pid


async def _grant(db, *, patient_id, user_id, expires_in=timedelta(hours=2)) -> uuid.UUID:
    gid = uuid.uuid4()
    await db.execute(sa.text(
        "INSERT INTO break_glass_grants "
        " (id, patient_id, granted_to_user_id, justification, granted_at, expires_at) "
        "VALUES (:id, :p, :u, :j, now(), :e)"),
        {"id": gid, "p": patient_id, "u": user_id,
         # ck_break_glass_grants_justification_length requires >= 20 chars.
         "j": "Unconscious patient, no next of kin reachable.",
         "e": datetime.now(timezone.utc) + expires_in})
    await db.flush()
    return gid


async def _row(db, gid):
    return (await db.execute(sa.text(
        "SELECT revoked_at, revoked_by, reviewed_at, reviewed_by, review_outcome "
        "FROM break_glass_grants WHERE id = :id"), {"id": gid})).mappings().one()


async def test_revoking_records_the_app_user_id_not_the_keycloak_sub(db):
    """revoked_by is an FK to users.id. Writing the token's subject there is a
    ForeignKeyViolation — the same trap billing's resolve_actor_user_id
    documents."""
    fid = await _facility(db)
    uid, sub = await _user(db, fid)
    pid = await _patient(db, fid, uid)
    gid = await _grant(db, patient_id=pid, user_id=uid)

    await bg.revoke_grant(str(gid), bg.BreakGlassRevoke(reason="Wrong patient"),
                          _Caller(sub), db=db)

    row = await _row(db, gid)
    assert row["revoked_at"] is not None
    assert row["revoked_by"] == uid, "must be users.id, not the keycloak sub"


async def test_a_grant_cannot_be_revoked_twice(db):
    """The second call would move revoked_at forward and quietly extend the
    recorded access window."""
    fid = await _facility(db)
    uid, sub = await _user(db, fid)
    pid = await _patient(db, fid, uid)
    gid = await _grant(db, patient_id=pid, user_id=uid)

    await bg.revoke_grant(str(gid), bg.BreakGlassRevoke(reason="Wrong patient"),
                          _Caller(sub), db=db)

    with pytest.raises(HTTPException) as caught:
        await bg.revoke_grant(str(gid), bg.BreakGlassRevoke(reason="again"),
                              _Caller(sub), db=db)

    assert caught.value.status_code == 409
    assert caught.value.detail["code"] == "already_revoked"


async def test_an_expired_grant_cannot_be_revoked(db):
    """It is not revoked, it is over. Recording a revocation would misstate
    when access actually stopped."""
    fid = await _facility(db)
    uid, sub = await _user(db, fid)
    pid = await _patient(db, fid, uid)
    gid = await _grant(db, patient_id=pid, user_id=uid, expires_in=timedelta(hours=-1))

    with pytest.raises(HTTPException) as caught:
        await bg.revoke_grant(str(gid), bg.BreakGlassRevoke(reason="too late"),
                              _Caller(sub), db=db)

    assert caught.value.status_code == 409
    assert caught.value.detail["code"] == "already_expired"
    assert (await _row(db, gid))["revoked_at"] is None


async def test_reviewing_clears_the_compliance_worklist(db):
    """The gap that mattered: /expired-unreviewed lists grants awaiting review
    and nothing could complete one, so the list only grew."""
    fid = await _facility(db)
    uid, sub = await _user(db, fid)
    pid = await _patient(db, fid, uid)
    gid = await _grant(db, patient_id=pid, user_id=uid, expires_in=timedelta(hours=-3))

    before = (await db.execute(sa.text("""
        SELECT count(*) FROM break_glass_grants
        WHERE id = :id AND expires_at < now()
          AND revoked_at IS NULL AND reviewed_at IS NULL
    """), {"id": gid})).scalar_one()
    assert before == 1, "the grant is on the worklist"

    await bg.review_grant(str(gid), bg.BreakGlassReview(outcome="justified"),
                          _Caller(sub), db=db)

    after = (await db.execute(sa.text("""
        SELECT count(*) FROM break_glass_grants
        WHERE id = :id AND expires_at < now()
          AND revoked_at IS NULL AND reviewed_at IS NULL
    """), {"id": gid})).scalar_one()
    assert after == 0, "reviewing must take it off the worklist"

    row = await _row(db, gid)
    assert row["review_outcome"] == "justified"
    assert row["reviewed_by"] == uid


async def test_a_grant_cannot_be_reviewed_twice(db):
    """A second review would overwrite the first reviewer's finding with no
    trace that it changed."""
    fid = await _facility(db)
    uid, sub = await _user(db, fid)
    pid = await _patient(db, fid, uid)
    gid = await _grant(db, patient_id=pid, user_id=uid, expires_in=timedelta(hours=-3))

    await bg.review_grant(str(gid), bg.BreakGlassReview(outcome="not_justified"),
                          _Caller(sub), db=db)

    with pytest.raises(HTTPException) as caught:
        await bg.review_grant(str(gid), bg.BreakGlassReview(outcome="justified"),
                              _Caller(sub), db=db)

    assert caught.value.status_code == 409
    assert caught.value.detail["code"] == "already_reviewed"
    assert (await _row(db, gid))["review_outcome"] == "not_justified", (
        "the first finding must stand"
    )


async def test_another_facilitys_grant_is_not_reachable(db):
    """break_glass_grants has no facility_id — scope resolves through the
    patient. 404, not 403, so grant ids stay unenumerable."""
    ours, theirs = await _facility(db), await _facility(db)
    our_uid, our_sub = await _user(db, ours)
    their_uid, _ = await _user(db, theirs)
    their_patient = await _patient(db, theirs, their_uid)
    gid = await _grant(db, patient_id=their_patient, user_id=their_uid)

    with pytest.raises(HTTPException) as caught:
        await bg.revoke_grant(str(gid), bg.BreakGlassRevoke(reason="not mine"),
                              _Caller(our_sub), db=db)
    assert caught.value.status_code == 404

    with pytest.raises(HTTPException) as caught:
        await bg.review_grant(str(gid), bg.BreakGlassReview(outcome="justified"),
                              _Caller(our_sub), db=db)
    assert caught.value.status_code == 404

    row = await _row(db, gid)
    assert row["revoked_at"] is None and row["reviewed_at"] is None


async def test_an_unknown_outcome_is_rejected(db):
    """'justified' or 'not_justified'. A free-text outcome makes the review
    column unaggregatable, which is most of its value to a DPO."""
    with pytest.raises(ValueError):
        bg.BreakGlassReview(outcome="probably fine")
