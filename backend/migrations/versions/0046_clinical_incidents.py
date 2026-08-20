"""0046 clinical_incidents — NABH DHS incident reporting.

Revision ID: 0046
Revises: 0045
Create Date: 2026-08-17

WHY A NEW TABLE
---------------
`data_breach_notifications` (0022a) already exists and is sometimes mistaken
for this. It is not: that table covers DPDP / CERT-In *data* incidents, with a
6-hour statutory reporting clock and a DPO as the responsible party.

A patient fall, a medication error and a leaked record are all "incidents" and
share nothing operationally — different reporters, different review paths,
different statutory clocks, different audiences. Storing them together would
mean every query for one had to exclude the other, and the 6-hour breach clock
would sit uselessly on rows it does not apply to.

DESIGN
------
* **patient_id is nullable.** A sharps injury to staff, or an equipment failure
  found before use, is a reportable incident with no patient attached. Forcing
  one would push staff to attribute incidents to whichever patient was nearby.

* **severity is harm that REACHED the patient**, not harm risked. `near_miss`
  is a *type*, not a severity — an event that reached a patient and caused no
  harm is a different fact from one that never reached them, and collapsing
  them hides the first, which is the one that says a barrier failed late.

* **Nothing is ever deleted.** Status moves reported -> under_review ->
  action_taken -> closed. An incident register that can be emptied is not a
  register.

* **reported_by is NOT NULL, but anonymity is a policy question.** NABH expects
  a named reporter; a blame-free culture argues otherwise. This records the
  reporter and leaves redaction-on-display to the application, rather than
  discarding the fact at write time where it cannot be recovered.
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql as pg

revision = "0046"
down_revision = "0045"
branch_labels = None
depends_on = None

_TYPES = ("'medication_error','patient_fall','pressure_injury','wrong_patient',"
          "'wrong_site','equipment_failure','needlestick','transfusion_reaction',"
          "'hospital_acquired_infection','near_miss','other'")
_SEVERITIES = "'no_harm','minor','moderate','severe','death'"
_STATUSES = "'reported','under_review','action_taken','closed'"


def upgrade() -> None:
    op.create_table(
        "clinical_incidents",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()")),

        sa.Column("facility_id", pg.UUID(as_uuid=True),
                  sa.ForeignKey("facilities.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("department_id", pg.UUID(as_uuid=True),
                  sa.ForeignKey("departments.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("ward_id", pg.UUID(as_uuid=True),
                  sa.ForeignKey("wards.id", ondelete="RESTRICT"), nullable=True),

        # Nullable on purpose — see the module docstring.
        sa.Column("patient_id", pg.UUID(as_uuid=True),
                  sa.ForeignKey("patients.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("admission_id", pg.UUID(as_uuid=True),
                  sa.ForeignKey("admissions.id", ondelete="RESTRICT"), nullable=True),

        sa.Column("incident_type", sa.String(50), nullable=False),
        sa.Column("severity", sa.String(30), nullable=False),
        sa.Column("status", sa.String(30), nullable=False, server_default="reported"),

        sa.Column("occurred_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("reported_at", sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.text("now()")),

        sa.Column("description", sa.Text(), nullable=False),
        #: What was done for the patient immediately. Required: an incident with
        #: no recorded response is the one a review cannot defend.
        sa.Column("immediate_action", sa.Text(), nullable=False),

        sa.Column("reported_by", pg.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("reviewed_by", pg.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("root_cause", sa.Text(), nullable=True),
        sa.Column("corrective_action", sa.Text(), nullable=True),

        sa.Column("created_by", pg.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("updated_by", pg.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.text("now()")),

        sa.CheckConstraint(f"incident_type IN ({_TYPES})",
                           name="ck_clinical_incidents_incident_type"),
        sa.CheckConstraint(f"severity IN ({_SEVERITIES})",
                           name="ck_clinical_incidents_severity"),
        sa.CheckConstraint(f"status IN ({_STATUSES})",
                           name="ck_clinical_incidents_status"),

        # Review evidence travels together, same reasoning as 0045's pairs.
        sa.CheckConstraint("(reviewed_at IS NULL) = (reviewed_by IS NULL)",
                           name="ck_clinical_incidents_review_pair"),

        # A closed incident must say what was found and what changed. Closing
        # one with an empty root cause is how a register becomes a filing
        # cabinet nobody learns from.
        sa.CheckConstraint(
            "status <> 'closed' OR (reviewed_at IS NOT NULL "
            "AND root_cause IS NOT NULL AND corrective_action IS NOT NULL)",
            name="ck_clinical_incidents_closed_is_complete"),

        # An incident cannot be reported before it happened.
        sa.CheckConstraint("reported_at >= occurred_at",
                           name="ck_clinical_incidents_reported_after_occurred"),
    )

    # The register view: everything open at a facility, most recent first.
    op.create_index(
        "ix_clinical_incidents_facility_status", "clinical_incidents",
        ["facility_id", "status", sa.text("occurred_at DESC")],
    )
    # Patient safety review: this patient's incident history.
    op.create_index(
        "ix_clinical_incidents_patient", "clinical_incidents", ["patient_id"],
        postgresql_where=sa.text("patient_id IS NOT NULL"),
    )


def downgrade() -> None:
    op.drop_index("ix_clinical_incidents_patient", table_name="clinical_incidents")
    op.drop_index("ix_clinical_incidents_facility_status", table_name="clinical_incidents")
    op.drop_table("clinical_incidents")
