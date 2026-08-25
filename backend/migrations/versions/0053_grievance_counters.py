"""0053 atomic grievance numbering.

Revision ID: 0053
Revises: 0052
Create Date: 2026-08-25
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0053"
down_revision = "0052"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "grievance_counters",
        sa.Column(
            "facility_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("facilities.id", ondelete="RESTRICT"),
            primary_key=True,
        ),
        sa.Column("counter_date", sa.Date(), primary_key=True),
        sa.Column("last_value", sa.Integer(), nullable=False),
        sa.CheckConstraint(
            "last_value > 0", name="ck_grievance_counters_last_value_positive"
        ),
    )
    # varchar(30) cannot hold GRV- + a permitted 20-character facility code +
    # YYYYMMDD + sequence. Widen rather than truncating a tenant identifier.
    op.alter_column(
        "patient_grievances",
        "grievance_number",
        existing_type=sa.String(30),  # pr-check: ignore — old type being widened
        type_=sa.String(50),
        existing_nullable=False,
    )


def downgrade() -> None:
    op.alter_column(
        "patient_grievances",
        "grievance_number",
        existing_type=sa.String(50),
        type_=sa.String(30),
        existing_nullable=False,
    )
    op.drop_table("grievance_counters")
