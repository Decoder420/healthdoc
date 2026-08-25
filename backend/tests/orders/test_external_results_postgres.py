"""PostgreSQL proof that outside-result history cannot be rewritten."""
from __future__ import annotations

import os
import uuid

import pytest
import pytest_asyncio
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL")
pytestmark = pytest.mark.skipif(
    not TEST_DATABASE_URL,
    reason="TEST_DATABASE_URL is required for the PostgreSQL trigger proof",
)


@pytest_asyncio.fixture
async def pg_session():
    if not TEST_DATABASE_URL:
        pytest.skip("TEST_DATABASE_URL is required")
    engine = create_async_engine(TEST_DATABASE_URL, pool_pre_ping=True)
    session_factory = async_sessionmaker(
        engine, expire_on_commit=False, class_=AsyncSession
    )
    async with session_factory() as session:
        yield session
        await session.rollback()
    await engine.dispose()


async def _seed_external_result(db: AsyncSession) -> uuid.UUID:
    facility_id = uuid.uuid4()
    department_id = uuid.uuid4()
    user_id = uuid.uuid4()
    patient_id = uuid.uuid4()
    visit_id = uuid.uuid4()
    encounter_id = uuid.uuid4()
    order_id = uuid.uuid4()
    result_id = uuid.uuid4()

    await db.execute(
        text(
            "INSERT INTO facilities (id, code, name, state_code) "
            "VALUES (:id, :code, 'External Result Trigger', 'TS')"
        ),
        {"id": facility_id, "code": f"ER{uuid.uuid4().hex[:8]}"},
    )
    await db.execute(
        text(
            "INSERT INTO departments (id, facility_id, code, name) "
            "VALUES (:id, :facility, :code, 'External Referrals')"
        ),
        {
            "id": department_id,
            "facility": facility_id,
            "code": f"ER{uuid.uuid4().hex[:6]}",
        },
    )
    await db.execute(
        text(
            "INSERT INTO users (id, keycloak_sub, username, full_name, facility_id) "
            "VALUES (:id, :sub, :username, 'External Result User', :facility)"
        ),
        {
            "id": user_id,
            "sub": f"external-result-{user_id}",
            "username": f"external-{uuid.uuid4().hex[:8]}",
            "facility": facility_id,
        },
    )
    await db.execute(
        text(
            "INSERT INTO patients "
            "(id, uhid, full_name, sex, age_years, identity_path, facility_id, created_by) "
            "VALUES (:id, :uhid, 'External Result Patient', 'other', 30, "
            "'demographics_only', :facility, :actor)"
        ),
        {
            "id": patient_id,
            "uhid": f"UH{uuid.uuid4().hex[:10]}",
            "facility": facility_id,
            "actor": user_id,
        },
    )
    await db.execute(
        text(
            "INSERT INTO visits "
            "(id, visit_number, patient_id, facility_id, department_id, visit_type, "
            "visit_date, created_by) VALUES (:id, :number, :patient, :facility, "
            ":department, 'opd', now(), :actor)"
        ),
        {
            "id": visit_id,
            "number": f"EV-{uuid.uuid4().hex[:10]}",
            "patient": patient_id,
            "facility": facility_id,
            "department": department_id,
            "actor": user_id,
        },
    )
    await db.execute(
        text(
            "INSERT INTO encounters "
            "(id, visit_id, facility_id, provider_user_id, encounter_type, created_by) "
            "VALUES (:id, :visit, :facility, :actor, 'consultation', :actor)"
        ),
        {
            "id": encounter_id,
            "visit": visit_id,
            "facility": facility_id,
            "actor": user_id,
        },
    )
    await db.execute(
        text(
            "INSERT INTO orders "
            "(id, order_number, encounter_id, facility_id, patient_id, order_type, "
            "priority, status, ordered_at, created_by, fulfilment_mode) VALUES "
            "(:id, :number, :encounter, :facility, :patient, 'lab', 'routine', "
            "'placed', now(), :actor, 'external_referral')"
        ),
        {
            "id": order_id,
            "number": f"ORD-TRIGGER-{uuid.uuid4().hex[:10]}",
            "encounter": encounter_id,
            "facility": facility_id,
            "patient": patient_id,
            "actor": user_id,
        },
    )
    await db.execute(
        text(
            "INSERT INTO order_external_results "
            "(id, order_id, summary, recorded_by) "
            "VALUES (:id, :order, 'Original outside report', :actor)"
        ),
        {"id": result_id, "order": order_id, "actor": user_id},
    )
    await db.flush()
    return result_id


async def test_external_results_trigger_blocks_update_and_delete(pg_session):
    result_id = await _seed_external_result(pg_session)

    with pytest.raises(DBAPIError, match="order_external_results is append-only"):
        async with pg_session.begin_nested():
            await pg_session.execute(
                text(
                    "UPDATE order_external_results SET summary = 'rewritten' WHERE id = :id"
                ),
                {"id": result_id},
            )

    with pytest.raises(DBAPIError, match="order_external_results is append-only"):
        async with pg_session.begin_nested():
            await pg_session.execute(
                text("DELETE FROM order_external_results WHERE id = :id"),
                {"id": result_id},
            )
