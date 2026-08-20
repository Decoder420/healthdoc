"""0045 orders: explicit acceptance and completion, with actor and timestamp.

Revision ID: 0045
Revises: 0044
Create Date: 2026-08-17

WHY
---
`orders.status` already moves placed -> accepted -> in_progress -> completed,
but the transitions carried no evidence: setting status = 'completed' recorded
*that* it was done and lost *who* did it and *when*.

That blocks #210 (nurse task queue, "check-off with timestamp") outright, and
it degrades every other fulfilment path — lab, radiology, pharmacy — to the
same guesswork. The information technically survives in audit_logs, but
reconstructing a ward's outstanding tasks by mining an append-only audit chain
is not a query anyone should have to write, and audit_logs is partitioned by
month, so "what is still open" gets slower every month it exists.

WHY COLUMNS ON orders, NOT A SEPARATE nursing_tasks TABLE
---------------------------------------------------------
A nurse checking off a doctor's order is the same state transition that a lab
technician performs when they accept a sample — same row, same status machine,
same question ("what is outstanding on this ward?"). A parallel nursing-only
table would answer that question twice, and the two would disagree the first
time an order was completed through the other path.

The CHECKs make the columns and the status agree: a completed order must carry
who and when, and a completion cannot be recorded without both halves.
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql as pg

revision = "0045"
down_revision = "0044"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("orders", sa.Column("accepted_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("orders", sa.Column(
        "accepted_by", pg.UUID(as_uuid=True),
        sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=True))

    op.add_column("orders", sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("orders", sa.Column(
        "completed_by", pg.UUID(as_uuid=True),
        sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=True))

    #: Free-text note the nurse leaves on check-off ("patient refused", "given
    #: with food"). Optional — an unremarkable completion needs no comment.
    op.add_column("orders", sa.Column("completion_note", sa.Text(), nullable=True))

    # Both halves or neither. A timestamp with no actor cannot be attributed,
    # and an actor with no timestamp cannot be sequenced.
    op.create_check_constraint(
        "ck_orders_accepted_pair", "orders",
        "(accepted_at IS NULL) = (accepted_by IS NULL)")
    op.create_check_constraint(
        "ck_orders_completed_pair", "orders",
        "(completed_at IS NULL) = (completed_by IS NULL)")

    # status and the evidence must agree. Without this, a completed order with
    # no completion row is representable, which is exactly the state #210
    # cannot render.
    op.create_check_constraint(
        "ck_orders_completed_has_evidence", "orders",
        "status <> 'completed' OR completed_at IS NOT NULL")

    # The nurse task queue: everything still open on a ward, newest first.
    op.create_index(
        "ix_orders_status_completed_at", "orders",
        ["status", sa.text("completed_at DESC NULLS FIRST")],
    )


def downgrade() -> None:
    op.drop_index("ix_orders_status_completed_at", table_name="orders")
    op.drop_constraint("ck_orders_completed_has_evidence", "orders", type_="check")
    op.drop_constraint("ck_orders_completed_pair", "orders", type_="check")
    op.drop_constraint("ck_orders_accepted_pair", "orders", type_="check")
    op.drop_column("orders", "completion_note")
    op.drop_column("orders", "completed_by")
    op.drop_column("orders", "completed_at")
    op.drop_column("orders", "accepted_by")
    op.drop_column("orders", "accepted_at")
