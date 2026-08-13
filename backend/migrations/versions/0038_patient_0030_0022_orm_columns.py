"""0038 — map 0030 (abha_linking_token) and 0022 (guardian_verification)
columns onto the Patient ORM model. Migrations 0030 and 0022 already added
these columns to the database; this migration is a no-op DDL-wise (columns
exist) but documents the gap and gives alembic a clean head.

Revision ID: 0038
Revises: 0037
Create Date: 2026-08-13
"""
from alembic import op
import sqlalchemy as sa

revision = '0038'
down_revision = '0037'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Columns already exist from 0030 and 0022 — this migration only
    # records the chain so alembic upgrade head stays clean.
    pass


def downgrade() -> None:
    pass
