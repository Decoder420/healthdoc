"""0054 inventory transfer reservations.

Revision ID: 0054
Revises: 0053
Create Date: 2026-08-25

Stock transfers already existed in 0024, but there was no durable way to
reserve stock between dispatch and receipt.  A reservation belongs to the
source batch: every stock-out path must see it, while the append-only ledger
continues to be the only mechanism that changes physical quantity.
"""
import sqlalchemy as sa
from alembic import op

revision = "0054"
down_revision = "0053"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "inventory_batches",
        sa.Column(
            "reserved_quantity",
            sa.Numeric(12, 2),
            nullable=False,
            server_default="0",
        ),
    )
    op.create_check_constraint(
        "ck_inventory_batches_reserved_quantity",
        "inventory_batches",
        "reserved_quantity >= 0 AND reserved_quantity <= quantity",
    )


def downgrade() -> None:
    op.drop_constraint(
        "ck_inventory_batches_reserved_quantity",
        "inventory_batches",
        type_="check",
    )
    op.drop_column("inventory_batches", "reserved_quantity")
