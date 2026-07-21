"""
SQLAlchemy models for the audit module.

Repo path: backend/app/audit/models.py

`audit_logs` is monthly-partitioned, append-only, and hash-chained at the
DATABASE level — partitioning + both triggers live as raw SQL in migration
0003 (backend/migrations/versions/0003_audit.py), because Alembic
autogenerate cannot produce `PARTITION BY RANGE` or trigger DDL. This file
only describes the table's shape so the app can query/insert through the
ORM. Never call Base.metadata.create_all() for this table — migrations
only (repo rule), and create_all() wouldn't know how to partition it
anyway.

department_id, patient_id, and visit_id are plain UUID columns with NO
ForeignKey() here. departments/patients/visits don't exist as tables yet
(they land in migrations 0005/0006/0007) — you cannot reference a table
that doesn't exist, Postgres would reject the CREATE TABLE outright. Those
FK constraints get added later via ALTER TABLE, inside those migrations.
facility_id and user_id DO get real ForeignKey()s below, since facilities
and users are real as of migration 0002.
"""

import uuid
from datetime import date, datetime

from sqlalchemy import BigInteger, CheckConstraint, ForeignKey, Index, func, text
from sqlalchemy.dialects.postgresql import CHAR, INET, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.common.db import Base
from app.common.models import Timestamps, UUIDPk


class AuditLog(UUIDPk, Base):
    """
    Append-only, hash-chained, monthly-partitioned audit trail.

    Composite PK (id, created_at) — Postgres partitioned tables must
    include the partition key in every unique/primary key. UUIDPk gives us
    `id`; `created_at` is declared here with primary_key=True to complete
    the pair. Deliberately NOT using the Timestamps mixin — this table has
    no `updated_at` (append-only tables never get one, per schema doc).

    Do NOT set `entry_hash` / `prev_hash` from application code — the
    BEFORE INSERT trigger `trg_audit_logs_compute_hash` computes both.
    DO set `signature` and `signer_key_id` from application code — Ed25519
    signing happens in the app layer, the DB has no private key.

    Every write to this table must happen in the SAME transaction as the
    mutation it's recording (repo rule) — e.g. wrap the patient update and
    the AuditLog insert in one session.commit().
    """

    __tablename__ = "audit_logs"

    created_at: Mapped[datetime] = mapped_column(
        primary_key=True, server_default=func.now(), nullable=False
    )

    facility_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("facilities.id", ondelete="RESTRICT", name="fk_audit_logs_facility_id"),
        nullable=False,
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT", name="fk_audit_logs_user_id"),
        nullable=True,
    )
    role: Mapped[str | None] = mapped_column(nullable=True)
    department_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)  # FK added in 0005
    action: Mapped[str] = mapped_column(nullable=False)  # create | update | merge | login | ...
    resource_type: Mapped[str] = mapped_column(nullable=False)  # table/module name
    resource_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    patient_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)  # FK added in 0006
    visit_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)  # FK added in 0007
    old_value: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    new_value: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    reason: Mapped[str | None] = mapped_column(nullable=True)
    ip_address: Mapped[str | None] = mapped_column(INET, nullable=True)
    device_id: Mapped[str | None] = mapped_column(nullable=True)

    prev_hash: Mapped[str | None] = mapped_column(CHAR(64), nullable=True)
    entry_hash: Mapped[str] = mapped_column(CHAR(64), nullable=False)  # trigger-computed
    signature: Mapped[str] = mapped_column(nullable=False)  # app-computed (Ed25519)
    signer_key_id: Mapped[str] = mapped_column(nullable=False)  # app-computed

    __table_args__ = (
        Index("ix_audit_logs_user_id", "user_id", "created_at"),
        Index("ix_audit_logs_patient_id", "patient_id", "created_at"),
        Index("ix_audit_logs_resource", "resource_type", "resource_id"),
        {"postgresql_partition_by": "RANGE (created_at)"},
    )
    # NOTE: a BRIN index on created_at (ix_audit_logs_created_at_brin, per
    # the v3.3 index strategy addendum) is created in the migration only —
    # BRIN isn't declared here since this table's whole DDL lives in raw
    # SQL for consistency (see module docstring above).

    def __repr__(self) -> str:  # pragma: no cover
        return f"<AuditLog id={self.id} action={self.action} resource={self.resource_type}:{self.resource_id}>"


class AuditLogArchive(UUIDPk, Timestamps, Base):
    """
    [no Blame] — record of a monthly audit_logs partition moved to object storage.

    Nullability note: only facility_id and partition_name are required at
    row-creation time (you know which partition you're archiving before
    the job finishes). Everything else (object_storage_bucket/key,
    archive_file_hash, row_count, archived_at, verified_at) fills in
    progressively as the archive job runs — the schema doc doesn't mark
    these NOT NULL, which matches that workflow. Flag this interpretation
    in your PR in case Tech Lead intended stricter constraints.
    """

    __tablename__ = "audit_log_archive"

    facility_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("facilities.id", ondelete="RESTRICT", name="fk_audit_log_archive_facility_id"),
        nullable=False,
    )
    partition_name: Mapped[str] = mapped_column(nullable=False)
    period_start: Mapped[date | None] = mapped_column(nullable=True)
    period_end: Mapped[date | None] = mapped_column(nullable=True)
    row_count: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    object_storage_bucket: Mapped[str | None] = mapped_column(nullable=True)
    object_storage_key: Mapped[str | None] = mapped_column(nullable=True)
    archive_file_hash: Mapped[str | None] = mapped_column(CHAR(64), nullable=True)
    archived_at: Mapped[datetime | None] = mapped_column(nullable=True)
    verified_at: Mapped[datetime | None] = mapped_column(nullable=True)
    verification_status: Mapped[str] = mapped_column(nullable=False, server_default="pending")

    __table_args__ = (
        CheckConstraint(
            "verification_status IN ('pending', 'verified', 'failed')",
            name="ck_audit_log_archive_verification_status",
        ),
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<AuditLogArchive id={self.id} partition={self.partition_name}>"


class AuditIntegrityCheck(UUIDPk, Timestamps, Base):
    """Result of a periodic job that re-walks a partition's hash chain and verifies signatures."""

    __tablename__ = "audit_integrity_checks"

    facility_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("facilities.id", ondelete="RESTRICT", name="fk_audit_integrity_checks_facility_id"),
        nullable=False,
    )
    partition_name: Mapped[str] = mapped_column(nullable=False)
    checked_at: Mapped[datetime] = mapped_column(nullable=False)
    rows_checked: Mapped[int] = mapped_column(BigInteger, nullable=False)
    chain_valid: Mapped[bool] = mapped_column(nullable=False)
    signatures_valid: Mapped[int] = mapped_column(BigInteger, nullable=False)
    signatures_invalid: Mapped[int] = mapped_column(BigInteger, nullable=False)
    first_mismatch_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    alerted: Mapped[bool] = mapped_column(nullable=False, server_default=text("false"))

    def __repr__(self) -> str:  # pragma: no cover
        return (
            f"<AuditIntegrityCheck id={self.id} partition={self.partition_name} "
            f"chain_valid={self.chain_valid}>"
        )