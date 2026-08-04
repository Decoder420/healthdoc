"""files — files, file_access_log; also wires up the three FKs that were
left dangling since migrations 0008, 0006, and 0004
(order_external_results.result_file_id, patients.photo_file_id,
consent_records.guardian_id_proof_file_id)

Revision ID: 0019
Revises: 0017
Create Date: 2026-08-04

Owner: B7 (B7-W1-03). Schema doc: HealthDoc_Database_Schema_v3_13 §3 "0019 — files".

down_revision = "0017" — NOT "0018". 0018 is permanently retired per the
schema doc (§2): creating it would fork the migration history into two
heads and break every environment. 0019 chains directly off 0017 (OT
stubs, owned by B3). Neither 0017 nor anything before it is merged
yet — coordinating merge order in the team channel, same as 0004.

Notes for reviewers:
1. file_access_log has no Timestamps mixin (no updated_at) since it's
   append-only and accessed_at already serves as its event timestamp —
   same judgment call made for consent_withdrawals in 0004. Flagging
   again in case this should become a written project rule instead of a
   per-table decision.
2. The three ALTER TABLE statements at the end (wiring patients,
   consent_records, and order_external_results to files.id) only
   succeed if 0006, 0004, and 0008 have already run — which they will,
   since all three sit earlier in the chain by migration number.
   order_external_results.result_file_id (created NULL, no FK, back in
   0008 — B3) was previously missed here; the schema doc §3 0008 entry
   is explicit that its FK is "added in 0019", same deferred-FK pattern
   as the other two.
3. file_access_log is NOT partitioned, unlike audit_logs / data_access_log
   — the schema doc doesn't call for partitioning on this table, so kept
   it as a plain table with just the append-only block trigger.
4. files.scan_status added per §4A.4 (file upload validation contract):
   ClamAV scanning isn't wired up for MVP, so this column exists purely
   to make that gap visible on every row ('skipped') rather than
   implying a scan happened. No CheckedEnum defined for it yet in
   enums.py — the schema doc only fixes the default, not the full
   vocabulary, so no CHECK constraint is added here; revisit once the
   scanning pipeline lands and the value set is finalized.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "0019"
down_revision = "0017"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ------------------------------------------------------------------
    # 1. files
    # ------------------------------------------------------------------
    op.create_table(
        "files",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()")),
        sa.Column("bucket", sa.String(63), nullable=False),
        sa.Column("object_key", sa.Text(), nullable=False),
        sa.Column("original_name", sa.Text(), nullable=True),
        sa.Column("content_type", sa.String(100), nullable=True),
        sa.Column("size_bytes", sa.BigInteger(), nullable=True),
        sa.Column("sha256", sa.CHAR(64), nullable=True),
        sa.Column("owner_module", sa.String(30), nullable=True),
        sa.Column("patient_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("patients.id", ondelete="RESTRICT", name="fk_files_patient_id"),
                  nullable=True),
        sa.Column("uploaded_by", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="RESTRICT", name="fk_files_uploaded_by"),
                  nullable=False),
        sa.Column("sensitivity", sa.String(30), nullable=False, server_default="normal"),
        sa.Column("scan_status", sa.String(50), nullable=False, server_default="skipped"),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("bucket", "object_key", name="uq_files_bucket_object_key"),
    )
    op.create_index("ix_files_patient_id", "files", ["patient_id"])
    op.create_index("ix_files_uploaded_by", "files", ["uploaded_by"])

    # ------------------------------------------------------------------
    # 2. file_access_log — append-only, plain table (no partitioning).
    # ------------------------------------------------------------------
    op.create_table(
        "file_access_log",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()")),
        sa.Column("file_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("files.id", ondelete="RESTRICT", name="fk_file_access_log_file_id"),
                  nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="RESTRICT", name="fk_file_access_log_user_id"),
                  nullable=False),
        sa.Column("action", sa.String(30), nullable=False),
        sa.Column("ip_address", postgresql.INET(), nullable=True),
        sa.Column("accessed_at", sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.CheckConstraint(
            "action IN ('view', 'download', 'upload', 'delete_attempt')",
            name="ck_file_access_log_action",
        ),
    )
    op.create_index("ix_file_access_log_file_id", "file_access_log", ["file_id"])
    op.create_index("ix_file_access_log_user_id", "file_access_log", ["user_id"])

    op.execute(
        """
        CREATE OR REPLACE FUNCTION trg_file_access_log_block_update() RETURNS trigger AS $$
        BEGIN
            RAISE EXCEPTION 'file_access_log is append-only: % not permitted on this table', TG_OP;
        END;
        $$ LANGUAGE plpgsql;
        """
    )
    op.execute(
        """
        CREATE TRIGGER trg_file_access_log_block_update
        BEFORE UPDATE OR DELETE ON file_access_log
        FOR EACH ROW EXECUTE FUNCTION trg_file_access_log_block_update();
        """
    )

    # ------------------------------------------------------------------
    # 3. Deferred FKs — now that files exists, wire up the three columns
    #    that were created as plain UUID (no FK) back in 0006, 0004, and
    #    0008.
    # ------------------------------------------------------------------
    op.create_foreign_key(
        "fk_patients_photo_file_id", "patients", "files",
        ["photo_file_id"], ["id"], ondelete="RESTRICT",
    )
    op.create_foreign_key(
        "fk_consent_records_guardian_id_proof_file_id", "consent_records", "files",
        ["guardian_id_proof_file_id"], ["id"], ondelete="RESTRICT",
    )
    op.create_foreign_key(
        "fk_order_external_results_result_file_id", "order_external_results", "files",
        ["result_file_id"], ["id"], ondelete="RESTRICT",
    )


def downgrade() -> None:
    op.drop_constraint("fk_order_external_results_result_file_id", "order_external_results", type_="foreignkey")
    op.drop_constraint("fk_consent_records_guardian_id_proof_file_id", "consent_records", type_="foreignkey")
    op.drop_constraint("fk_patients_photo_file_id", "patients", type_="foreignkey")

    op.execute("DROP TRIGGER IF EXISTS trg_file_access_log_block_update ON file_access_log;")
    op.execute("DROP FUNCTION IF EXISTS trg_file_access_log_block_update();")

    op.drop_index("ix_file_access_log_user_id", table_name="file_access_log")
    op.drop_index("ix_file_access_log_file_id", table_name="file_access_log")
    op.drop_table("file_access_log")

    op.drop_index("ix_files_uploaded_by", table_name="files")
    op.drop_index("ix_files_patient_id", table_name="files")
    op.drop_table("files")
