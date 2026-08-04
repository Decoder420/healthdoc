"""
SQLAlchemy models for the files module.

Repo path: backend/app/files/models.py

Table shapes here must match migration 0019
(backend/migrations/versions/0019_files.py) exactly.

patient_id gets a REAL ForeignKey here — patients (migration 0006) sits
earlier in the chain by number, so no need to defer it. uploaded_by is
real too, same reasoning.

Migration 0019 ALSO wires up three FK constraints onto EARLIER tables
now that files finally exists: patients.photo_file_id,
consent_records.guardian_id_proof_file_id, and
order_external_results.result_file_id all start pointing at files.id.
That ALTER TABLE work lives in the migration file, not here — this file
only describes the two new tables.
"""

import uuid
from datetime import datetime

from sqlalchemy import BigInteger, CheckConstraint, ForeignKey, Index, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import CHAR, INET, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.common.db import Base
from app.common.enums import FileAction
from app.common.models import Timestamps, UUIDPk


class FileRecord(UUIDPk, Timestamps, Base):
    """
    One row per uploaded file. The actual bytes live in MinIO — this row
    only stores where to find them (bucket + object_key) and who
    uploaded it. Never serve files directly off this table; always
    through a short-lived presigned URL endpoint (per schema doc §7).
    """

    __tablename__ = "files"

    bucket: Mapped[str] = mapped_column(String(63), nullable=False)
    object_key: Mapped[str] = mapped_column(Text, nullable=False)  # MinIO location
    original_name: Mapped[str | None] = mapped_column(Text, nullable=True)
    content_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    size_bytes: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    sha256: Mapped[str | None] = mapped_column(CHAR(64), nullable=True)
    owner_module: Mapped[str | None] = mapped_column(String(30), nullable=True)  # 'patients', 'lab', ...
    patient_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="RESTRICT", name="fk_files_patient_id"),
        nullable=True,
    )
    uploaded_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT", name="fk_files_uploaded_by"),
        nullable=False,
    )
    sensitivity: Mapped[str] = mapped_column(String(30), nullable=False, server_default="normal")
    scan_status: Mapped[str] = mapped_column(String(50), nullable=False, server_default="skipped")
    # ^ §4A.4: no malware scanner wired up for MVP. This column exists so the gap
    # is visible on every row ('skipped') instead of implied by silence. No
    # CheckedEnum in enums.py yet — schema doc only pins the default, not the
    # full vocabulary (e.g. clean/infected/error) — so no CHECK constraint here.

    __table_args__ = (
        Index("ix_files_patient_id", "patient_id"),
        Index("ix_files_uploaded_by", "uploaded_by"),
        UniqueConstraint("bucket", "object_key", name="uq_files_bucket_object_key"),
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<FileRecord id={self.id} bucket={self.bucket} key={self.object_key}>"


class FileAccessLog(UUIDPk, Base):
    """
    Append-only: every view/download/upload/delete-attempt on a file
    writes one row here that can never be changed or removed afterward.

    No Timestamps mixin here on purpose — accessed_at already IS this
    row's event timestamp, and an append-only row with an updated_at
    that can never legitimately change would be misleading. Same
    judgment call made for consent_withdrawals in migration 0004 —
    flagging again here in case Tech Lead wants this written down as a
    project-wide rule instead of a per-table decision each time.
    """

    __tablename__ = "file_access_log"

    file_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("files.id", ondelete="RESTRICT", name="fk_file_access_log_file_id"),
        nullable=False,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT", name="fk_file_access_log_user_id"),
        nullable=False,
    )
    action: Mapped[str] = mapped_column(String(30), nullable=False)  # view|download|upload|delete_attempt
    ip_address: Mapped[str | None] = mapped_column(INET, nullable=True)
    accessed_at: Mapped[datetime] = mapped_column(nullable=False, server_default=func.now())

    __table_args__ = (
        Index("ix_file_access_log_file_id", "file_id"),
        Index("ix_file_access_log_user_id", "user_id"),
        CheckConstraint(
            FileAction.sql_check("action"),
            name="ck_file_access_log_action",
        ),
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<FileAccessLog id={self.id} file={self.file_id} action={self.action}>"
