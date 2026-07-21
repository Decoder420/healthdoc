"""
SQLAlchemy models for the audit module.

Repo path: backend/app/audit/models.py

IMPORTANT — read before editing:
`audit_logs` is monthly-partitioned, append-only, and hash-chained at the
DATABASE level (partitioning + the two triggers below). That DDL is written
as raw SQL inside migration 0003, NOT generated from this file — Alembic's
autogenerate cannot produce `PARTITION BY RANGE` or trigger functions, and
the schema doc says so explicitly (see Vani's deltas in §5 of the schema
PDF). This models.py only describes the table's *shape* so the rest of the
app (service.py, other modules writing audit rows) can query/insert through
the ORM. Never call Base.metadata.create_all() for this table — the repo
rule is migrations-only, and for audit_logs specifically create_all()
wouldn't know how to partition it anyway.

Adjust the `from app.common.db import Base` import below to match whatever
your teammates' actual app/common/db.py exports (some teams name it
`Base`, others `Base = declarative_base()` re-exported differently — check
before you commit).
"""

from sqlalchemy import (
    Column,
    Text,
    CHAR,
    Boolean,
    BigInteger,
    Date,
    ForeignKey,
    PrimaryKeyConstraint,
    Index,
    CheckConstraint,
    text,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET
from sqlalchemy.types import TIMESTAMP

from app.common.db import Base  # <-- verify this matches your teammate's module


class AuditLog(Base):
    """
    Append-only, hash-chained, monthly-partitioned audit trail.

    Do NOT set `entry_hash` or `prev_hash` from application code — the
    BEFORE INSERT trigger `trg_audit_logs_compute_hash` computes both.
    DO set `signature` and `signer_key_id` from application code before
    insert — that's an Ed25519 signature over the row, and the DB has no
    private key to do it for you.

    Every write to this table must happen in the SAME transaction as the
    mutation it's recording (repo rule) — e.g. wrap the patient update and
    the AuditLog insert in one session.commit().
    """

    __tablename__ = "audit_logs"
    # NOTE (v3.3 index strategy addendum): there's also a BRIN index on
    # created_at (ix_audit_logs_created_at_brin), created in the migration.
    # It's intentionally not declared here as a SQLAlchemy Index() — this
    # table's DDL is all raw SQL in the migration anyway (see the note at
    # the top of this file), so the index lives there for consistency
    # rather than being split across two places.
    __table_args__ = (
        # Partitioned tables require the partition key (created_at) to be
        # part of every unique/primary key — hence the composite PK.
        PrimaryKeyConstraint("id", "created_at", name="pk_audit_logs"),
        Index("ix_audit_logs_user_id", "user_id", "created_at"),
        Index("ix_audit_logs_patient_id", "patient_id", "created_at"),
        Index("ix_audit_logs_resource", "resource_type", "resource_id"),
        {"postgresql_partition_by": "RANGE (created_at)"},
    )

    id = Column(UUID(as_uuid=True), nullable=False, server_default=text("uuid_generate_v4()"))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))

    facility_id = Column(UUID(as_uuid=True), ForeignKey("facilities.id", ondelete="RESTRICT"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=True)
    role = Column(Text, nullable=True)
    department_id = Column(UUID(as_uuid=True), nullable=True)  # FK constraint added in migration 0005
    action = Column(Text, nullable=False)  # e.g. create | update | merge | login
    resource_type = Column(Text, nullable=False)  # table/module name
    resource_id = Column(UUID(as_uuid=True), nullable=True)
    patient_id = Column(UUID(as_uuid=True), nullable=True)  # FK constraint added in migration 0006
    visit_id = Column(UUID(as_uuid=True), nullable=True)  # FK constraint added in migration 0007
    old_value = Column(JSONB, nullable=True)
    new_value = Column(JSONB, nullable=True)
    reason = Column(Text, nullable=True)
    ip_address = Column(INET, nullable=True)
    device_id = Column(Text, nullable=True)

    prev_hash = Column(CHAR(64), nullable=True)   # trigger-computed
    entry_hash = Column(CHAR(64), nullable=False)  # trigger-computed
    signature = Column(Text, nullable=False)        # app-computed (Ed25519)
    signer_key_id = Column(Text, nullable=False)     # app-computed

    def __repr__(self) -> str:  # pragma: no cover
        return f"<AuditLog id={self.id} action={self.action} resource={self.resource_type}:{self.resource_id}>"


class AuditLogArchive(Base):
    """Cold-storage record: one row per monthly partition, once archived to MinIO."""

    __tablename__ = "audit_log_archive"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()"))
    facility_id = Column(UUID(as_uuid=True), ForeignKey("facilities.id", ondelete="RESTRICT"), nullable=False)
    partition_name = Column(Text, nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    row_count = Column(BigInteger, nullable=False)
    object_storage_bucket = Column(Text, nullable=False)
    object_storage_key = Column(Text, nullable=False)
    archive_file_hash = Column(CHAR(64), nullable=False)
    archived_at = Column(TIMESTAMP(timezone=True), nullable=True)
    verified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    verification_status = Column(Text, nullable=False, server_default="pending")

    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))

    __table_args__ = (
        CheckConstraint(
            "verification_status IN ('pending', 'verified', 'failed')",
            name="ck_audit_log_archive_verification_status",
        ),
    )


class AuditIntegrityCheck(Base):
    """Result of a periodic job that re-walks a partition's hash chain and verifies signatures."""

    __tablename__ = "audit_integrity_checks"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()"))
    facility_id = Column(UUID(as_uuid=True), ForeignKey("facilities.id", ondelete="RESTRICT"), nullable=False)
    partition_name = Column(Text, nullable=False)
    checked_at = Column(TIMESTAMP(timezone=True), nullable=False)
    rows_checked = Column(BigInteger, nullable=False)
    chain_valid = Column(Boolean, nullable=False)
    signatures_valid = Column(BigInteger, nullable=False)
    signatures_invalid = Column(BigInteger, nullable=False)
    first_mismatch_id = Column(UUID(as_uuid=True), nullable=True)
    alerted = Column(Boolean, nullable=False, server_default=text("false"))

    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
