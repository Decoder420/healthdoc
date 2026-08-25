"""0052 external results append-only enforcement.

Revision ID: 0052
Revises: 0051
Create Date: 2026-08-25
"""
from alembic import op

revision = "0052"
down_revision = "0051"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE OR REPLACE FUNCTION trg_order_external_results_append_only_fn()
        RETURNS trigger AS $$
        BEGIN
            RAISE EXCEPTION
                'order_external_results is append-only: % not permitted', TG_OP;
        END;
        $$ LANGUAGE plpgsql;
        """
    )
    op.execute(
        """
        CREATE TRIGGER trg_order_external_results_append_only
        BEFORE UPDATE OR DELETE ON order_external_results
        FOR EACH ROW EXECUTE FUNCTION trg_order_external_results_append_only_fn();
        """
    )


def downgrade() -> None:
    op.execute(
        "DROP TRIGGER IF EXISTS trg_order_external_results_append_only "
        "ON order_external_results"
    )
    op.execute("DROP FUNCTION IF EXISTS trg_order_external_results_append_only_fn()")
