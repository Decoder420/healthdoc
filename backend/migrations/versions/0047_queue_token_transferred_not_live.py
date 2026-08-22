"""0047 uq_queue_tokens_one_live_per_visit excludes 'transferred'

Revision ID: 0047
Revises: 0046
Create Date: 2026-08-22

0009 created a partial unique index enforcing one LIVE queue token per visit:

    UNIQUE (visit_id) WHERE status NOT IN ('completed','cancelled','no_show')

The intent is right — a patient cannot be waiting in two queues at once, and two
live tokens for one visit is how someone gets called twice or disappears from
the board when one of them completes.

But 'transferred' was left out of the exclusion list, and reassign_token()
depends on it being there. Reassignment marks the old token 'transferred' as a
permanent historical record and creates a new token for the same visit in the
target queue. With 'transferred' still counted as live, the new row collides
with the old one and **every reassignment fails against PostgreSQL**.

This was invisible for a long time because the ORM never declared the index at
all: the SQLite test database is built from ORM metadata, so the constraint did
not exist there, and the only tests exercising reassign ran green. #407 declared
it in the ORM, which is what surfaced the failure.

Fixed forward rather than by editing 0009, which has been applied.
"""
from alembic import op
import sqlalchemy as sa

revision = "0047"
down_revision = "0046"
branch_labels = None
depends_on = None

_INDEX = "uq_queue_tokens_one_live_per_visit"
_TABLE = "queue_tokens"

#: 'transferred' joins the terminal statuses. The row remains for audit; it is
#: no longer a queue position, because the patient is represented by the new
#: token created alongside it.
_NEW_PREDICATE = "status NOT IN ('completed','cancelled','no_show','transferred')"
_OLD_PREDICATE = "status NOT IN ('completed','cancelled','no_show')"


def upgrade() -> None:
    op.drop_index(_INDEX, table_name=_TABLE)
    op.create_index(
        _INDEX, _TABLE, ["visit_id"], unique=True,
        postgresql_where=sa.text(_NEW_PREDICATE),
    )


def downgrade() -> None:
    # Restores 0009's predicate. Note that downgrading re-breaks reassignment
    # for any visit holding a transferred token, and will fail outright if such
    # a visit already has a live token — which is the normal state after any
    # reassignment. Clear or complete those tokens first.
    op.drop_index(_INDEX, table_name=_TABLE)
    op.create_index(
        _INDEX, _TABLE, ["visit_id"], unique=True,
        postgresql_where=sa.text(_OLD_PREDICATE),
    )
