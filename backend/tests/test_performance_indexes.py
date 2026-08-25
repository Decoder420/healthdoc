"""PostgreSQL catalog gate for the W7 index strategy."""
from __future__ import annotations

import os

import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import NullPool

TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL")
pytestmark = pytest.mark.skipif(
    not TEST_DATABASE_URL,
    reason="TEST_DATABASE_URL is required for catalog inspection",
)


async def test_every_foreign_key_has_a_leading_non_partial_index() -> None:
    engine = create_async_engine(TEST_DATABASE_URL, poolclass=NullPool)
    try:
        async with engine.connect() as connection:
            missing = (await connection.execute(text("""
                SELECT c.conrelid::regclass::text AS table_name, c.conname
                FROM pg_constraint c
                WHERE c.contype = 'f'
                  AND c.conparentid = 0
                  AND NOT EXISTS (
                      SELECT 1 FROM pg_index i
                      WHERE i.indrelid = c.conrelid
                        AND i.indisvalid AND i.indisready AND i.indpred IS NULL
                        AND (
                            SELECT array_agg(attnum::smallint ORDER BY ordinality)
                            FROM unnest(i.indkey) WITH ORDINALITY AS k(attnum, ordinality)
                            WHERE ordinality <= cardinality(c.conkey)
                        ) = c.conkey
                  )
                ORDER BY 1, 2
            """))).all()
        assert missing == [], f"foreign keys without supporting indexes: {missing}"
    finally:
        await engine.dispose()


async def test_named_hot_path_indexes_have_the_required_shapes() -> None:
    required = {
        "ix_visits_patient_id_visit_date": ("patient_id", "visit_date"),
        "ix_orders_order_type_status": ("order_type", "status"),
        "ix_inventory_batches_fefo": ("item_id", "expiry_date", "where", "quantity"),
        "ix_queue_tokens_active": ("queue_id", "priority", "created_at", "where"),
        "uq_lab_results_current": ("unique", "lab_order_item_id", "where", "is_current"),
        "uq_radiology_reports_current": (
            "unique", "radiology_order_item_id", "where", "is_current",
        ),
        "uq_pharmacy_dispenses_current": (
            "unique", "prescription_id", "where", "is_current",
        ),
        "uq_patients_uhid": ("unique", "uhid", "where", "deleted_at"),
        "ix_audit_logs_created_at_brin": ("using brin", "created_at"),
        "ix_data_access_log_accessed_at_brin": ("using brin", "accessed_at"),
        "ix_lab_results_result_data": ("using gin", "jsonb_path_ops"),
        "ix_notification_history_payload": ("using gin", "jsonb_path_ops"),
    }
    engine = create_async_engine(TEST_DATABASE_URL, poolclass=NullPool)
    try:
        async with engine.connect() as connection:
            rows = (await connection.execute(text("""
                SELECT indexname, indexdef FROM pg_indexes
                WHERE schemaname = 'public' AND indexname = ANY(:names)
            """), {"names": list(required)})).all()
        definitions = {name: definition.lower() for name, definition in rows}
        assert definitions.keys() == required.keys()
        for name, fragments in required.items():
            assert all(fragment in definitions[name] for fragment in fragments), name
    finally:
        await engine.dispose()
