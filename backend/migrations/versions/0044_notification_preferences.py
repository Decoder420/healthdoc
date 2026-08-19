"""0044 notification_preferences

Revision ID: 0044
Revises: 0043
Create Date: 2026-08-19

Builds: notification_preferences -- per-role, per-event-type opt-out for
staff notifications (schema §25, B4-W6-01).

Notifications currently go to every role entitled to them, with no way
to opt a role out. This table is the exception list, not a full matrix:
a row only exists once someone has explicitly changed something away
from the default. Absence of a row means "default: enabled" -- there is
no fixed catalog of every possible event_type to seed rows for, since
event types are free-form strings introduced ad hoc across modules
(queue, pathology, inventory, ...), not a closed enum.

Scoped per facility, matching every other facility-scoped table --
HOD can opt their own department's role out; a global opt-out would
need every facility to agree, which isn't how any other per-facility
setting in this schema works.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0044"
down_revision = "0043"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "notification_preferences",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()")),
        sa.Column("facility_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("facilities.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("role", sa.String(50), nullable=False),
        sa.Column("event_type", sa.String(50), nullable=False),
        sa.Column("is_enabled", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_by", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("updated_by", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.func.now()),
        sa.UniqueConstraint("facility_id", "role", "event_type",
                            name="uq_notification_preferences_facility_role_event"),
    )
    op.create_index("ix_notification_preferences_facility_id", "notification_preferences", ["facility_id"])


def downgrade() -> None:
    op.drop_index("ix_notification_preferences_facility_id", table_name="notification_preferences")
    op.drop_table("notification_preferences")
