"""prescriptions.facility_id (denormalized, matches orders.facility_id pattern from 0022)

Revision ID: 0035
Revises: 0034
Create Date: 2026-08-12

The Prescription model (app/orders/models.py) declares facility_id and the
__audit_facility_id_field__ auto-audit hook relies on it, but migration 0022
only added facility_id to orders — prescriptions was missed. Same backfill
pattern as 0022: derive from encounters.facility_id via encounter_id.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0035"
down_revision = "0034"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("prescriptions", sa.Column("facility_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.execute(
        "UPDATE prescriptions SET facility_id = encounters.facility_id "
        "FROM encounters WHERE encounters.id = prescriptions.encounter_id"
    )
    op.alter_column("prescriptions", "facility_id", nullable=False)
    op.create_foreign_key(
        "fk_prescriptions_facility_id", "prescriptions", "facilities", ["facility_id"], ["id"], ondelete="RESTRICT"
    )
    op.create_index("ix_prescriptions_facility_id", "prescriptions", ["facility_id"])


def downgrade() -> None:
    op.drop_index("ix_prescriptions_facility_id", table_name="prescriptions")
    op.drop_constraint("fk_prescriptions_facility_id", "prescriptions", type_="foreignkey")
    op.drop_column("prescriptions", "facility_id")
