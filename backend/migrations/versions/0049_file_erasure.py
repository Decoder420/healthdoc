"""0049 file erasure — resolve #368 without destroying the access trail.

Revision ID: 0049
Revises: 0048
Create Date: 2026-08-24

THE CONFLICT
------------
`file_access_log.file_id` is NOT NULL with ondelete=RESTRICT. A DPDP erasure
request therefore cannot be satisfied: `DELETE FROM files` is refused for as
long as a single access-log row references the file, and clearing the log to
make room destroys the very audit evidence that DPDP Rules 2025 and NABH DHS
both require the hospital to retain. Deleting the record of who read a
patient's file is a worse privacy outcome than keeping the row.

WHY TOMBSTONE RATHER THAN RELAX THE FK
--------------------------------------
The obvious alternative is ondelete=SET NULL and a nullable file_id. That
leaves an access log full of rows saying "somebody viewed something", which
answers no question anyone would ask of it.

Erasure under DPDP is destruction of the personal data, not of the fact that
processing occurred. So the bytes go and the row stays:

  * the MinIO object is removed (service layer),
  * object_key, original_name and sha256 are cleared — original_name routinely
    carries the patient's name, and sha256 is a fingerprint that could confirm
    a suspected copy,
  * erased_at / erased_by / erasure_reason record the disposal,
  * the files row survives, so every FK stays valid and the access log keeps
    naming a real file.

RESTRICT is deliberately LEFT IN PLACE. It now expresses the actual rule —
a file row is never deleted, it is erased — which is the same append-only shape
this schema already uses for stock_ledger, payments and audit_logs. FileAction
already contained DELETE_ATTEMPT, i.e. the system was always designed to refuse
deletion and log the attempt; this migration finishes that thought rather than
reversing it.

STILL OPEN, AND NOT DECIDED HERE
--------------------------------
*When* erasure is permitted is a privacy/clinical decision, not a schema one.
Indian medical-record retention rules oblige a hospital to keep clinical
records for a statutory minimum, and DPDP's own carve-out for legally required
retention applies. Nothing here enforces a retention floor; the endpoint
records who authorised the erasure so that the decision is attributable when
that rule is set.
"""
from alembic import op
import sqlalchemy as sa

from app.common.enums import FileAction

revision = "0049"
down_revision = "0048"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("files", sa.Column("erased_at", sa.TIMESTAMP(timezone=True), nullable=True))
    op.add_column(
        "files",
        sa.Column(
            "erased_by",
            sa.dialects.postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="RESTRICT", name="fk_files_erased_by"),
            nullable=True,
        ),
    )
    op.add_column("files", sa.Column("erasure_reason", sa.Text(), nullable=True))

    # object_key and sha256 become nullable so an erased row can actually be
    # cleared. NULL is the honest value: there is no object and no digest,
    # because the bytes are gone. A placeholder string would keep the columns
    # NOT NULL at the cost of every reader having to know the magic value.
    #
    # uq_files_bucket_object_key still holds — PostgreSQL treats NULLs as
    # distinct in a unique constraint, so any number of erased rows coexist.
    op.alter_column("files", "object_key", existing_type=sa.Text(), nullable=True)
    op.alter_column("files", "sha256", existing_type=sa.CHAR(64), nullable=True)

    # ...but only an erased row may have them null. Without this, a bug in the
    # upload path could persist a row with no object and nothing would notice.
    op.create_check_constraint(
        "ck_files_object_present_unless_erased",
        "files",
        "erased_at IS NOT NULL OR (object_key IS NOT NULL AND sha256 IS NOT NULL)",
    )

    # An erased file must say why. Partial rather than a plain NOT NULL because
    # the column is meaningless for the overwhelming majority of rows.
    op.create_check_constraint(
        "ck_files_erasure_reason_present",
        "files",
        "erased_at IS NULL OR (erasure_reason IS NOT NULL AND erased_by IS NOT NULL)",
    )
    op.create_index(
        "ix_files_erased_at", "files", ["erased_at"], postgresql_where=sa.text("erased_at IS NOT NULL")
    )

    # The action CHECK is generated from the enum (see 0019), so adding ERASE
    # to FileAction means regenerating it here. Hardcoding the list in the
    # migration is what 0019's own comment warns against.
    op.drop_constraint("ck_file_access_log_action", "file_access_log", type_="check")
    op.create_check_constraint(
        "ck_file_access_log_action", "file_access_log", FileAction.sql_check("action")
    )


def downgrade() -> None:
    op.drop_constraint("ck_file_access_log_action", "file_access_log", type_="check")
    op.create_check_constraint(
        "ck_file_access_log_action",
        "file_access_log",
        "action IN ('view','download','upload','delete_attempt')",
    )
    op.drop_constraint("ck_files_object_present_unless_erased", "files", type_="check")

    # Erased rows have a NULL object_key, so restoring NOT NULL fails on them.
    #
    # The first version of this downgrade did `DELETE FROM files WHERE
    # erased_at IS NOT NULL` to clear the way. That is wrong twice over: it
    # would be REFUSED by the very ondelete=RESTRICT this migration exists to
    # work around, and if it somehow succeeded it would destroy the erasure
    # record — a downgrade that quietly deletes the evidence a hospital
    # lawfully erased something is worse than one that refuses to run.
    #
    # So it refuses, loudly, and says what to do.
    op.execute(
        """
        DO $$
        DECLARE n bigint;
        BEGIN
            SELECT count(*) INTO n FROM files WHERE erased_at IS NOT NULL;
            IF n > 0 THEN
                RAISE EXCEPTION
                    'Cannot downgrade 0049: % file(s) have been erased under DPDP. '
                    'Reverting would require deleting those rows, which '
                    'ondelete=RESTRICT forbids and which would destroy the erasure '
                    'record. Resolve the retention question before downgrading.', n;
            END IF;
        END $$;
        """
    )
    op.alter_column("files", "sha256", existing_type=sa.CHAR(64), nullable=False)
    op.alter_column("files", "object_key", existing_type=sa.Text(), nullable=False)
    op.drop_index("ix_files_erased_at", table_name="files")
    op.drop_constraint("ck_files_erasure_reason_present", "files", type_="check")
    op.drop_column("files", "erasure_reason")
    op.drop_column("files", "erased_by")
    op.drop_column("files", "erased_at")
