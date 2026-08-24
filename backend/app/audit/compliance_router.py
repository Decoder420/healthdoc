"""The auditor's console: the four compliance ledgers that had no read path.

`/audit/logs` and `/audit/logs/export` existed. These did not, over tables that
have existed since 0003, 0004 and 0019:

  * data_access_log      (0004) — who read which patient's data, and under what
                                  consent purpose. The DPDP record.
  * file_access_log      (0019) — who downloaded which file.
  * audit_integrity_checks (0003) — hash-chain verification results.
  * audit_log_archive    (0003) — what was archived to object storage, and
                                  whether it verified.

All read-only. No filters beyond the ones each table's own screen needs:
app/audit/router.py's docstring is explicit that extra filters and
cross-facility visibility are a Tech Lead decision rather than something to add
silently, and that applies here too.

SCOPING — two of these tables have no facility_id.

`audit_integrity_checks` and `audit_log_archive` carry one, so they filter
directly. `data_access_log` and `file_access_log` do not, and reach a facility
only through a join — patient_id -> patients.facility_id, and
file_id -> files.facility_id. That is the same shape as `allergies` and
`radiology_order_items`, both of which turned out to be unscoped precisely
because the missing column made the omission invisible. Written as joins from
the start here for that reason.

`data_access_log.patient_id` is NULLABLE. An access with no patient — a
purpose-level read, or a row written before the patient was resolved — cannot
be attributed to a facility by that join, and an INNER JOIN silently drops it.
Dropping rows from the ledger that records who looked at what is the one thing
this table must never do, so those rows are surfaced under an explicit flag
rather than filtered away. See list_data_access_logs.
"""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentDbUser, require_roles
from app.common.db import get_db

router = APIRouter(prefix="/audit", tags=["audit"])

_AUDITOR = [Depends(require_roles("auditor", "admin"))]


class DataAccessLogOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    accessed_at: str
    consent_id: uuid.UUID | None
    user_id: uuid.UUID | None
    role: str | None
    resource_type: str | None
    resource_id: uuid.UUID | None
    patient_id: uuid.UUID | None
    purpose_code: str | None
    access_channel: str | None
    emergency_access: bool | None
    consent_required: bool | None
    consent_verified: bool | None


class DataAccessLogListOut(BaseModel):
    items: list[DataAccessLogOut]
    page: int
    page_size: int
    #: Rows in this page with no patient_id, which therefore could not be
    #: facility-attributed. Reported, never silently dropped.
    unattributed_in_page: int


class FileAccessLogOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    file_id: uuid.UUID
    user_id: uuid.UUID | None
    action: str
    ip_address: str | None
    accessed_at: str


class FileAccessLogListOut(BaseModel):
    items: list[FileAccessLogOut]
    page: int
    page_size: int


class IntegrityCheckOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    facility_id: uuid.UUID
    partition_name: str
    checked_at: str
    rows_checked: int | None
    chain_valid: bool | None
    signatures_valid: int | None
    signatures_invalid: int | None
    first_mismatch_id: uuid.UUID | None
    alerted: bool | None


class IntegrityCheckListOut(BaseModel):
    items: list[IntegrityCheckOut]
    #: True when any check in this facility's history failed. The screen needs
    #: to lead with this rather than make an auditor scan the list.
    any_chain_invalid: bool


class ArchiveOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    facility_id: uuid.UUID
    partition_name: str
    period_start: str | None
    period_end: str | None
    row_count: int | None
    object_storage_bucket: str | None
    object_storage_key: str | None
    archive_file_hash: str | None
    archived_at: str | None
    verified_at: str | None
    verification_status: str | None


class ArchiveListOut(BaseModel):
    items: list[ArchiveOut]


def _iso(value) -> str | None:
    return value.isoformat() if value is not None else None


@router.get("/data-access", response_model=DataAccessLogListOut, dependencies=_AUDITOR)
async def list_data_access_logs(
    current_db_user: CurrentDbUser,
    patient_id: uuid.UUID | None = None,
    consent_id: uuid.UUID | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> DataAccessLogListOut:
    """The DPDP ledger: who read which patient's data, under what purpose.

    Scoped through patient_id -> patients.facility_id, because the table has no
    facility_id of its own.

    Rows with a NULL patient_id cannot be attributed by that join. They are
    included rather than dropped — this is the record of who looked at what,
    and quietly omitting entries from it would be worse than showing entries an
    auditor has to interpret. `unattributed_in_page` counts them so the screen
    can say so out loud.
    """
    from app.consent.models import DataAccessLog
    from app.patients.models import Patient

    scoped_patient_ids = select(Patient.id).where(
        Patient.facility_id == current_db_user.facility_id
    )

    q = select(DataAccessLog).where(
        (DataAccessLog.patient_id.in_(scoped_patient_ids))
        | (DataAccessLog.patient_id.is_(None))
    )
    if patient_id is not None:
        # Still intersected with the facility scope above — a patient_id
        # parameter narrows, it can never widen.
        q = q.where(DataAccessLog.patient_id == patient_id)
    if consent_id is not None:
        q = q.where(DataAccessLog.consent_id == consent_id)

    q = (
        q.order_by(DataAccessLog.accessed_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    rows = list((await db.execute(q)).scalars().all())

    return DataAccessLogListOut(
        items=[
            DataAccessLogOut(
                id=r.id,
                accessed_at=_iso(r.accessed_at),
                consent_id=r.consent_id,
                user_id=r.user_id,
                role=r.role,
                resource_type=r.resource_type,
                resource_id=r.resource_id,
                patient_id=r.patient_id,
                purpose_code=r.purpose_code,
                access_channel=r.access_channel,
                emergency_access=r.emergency_access,
                consent_required=r.consent_required,
                consent_verified=r.consent_verified,
            )
            for r in rows
        ],
        page=page,
        page_size=page_size,
        unattributed_in_page=sum(1 for r in rows if r.patient_id is None),
    )


@router.get("/file-access", response_model=FileAccessLogListOut, dependencies=_AUDITOR)
async def list_file_access_logs(
    current_db_user: CurrentDbUser,
    file_id: uuid.UUID | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> FileAccessLogListOut:
    """Who downloaded which file. Scoped through file_id -> files.facility_id.

    An INNER JOIN is correct here, unlike data-access: file_id is NOT NULL, so
    every row attributes to exactly one facility and none can be lost.
    """
    from app.files.models import FileAccessLog, FileRecord

    q = (
        select(FileAccessLog)
        .join(FileRecord, FileRecord.id == FileAccessLog.file_id)
        .where(FileRecord.facility_id == current_db_user.facility_id)
    )
    if file_id is not None:
        q = q.where(FileAccessLog.file_id == file_id)

    q = (
        q.order_by(FileAccessLog.accessed_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    rows = (await db.execute(q)).scalars().all()

    return FileAccessLogListOut(
        items=[
            FileAccessLogOut(
                id=r.id, file_id=r.file_id, user_id=r.user_id, action=r.action,
                ip_address=str(r.ip_address) if r.ip_address is not None else None,
                accessed_at=_iso(r.accessed_at),
            )
            for r in rows
        ],
        page=page,
        page_size=page_size,
    )


@router.get("/integrity-checks", response_model=IntegrityCheckListOut, dependencies=_AUDITOR)
async def list_integrity_checks(
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> IntegrityCheckListOut:
    """Hash-chain verification history for this facility's audit partitions.

    `any_chain_invalid` is computed over the whole history, not the page: a
    broken chain three months ago is still a broken chain, and an auditor
    should not have to page backwards to discover it.
    """
    from app.audit.models import AuditIntegrityCheck

    rows = list(
        (
            await db.execute(
                select(AuditIntegrityCheck)
                .where(AuditIntegrityCheck.facility_id == current_db_user.facility_id)
                .order_by(AuditIntegrityCheck.checked_at.desc())
            )
        ).scalars().all()
    )

    return IntegrityCheckListOut(
        items=[
            IntegrityCheckOut(
                id=r.id, facility_id=r.facility_id, partition_name=r.partition_name,
                checked_at=_iso(r.checked_at), rows_checked=r.rows_checked,
                chain_valid=r.chain_valid, signatures_valid=r.signatures_valid,
                signatures_invalid=r.signatures_invalid,
                first_mismatch_id=r.first_mismatch_id, alerted=r.alerted,
            )
            for r in rows
        ],
        any_chain_invalid=any(r.chain_valid is False for r in rows),
    )


@router.get("/archives", response_model=ArchiveListOut, dependencies=_AUDITOR)
async def list_archives(
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> ArchiveListOut:
    """Audit partitions moved to object storage, and whether they verified.

    `verification_status` is the column that matters: an archive written but
    never verified is a retention claim nobody has checked.
    """
    from app.audit.models import AuditLogArchive

    rows = (
        await db.execute(
            select(AuditLogArchive)
            .where(AuditLogArchive.facility_id == current_db_user.facility_id)
            .order_by(AuditLogArchive.period_start.desc())
        )
    ).scalars().all()

    return ArchiveListOut(
        items=[
            ArchiveOut(
                id=r.id, facility_id=r.facility_id, partition_name=r.partition_name,
                period_start=_iso(r.period_start), period_end=_iso(r.period_end),
                row_count=r.row_count,
                object_storage_bucket=r.object_storage_bucket,
                object_storage_key=r.object_storage_key,
                archive_file_hash=r.archive_file_hash,
                archived_at=_iso(r.archived_at), verified_at=_iso(r.verified_at),
                verification_status=r.verification_status,
            )
            for r in rows
        ]
    )
