"""#368 — DPDP erasure without destroying the access trail.

THE BUG, STATED AS A THING NOBODY COULD DO

`file_access_log.file_id` is NOT NULL with ondelete=RESTRICT. A hospital
receiving a lawful erasure request had two options, both wrong:

  * DELETE the file row — refused by RESTRICT for as long as one access-log row
    referenced it, which is always, because uploading writes one;
  * delete the access-log rows first — destroying the record of who read a
    patient's file, which DPDP Rules 2025 and NABH DHS both require be kept.

The resolution is that erasure destroys the DATA, not the evidence that
processing occurred. The bytes go, the row is tombstoned, the log survives.

Run against real PostgreSQL. The whole point is the RESTRICT FK and two new
CHECK constraints, none of which a schema built from ORM metadata would prove
anything about — the same blind spot that hid the queue-token index bug.

Fixtures come from tests/files/conftest.py (engine / facility_id / user_id) and
`session_factory` mirrors tests/files/test_files_api.py rather than inventing a
second way to open a session.
"""
from __future__ import annotations

import uuid
from unittest.mock import patch

import pytest
from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker

from app.audit.actions import AuditAction
from app.common.enums import FileAction
from app.files import service
from app.files.models import FileRecord
from app.files.schemas import FileEraseRequest


@pytest.fixture
def session_factory(engine: AsyncEngine):
    return async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


@pytest.fixture
def no_minio():
    """Object removal is I/O to MinIO, which these tests do not run.

    Patched rather than skipped, because the ORDER of removal and tombstoning is
    itself under test — see test_a_failed_object_removal_leaves_the_file_intact.
    """
    with patch("app.files.service.get_minio_client") as client:
        yield client


async def _seed_file(db: AsyncSession, facility_id: uuid.UUID, user_id: uuid.UUID) -> uuid.UUID:
    file_id = uuid.uuid4()
    await db.execute(
        text("""
            INSERT INTO files (id, bucket, object_key, original_name, content_type,
                               size_bytes, sha256, facility_id, uploaded_by, sensitivity)
            VALUES (:id, 'healthdoc', :key, 'scan-of-aadhaar.pdf', 'application/pdf',
                    1024, :sha, :fid, :uid, 'critical')
        """),
        {"id": file_id, "key": f"f/{file_id}.pdf", "sha": "a" * 64,
         "fid": facility_id, "uid": user_id},
    )
    # Uploading always writes an access-log row. That row is precisely what made
    # the file undeletable.
    await db.execute(
        text("""
            INSERT INTO file_access_log (id, file_id, user_id, action)
            VALUES (:id, :fid, :uid, 'upload')
        """),
        {"id": uuid.uuid4(), "fid": file_id, "uid": user_id},
    )
    await db.flush()
    return file_id


async def test_the_file_row_cannot_simply_be_deleted(session_factory, facility_id, user_id):
    """The constraint that created the problem.

    Pinned so nobody 'resolves' #368 later by quietly relaxing the FK — that
    would trade a compliance failure for a worse one.
    """
    async with session_factory() as db:
        file_id = await _seed_file(db, facility_id, user_id)

        with pytest.raises(Exception) as caught:
            await db.execute(text("DELETE FROM files WHERE id = :id"), {"id": file_id})
            await db.flush()

        assert "foreign key" in str(caught.value).lower()


@pytest.mark.parametrize("reason", ["", " ", "\t\n"])
def test_erasure_reason_cannot_be_blank(reason):
    with pytest.raises(ValidationError):
        FileEraseRequest(reason=reason)


def test_erasure_reason_is_trimmed():
    assert FileEraseRequest(reason="  DPDP request GRV-41  ").reason == "DPDP request GRV-41"


async def test_erasure_destroys_the_data_and_keeps_the_trail(
    session_factory, facility_id, user_id, no_minio
):
    """The whole point, in one test."""
    async with session_factory() as db:
        file_id = await _seed_file(db, facility_id, user_id)

        record = await service.erase_file(
            db, file_id, facility_id=facility_id, user_id=user_id,
            reason="DPDP erasure request GRV-2026-0041", ip_address="10.0.0.9",
        )

        # Data destroyed.
        assert record.object_key is None, "no object left to fetch"
        assert record.sha256 is None, "a digest would confirm a suspected copy"
        assert record.original_name is None, "the filename carried the patient's name"
        no_minio.return_value.remove_object.assert_called_once()

        # Evidence kept.
        assert record.is_erased and record.erased_by == user_id
        assert record.erasure_reason == "DPDP erasure request GRV-2026-0041"

        actions = (await db.execute(
            text("SELECT action FROM file_access_log WHERE file_id = :id"),
            {"id": file_id},
        )).scalars().all()
        assert "upload" in actions, "the original access record survives erasure"
        assert FileAction.ERASE.value in actions, "and the erasure is itself logged"

        audit = (await db.execute(
            text("""
                SELECT action, resource_type, resource_id, user_id, reason,
                       old_value, new_value, ip_address::text
                FROM audit_logs
                WHERE facility_id = :facility_id
                  AND resource_type = 'files'
                  AND resource_id = :file_id
                ORDER BY created_at DESC
                LIMIT 1
            """),
            {"facility_id": facility_id, "file_id": file_id},
        )).mappings().one()
        assert audit["action"] == AuditAction.ERASE
        assert audit["resource_id"] == file_id
        assert audit["user_id"] == user_id
        assert audit["reason"] == "DPDP erasure request GRV-2026-0041"
        assert audit["old_value"] == {"erased_at": None, "content_present": True}
        assert audit["new_value"]["content_present"] is False
        assert audit["new_value"]["erased_at"] is not None
        assert audit["ip_address"] == "10.0.0.9/32"


async def test_the_erasure_is_logged_as_erase_not_as_a_refused_delete(
    session_factory, facility_id, user_id, no_minio
):
    """FileAction already had DELETE_ATTEMPT, which means a REFUSED deletion.

    Reusing it for a lawful erasure would leave the access log unable to
    distinguish "someone tried to delete this and was stopped" from "the data
    controller destroyed this on request" — the one distinction that matters if
    the log is ever produced as evidence.
    """
    async with session_factory() as db:
        file_id = await _seed_file(db, facility_id, user_id)
        await service.erase_file(
            db, file_id, facility_id=facility_id, user_id=user_id,
            reason="request", ip_address=None,
        )

        actions = (await db.execute(
            text("SELECT action FROM file_access_log WHERE file_id = :id"),
            {"id": file_id},
        )).scalars().all()
        assert FileAction.ERASE.value in actions
        assert FileAction.DELETE_ATTEMPT.value not in actions


async def test_downloading_an_erased_file_is_410_not_404(
    session_factory, facility_id, user_id, no_minio
):
    """404 would claim it never existed, contradicting the metadata read, which
    still returns the tombstone. 410 says what actually happened."""
    async with session_factory() as db:
        file_id = await _seed_file(db, facility_id, user_id)
        await service.erase_file(
            db, file_id, facility_id=facility_id, user_id=user_id,
            reason="request", ip_address=None,
        )

        with pytest.raises(HTTPException) as caught:
            await service.get_download_url(
                db, file_id, facility_id=facility_id, user_id=user_id, ip_address=None,
            )
        assert caught.value.status_code == 410


async def test_the_metadata_read_still_returns_the_tombstone(
    session_factory, facility_id, user_id, no_minio
):
    """Erasure is not concealment. Someone entitled to the file is entitled to
    know it was destroyed and why — otherwise the access log cannot be
    reconciled against what users were actually told."""
    async with session_factory() as db:
        file_id = await _seed_file(db, facility_id, user_id)
        await service.erase_file(
            db, file_id, facility_id=facility_id, user_id=user_id,
            reason="GRV-2026-0041", ip_address=None,
        )

        record = await service.get_file_record(db, file_id, facility_id=facility_id)

        assert record.is_erased
        assert record.erasure_reason == "GRV-2026-0041"


async def test_erasing_twice_is_refused(session_factory, facility_id, user_id, no_minio):
    """The second call has nothing left to destroy. Reporting success would let
    a caller believe they had erased something they had not — the first erasure
    may have been of a different file entirely."""
    async with session_factory() as db:
        file_id = await _seed_file(db, facility_id, user_id)
        kwargs = dict(facility_id=facility_id, user_id=user_id, reason="req", ip_address=None)

        await service.erase_file(db, file_id, **kwargs)

        with pytest.raises(service.FileAlreadyErased):
            await service.erase_file(db, file_id, **kwargs)


async def test_a_failed_object_removal_leaves_the_file_intact(
    session_factory, facility_id, user_id, no_minio
):
    """Order matters: MinIO first, tombstone second.

    The other order produces a row certifying the data is gone while the object
    is still sitting in the bucket — a false erasure certificate, which is worse
    than a visible failure because nobody goes looking for it.
    """
    async with session_factory() as db:
        file_id = await _seed_file(db, facility_id, user_id)
        no_minio.return_value.remove_object.side_effect = RuntimeError("MinIO unreachable")

        with pytest.raises(RuntimeError):
            await service.erase_file(
                db, file_id, facility_id=facility_id, user_id=user_id,
                reason="request", ip_address=None,
            )

        record = await db.get(FileRecord, file_id)
        assert not record.is_erased, "nothing may be certified erased while the object remains"
        assert record.object_key is not None


async def test_another_facilitys_file_cannot_be_erased(
    session_factory, facility_id, second_facility_id, user_id, no_minio
):
    """Erasure is destructive and irreversible, so the facility check matters
    more here than on any read. 404 rather than 403 — 403 confirms the id
    exists, which is an enumeration oracle over another hospital's files."""
    async with session_factory() as db:
        file_id = await _seed_file(db, facility_id, user_id)

        with pytest.raises(HTTPException) as caught:
            await service.erase_file(
                db, file_id, facility_id=second_facility_id, user_id=user_id,
                reason="request", ip_address=None,
            )
        assert caught.value.status_code == 404
        no_minio.return_value.remove_object.assert_not_called()


async def test_a_live_row_cannot_lose_its_object_key(session_factory, facility_id, user_id):
    """ck_files_object_present_unless_erased.

    Making object_key nullable for erasure would otherwise let a half-failed
    upload persist a row pointing at nothing, indistinguishable from a lawful
    erasure. The CHECK keeps the nullability scoped to erased rows only.
    """
    async with session_factory() as db:
        file_id = await _seed_file(db, facility_id, user_id)

        with pytest.raises(Exception) as caught:
            await db.execute(
                text("UPDATE files SET object_key = NULL WHERE id = :id"), {"id": file_id}
            )
            await db.flush()

        assert "ck_files_object_present_unless_erased" in str(caught.value)


async def test_an_erased_row_must_name_who_and_why(session_factory, facility_id, user_id):
    """ck_files_erasure_reason_present. An erasure with no reason and no actor is
    exactly the record a regulator asks about, and exactly the one that could
    not answer."""
    async with session_factory() as db:
        file_id = await _seed_file(db, facility_id, user_id)

        with pytest.raises(Exception) as caught:
            await db.execute(
                text("UPDATE files SET erased_at = now() WHERE id = :id"), {"id": file_id}
            )
            await db.flush()

        assert "ck_files_erasure_reason_present" in str(caught.value)
