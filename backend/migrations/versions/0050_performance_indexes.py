"""0050 performance indexes — close the W7 catalog review.

Revision ID: 0050
Revises: 0049
Create Date: 2026-08-24

PostgreSQL does not index foreign-key columns automatically.  The release
catalog audit found 95 parent constraints without a complete, non-partial
leading index.  That makes parent updates/deletes scan child tables and leaves
common joins dependent on sequential scans.  Build only the missing indexes;
existing primary, unique and composite indexes remain untouched.
"""
from __future__ import annotations

import hashlib

import sqlalchemy as sa
from alembic import op

revision = "0050"
down_revision = "0049"
branch_labels = None
depends_on = None


_MISSING_FK_INDEXES = sa.text("""
    SELECT n.nspname AS schema_name,
           t.relname AS table_name,
           array_agg(a.attname ORDER BY key.ordinality) AS column_names
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    JOIN LATERAL unnest(c.conkey) WITH ORDINALITY AS key(attnum, ordinality)
      ON true
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = key.attnum
    WHERE c.contype = 'f'
      AND c.conparentid = 0
      AND n.nspname = 'public'
      AND NOT EXISTS (
          SELECT 1
          FROM pg_index i
          WHERE i.indrelid = c.conrelid
            AND i.indisvalid
            AND i.indisready
            AND i.indpred IS NULL
            AND (
                SELECT array_agg(attnum::smallint ORDER BY ordinality)
                FROM unnest(i.indkey) WITH ORDINALITY AS ik(attnum, ordinality)
                WHERE ordinality <= cardinality(c.conkey)
            ) = c.conkey
      )
    GROUP BY n.nspname, t.relname, c.oid
    ORDER BY n.nspname, t.relname
""")


def _index_name(table_name: str, column_names: list[str]) -> str:
    raw = f"ix_fk_0050_{table_name}_{'_'.join(column_names)}"
    if len(raw) <= 63:
        return raw
    digest = hashlib.sha1(raw.encode(), usedforsecurity=False).hexdigest()[:8]
    return f"{raw[:54]}_{digest}"


def upgrade() -> None:
    bind = op.get_bind()
    for row in bind.execute(_MISSING_FK_INDEXES).mappings():
        columns = list(row["column_names"])
        op.create_index(
            _index_name(row["table_name"], columns),
            row["table_name"],
            columns,
            schema=row["schema_name"],
        )

    # The schema strategy requires a path-ops GIN index for structured lab
    # result queries. notification_history already has the equivalent index;
    # lab_results was the one named requirement absent from the catalog.
    op.create_index(
        "ix_lab_results_result_data",
        "lab_results",
        ["result_data"],
        postgresql_using="gin",
        postgresql_ops={"result_data": "jsonb_path_ops"},
    )


def downgrade() -> None:
    op.drop_index("ix_lab_results_result_data", table_name="lab_results")

    # Recompute names from the constraints, not from whether an index is now
    # missing (after upgrade none are). IF EXISTS leaves pre-existing indexes,
    # whose names do not carry this migration's reserved prefix, untouched.
    bind = op.get_bind()
    constraints = bind.execute(sa.text("""
        SELECT n.nspname AS schema_name,
               t.relname AS table_name,
               array_agg(a.attname ORDER BY key.ordinality) AS column_names
        FROM pg_constraint c
        JOIN pg_class t ON t.oid = c.conrelid
        JOIN pg_namespace n ON n.oid = t.relnamespace
        JOIN LATERAL unnest(c.conkey) WITH ORDINALITY AS key(attnum, ordinality)
          ON true
        JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = key.attnum
        WHERE c.contype = 'f' AND c.conparentid = 0 AND n.nspname = 'public'
        GROUP BY n.nspname, t.relname, c.oid
    """)).mappings()
    for row in constraints:
        name = _index_name(row["table_name"], list(row["column_names"]))
        op.execute(sa.text(f'DROP INDEX IF EXISTS "{row["schema_name"]}"."{name}"'))
