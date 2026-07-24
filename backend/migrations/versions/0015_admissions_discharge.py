"""0015_admissions_discharge

Revision ID: 0015
Revises: 0008
Create Date: 2026-07-23

Builds: wards, beds, admissions, discharges (schema.md §3, migration 0015)
Depends on: 0007 visits (chain-wise it sits after 0014 billing in the
team's overall build order, but B3 can develop against down_revision="0008"
now and rebase this file's down_revision once 0009-0014 land — see
schema.md §2's note: "if the previous migration isn't merged yet, set
down_revision to its number anyway and coordinate merge order in the
team channel.")
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0015"
down_revision = "0008"  # placeholder — update to "0014" once billing merges
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ----------------------------------------------------------- wards
    op.create_table(
        "wards",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                   server_default=sa.text("uuid_generate_v4()")),
        sa.Column("name", sa.Text, nullable=False),
        sa.Column("department_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("facility_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["department_id"], ["departments.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["facility_id"], ["facilities.id"], ondelete="RESTRICT"),
    )
    op.create_index("ix_wards_department_id", "wards", ["department_id"])
    op.create_index("ix_wards_facility_id", "wards", ["facility_id"])

    # ------------------------------------------------------------ beds
    op.create_table(
        "beds",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                   server_default=sa.text("uuid_generate_v4()")),
        sa.Column("ward_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("bed_number", sa.String(20), nullable=False),
        sa.Column("status", sa.String(50), nullable=False, server_default="vacant"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["ward_id"], ["wards.id"], ondelete="RESTRICT"),
        sa.UniqueConstraint("ward_id", "bed_number", name="uq_beds_ward_id_bed_number"),
        sa.CheckConstraint(
            "status IN ('vacant','occupied','reserved','maintenance')", name="ck_beds_status"
        ),
    )

    # ------------------------------------------------------- admissions
    op.create_table(
        "admissions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                   server_default=sa.text("uuid_generate_v4()")),
        sa.Column("visit_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("patient_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("ward_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("bed_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("admitted_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("reason", sa.Text, nullable=True),
        sa.Column("status", sa.String(50), nullable=False, server_default="admitted"),
        sa.Column("created_by", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("updated_by", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["visit_id"], ["visits.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["patient_id"], ["patients.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["ward_id"], ["wards.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["bed_id"], ["beds.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["updated_by"], ["users.id"]),
        sa.CheckConstraint(
            "status IN ('admission_requested','bed_pending','admitted','ward_transfer_pending',"
            "'transferred','discharge_planned','discharge_summary_pending',"
            "'billing_clearance_pending','discharged','referred','lama','death')",
            name="ck_admissions_status",
        ),
    )
    op.create_index("ix_admissions_visit_id", "admissions", ["visit_id"])
    op.create_index("ix_admissions_patient_id", "admissions", ["patient_id"])
    op.create_index("ix_admissions_ward_id", "admissions", ["ward_id"])
    op.create_index("ix_admissions_bed_id", "admissions", ["bed_id"])

    # ------------------------------------------------------- discharges
    op.create_table(
        "discharges",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                   server_default=sa.text("uuid_generate_v4()")),
        sa.Column("admission_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("discharged_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("discharge_type", sa.String(50), nullable=False),
        sa.Column("discharge_summary", sa.Text, nullable=True),
        sa.Column("follow_up_date", sa.Date, nullable=True),
        sa.Column("created_by", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("updated_by", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["admission_id"], ["admissions.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["updated_by"], ["users.id"]),
        sa.UniqueConstraint("admission_id", name="uq_discharges_admission_id"),
        sa.CheckConstraint(
            "discharge_type IN ('discharged','dama','deceased','absconded','transferred')",
            name="ck_discharges_discharge_type",
        ),
    )


def downgrade() -> None:
    op.drop_table("discharges")
    op.drop_table("admissions")
    op.drop_table("beds")
    op.drop_table("wards")
