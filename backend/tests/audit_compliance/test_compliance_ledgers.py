"""The four compliance ledgers that had no read path.

/audit/logs and /audit/logs/export existed. data_access_log (0004),
file_access_log (0019), audit_integrity_checks and audit_log_archive (0003) had
tables and no endpoint.

The test that matters most is
test_an_unattributed_access_row_is_reported_not_dropped. data_access_log has no
facility_id and its patient_id is NULLABLE, so the obvious scoping join is an
INNER JOIN that silently discards rows. Silently discarding entries from the
ledger of who-looked-at-what is the one thing this table must never do.
"""
import uuid

import pytest
import sqlalchemy as sa

from app.audit import compliance_router as cr

pytestmark = pytest.mark.asyncio

# page / page_size are declared as Query(...) on the handlers. FastAPI resolves
# those defaults per-request; calling a handler directly does not, so `page`
# arrives as a Query object and `page - 1` is a TypeError. Every direct call
# below therefore passes them explicitly — the same convention
# tests/radiology/test_results_worklist.py and the billing suite already use.
_PAGING = {"page": 1, "page_size": 50}


class _Auditor:
    def __init__(self, facility_id):
        self.facility_id = facility_id
        self.id = uuid.uuid4()
        self.roles = ["auditor"]


async def _facility(db):
    fid = uuid.uuid4()
    await db.execute(sa.text(
        "INSERT INTO facilities (id, code, name, state_code) "
        "VALUES (:id, :c, 'Audit Facility', 'TS')"),
        {"id": fid, "c": f"A{uuid.uuid4().hex[:5].upper()}"})
    await db.flush()
    return fid


async def _user(db, facility_id):
    """data_access_log.user_id is a real FK to users.id — a random uuid4 is a
    ForeignKeyViolation, not a stand-in."""
    uid = uuid.uuid4()
    await db.execute(sa.text(
        "INSERT INTO users (id, keycloak_sub, username, full_name, facility_id) "
        "VALUES (:id, :sub, :un, 'Audit Actor', :f)"),
        {"id": uid, "sub": f"sub-{uuid.uuid4().hex[:12]}",
         "un": f"u{uuid.uuid4().hex[:8]}", "f": facility_id})
    await db.flush()
    return uid


async def _patient(db, facility_id):
    """age_years is not optional decoration: ck_patients_dob_or_age requires a
    dob OR an age, and omitting both is a CheckViolation."""
    pid = uuid.uuid4()
    await db.execute(sa.text(
        "INSERT INTO patients (id, uhid, full_name, sex, age_years, identity_path, "
        " identity_status, facility_id, created_by) "
        "VALUES (:id, :u, 'Audited Patient', 'male', 44, 'demographics_only', "
        " 'verified', :f, :b)"),
        {"id": pid, "u": f"UH{uuid.uuid4().hex[:8]}", "f": facility_id,
         "b": await _user(db, facility_id)})
    await db.flush()
    return pid


async def _access_row(db, *, patient_id, user_id, purpose="clinical_review"):
    rid = uuid.uuid4()
    await db.execute(sa.text(
        "INSERT INTO data_access_log (id, patient_id, user_id, role, resource_type, "
        " purpose_code, access_channel, accessed_at) "
        "VALUES (:id, :p, :u, 'doctor', 'patients', :pc, 'api', now())"),
        {"id": rid, "p": patient_id, "u": user_id, "pc": purpose})
    await db.flush()
    return rid


async def test_data_access_is_scoped_through_the_patient(db):
    """The table has no facility_id — scope resolves via patients."""
    ours, theirs = await _facility(db), await _facility(db)
    our_patient = await _patient(db, ours)
    their_patient = await _patient(db, theirs)
    our_user = await _user(db, ours)

    mine = await _access_row(db, patient_id=our_patient, user_id=our_user)
    await _access_row(db, patient_id=their_patient, user_id=our_user)

    result = await cr.list_data_access_logs(_Auditor(ours), db=db, **_PAGING)
    ids = {i.id for i in result.items}

    assert mine in ids
    assert all(i.patient_id != their_patient for i in result.items)


async def test_an_unattributed_access_row_is_reported_not_dropped(db):
    """patient_id is NULLABLE. An INNER JOIN would discard these rows entirely.

    They are included and counted instead: an auditor reading a row they must
    interpret is strictly better than an auditor never seeing it.
    """
    ours = await _facility(db)
    await _access_row(
        db, patient_id=None, user_id=await _user(db, ours),
        purpose="purpose_level_read",
    )

    result = await cr.list_data_access_logs(_Auditor(ours), db=db, **_PAGING)

    assert result.unattributed_in_page >= 1
    assert any(i.patient_id is None for i in result.items), (
        "a row with no patient must still appear in the access ledger"
    )


async def test_a_patient_filter_narrows_and_never_widens(db):
    """The filter is intersected with the facility scope, not substituted for it."""
    ours, theirs = await _facility(db), await _facility(db)
    their_patient = await _patient(db, theirs)
    await _access_row(db, patient_id=their_patient, user_id=await _user(db, theirs))

    result = await cr.list_data_access_logs(
        _Auditor(ours), patient_id=their_patient, db=db, **_PAGING,
    )

    assert result.items == [], "asking for another facility's patient yields nothing"


async def test_integrity_checks_surface_a_broken_chain(db):
    """any_chain_invalid is computed over the whole history: a chain that broke
    months ago is still broken, and an auditor should not page back to find it."""
    ours = await _facility(db)
    for valid in (True, False, True):
        await db.execute(sa.text(
            # signatures_valid / signatures_invalid are NOT NULL with no default.
            "INSERT INTO audit_integrity_checks (id, facility_id, partition_name, "
            " checked_at, rows_checked, chain_valid, signatures_valid, signatures_invalid) "
            "VALUES (:id, :f, :p, now(), 10, :v, 10, 0)"),
            {"id": uuid.uuid4(), "f": ours, "p": f"audit_logs_{uuid.uuid4().hex[:6]}", "v": valid})
    await db.flush()

    result = await cr.list_integrity_checks(_Auditor(ours), db=db)

    assert len(result.items) == 3
    assert result.any_chain_invalid is True


async def test_integrity_checks_are_facility_scoped(db):
    ours, theirs = await _facility(db), await _facility(db)
    await db.execute(sa.text(
        "INSERT INTO audit_integrity_checks (id, facility_id, partition_name, "
        " checked_at, rows_checked, chain_valid, signatures_valid, signatures_invalid) "
        "VALUES (:id, :f, 'theirs', now(), 1, false, 0, 1)"),
        {"id": uuid.uuid4(), "f": theirs})
    await db.flush()

    result = await cr.list_integrity_checks(_Auditor(ours), db=db)

    assert result.items == []
    assert result.any_chain_invalid is False, (
        "another facility's broken chain must not raise our alarm"
    )


async def test_archives_report_verification_status(db):
    """An archive written but never verified is a retention claim nobody has
    checked — the column exists for that and had no way to be read."""
    ours = await _facility(db)
    await db.execute(sa.text(
        "INSERT INTO audit_log_archive (id, facility_id, partition_name, "
        " period_start, period_end, row_count, verification_status) "
        "VALUES (:id, :f, 'audit_logs_2026_01', '2026-01-01', '2026-01-31', 42, 'pending')"),
        {"id": uuid.uuid4(), "f": ours})
    await db.flush()

    result = await cr.list_archives(_Auditor(ours), db=db)

    assert len(result.items) == 1
    assert result.items[0].verification_status == "pending"
    assert result.items[0].row_count == 42
