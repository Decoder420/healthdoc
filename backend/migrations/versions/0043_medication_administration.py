"""0043 medication_administration — the eMAR half of #390.

Revision ID: 0043
Revises: 0042
Create Date: 2026-08-17

WHY A NEW TABLE
---------------
0023 created vitals, intake_output_records, nursing_handover_notes and
patient_movement_log, and #390 asks for "vitals chart + eMAR table
(given/held/refused)". The vitals half already has storage. The eMAR half had
none — no table in any migration, no block in §3, no enum. So this is new
storage rather than another case of the ORM running ahead of the schema.

One row per administration attempt against one prescription_item. Not one row
per dose *scheduled*: a schedule is derived from the prescription's frequency
and duration, and materialising it would duplicate the prescription as the
source of truth. What must be recorded is what a nurse actually did, and when.

WHY held AND refused BOTH REQUIRE A REASON
------------------------------------------
`ck_medication_administration_reason_required` — a missed dose with no recorded
reason is exactly what an adverse-event review cannot reconstruct afterwards.
`given` may carry a note but does not require one.

administered_at is timestamptz and is the clinical time of the act. Do not
derive a business date from it with a bare ::date — use
(administered_at AT TIME ZONE facilities.timezone)::date, per the rule that
#387 was fixed to follow.
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql as pg

revision = "0043"
down_revision = "0042"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "medication_administration",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()")),

        # The dose being acted on. RESTRICT: an administration record must not
        # be orphaned by tidying up a prescription.
        sa.Column("prescription_item_id", pg.UUID(as_uuid=True),
                  sa.ForeignKey("prescription_items.id", ondelete="RESTRICT"), nullable=False),

        # Denormalised so the ward eMAR can be read per admission without
        # joining back through prescriptions -> encounters -> visits.
        sa.Column("admission_id", pg.UUID(as_uuid=True),
                  sa.ForeignKey("admissions.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("patient_id", pg.UUID(as_uuid=True),
                  sa.ForeignKey("patients.id", ondelete="RESTRICT"), nullable=False),

        sa.Column("scheduled_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("administered_at", sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.text("now()")),

        sa.Column("status", sa.String(30), nullable=False),
        sa.Column("dose_given", sa.String(100), nullable=True),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),

        sa.Column("created_by", pg.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("updated_by", pg.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.text("now()")),

        sa.CheckConstraint(
            "status IN ('given','held','refused')",
            name="ck_medication_administration_status"),
        sa.CheckConstraint(
            "status = 'given' OR (reason IS NOT NULL AND length(trim(reason)) > 0)",
            name="ck_medication_administration_reason_required"),
    )

    # The ward eMAR view: everything for one admission, most recent first.
    op.create_index(
        "ix_medication_administration_admission_at", "medication_administration",
        ["admission_id", sa.text("administered_at DESC")],
    )
    # "has this dose already been actioned?" on the drug round.
    op.create_index(
        "ix_medication_administration_item", "medication_administration",
        ["prescription_item_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_medication_administration_item", table_name="medication_administration")
    op.drop_index("ix_medication_administration_admission_at", table_name="medication_administration")
    op.drop_table("medication_administration")
