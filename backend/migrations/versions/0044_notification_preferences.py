"""0044 notification_preferences — the per-role half of #230.

Revision ID: 0044
Revises: 0043
Create Date: 2026-08-17

#230 asked for "notification history API + per-role preferences". The history
API shipped; preferences did not — there was no `preference` anywhere in the
backend, so every notification reached everyone entitled to see it with no way
to turn a category off for a role.

OPT-OUT, NOT OPT-IN
-------------------
The absence of a row means enabled. A row exists only to record a deliberate
decision to silence something.

That direction is chosen on purpose: with opt-in, adding a new event_type would
make it silently invisible to every role until someone remembered to switch it
on, and the failure mode of a missed clinical notification is worse than the
failure mode of one too many. `low_stock_alert` going unread is an annoyance;
`lab_critical_result` going unread is a patient safety event.

WHY role IS NOT CHECK-CONSTRAINED
---------------------------------
Roles come from the Keycloak realm, not from our schema. A CHECK here would
have to be kept in step with realm configuration by hand, and would start
rejecting writes the moment the realm gained a role — a worse failure than
storing one we do not recognise.

event_type is likewise uncontrained: the values in use (token_called,
lab_critical_result, low_stock_alert, ...) are set by the publishing modules,
and pinning them here would mean a migration every time one is added.
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql as pg

revision = "0044"
down_revision = "0043"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "notification_preferences",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()")),
        sa.Column("facility_id", pg.UUID(as_uuid=True),
                  sa.ForeignKey("facilities.id", ondelete="RESTRICT"), nullable=False),

        sa.Column("role", sa.String(50), nullable=False),
        sa.Column("event_type", sa.String(50), nullable=False),

        #: false is the only reason a row exists. Kept explicit rather than
        #: implied by presence, so re-enabling is an UPDATE with an audit trail
        #: rather than a DELETE that leaves no trace of the earlier decision.
        sa.Column("enabled", sa.Boolean(), nullable=False, server_default=sa.true()),

        sa.Column("created_by", pg.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("updated_by", pg.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.text("now()")),

        # Also the read-path index. Postgres backs a UNIQUE constraint with a
        # btree on exactly these columns in this order, so it already serves
        # "is this event_type silenced for this role here?" and the
        # facility-wide list (facility_id leads). An explicit index on the same
        # three columns would be a second copy of the same tree, paid for on
        # every write and never read. Suprita's #396 was right not to add one.
        sa.UniqueConstraint("facility_id", "role", "event_type",
                            name="uq_notification_preferences_scope"),
    )


def downgrade() -> None:
    op.drop_table("notification_preferences")
