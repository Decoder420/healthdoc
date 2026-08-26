"""
Shared fixtures for backend/tests/dpdp/.

Repo path: backend/tests/dpdp/conftest.py

Mirrors backend/tests/consent/conftest.py's conventions (TEST_DATABASE_URL,
function-scoped `engine`, WindowsSelectorEventLoopPolicy, no-teardown-delete
for FK-RESTRICT rows). Migration 0022a's own dependencies (facilities,
users, patients, consent_records) are all merged; `alembic upgrade head`
(or the equivalent bootstrap) is assumed already run against
TEST_DATABASE_URL for those, same assumption tests/audit and tests/consent
make. down_revision = "0022" (order_number_counters) may itself still be
mid-flight -- that's a chain-position concern for the real alembic CLI,
not for these tests, which apply 0022a's upgrade()/downgrade() directly.
"""
from __future__ import annotations

import asyncio
import os
import sys
import uuid
from collections.abc import AsyncGenerator

import pytest
import pytest_asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())  # pyright: ignore[reportDeprecated]

TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL")

#: Unset means ABSTAIN, not "try localhost and fail".
#:
#: This used to default to a hardcoded localhost URL. Every runner that
#: matters sets the variable — ci.yml line 91 and the Makefile's test-pg —
#: so the fallback never once pointed at a real database. What it did do was
#: guarantee a connection ATTEMPT from inside the backend container, where
#: localhost is the container: 221 errors that looked like a broken suite and
#: were only a missing environment. The two hardcoded defaults across these
#: files did not even agree on credentials.
#:
#: Matches tests/pharmacy/conftest.py, which had this right already.


@pytest_asyncio.fixture
async def engine() -> AsyncGenerator[AsyncEngine, None]:
    """Function-scoped -- see tests/audit/conftest.py's docstring for why."""
    # The skip belongs in the fixture: a `pytestmark` in a CONFTEST applies
    # to the conftest, not to the modules beside it. See pharmacy/conftest.py.
    if not TEST_DATABASE_URL:
        pytest.skip("needs real PostgreSQL — run `make test-pg` from the repo root")
    eng = create_async_engine(TEST_DATABASE_URL, pool_pre_ping=True)
    yield eng
    await eng.dispose()


@pytest.fixture
def session_factory(engine: AsyncEngine):
    return async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


@pytest_asyncio.fixture
async def facility_id(engine: AsyncEngine) -> AsyncGenerator[uuid.UUID, None]:
    fid = uuid.uuid4()
    async with engine.begin() as conn:
        await conn.execute(
            text(
                """
                INSERT INTO facilities (id, code, name, state_code)
                VALUES (:id, :code, 'DPDP Test Facility', 'RJ')
                """
            ),
            {"id": fid, "code": f"DPDP{uuid.uuid4().hex[:6]}"},
        )
    yield fid
    # No delete -- see tests/audit/conftest.py's facility_id docstring.


@pytest_asyncio.fixture
async def user_id(engine: AsyncEngine, facility_id: uuid.UUID) -> AsyncGenerator[uuid.UUID, None]:
    uid = uuid.uuid4()
    sub = f"dpdp-test-{uid}"
    async with engine.begin() as conn:
        await conn.execute(
            text(
                """
                INSERT INTO users (id, keycloak_sub, username, full_name, facility_id)
                VALUES (:id, :sub, :sub, 'DPDP Test User', :facility_id)
                """
            ),
            {"id": uid, "sub": sub, "facility_id": facility_id},
        )
    yield uid


@pytest_asyncio.fixture
async def patient_id(engine: AsyncEngine, facility_id: uuid.UUID, user_id: uuid.UUID) -> AsyncGenerator[uuid.UUID, None]:
    pid = uuid.uuid4()
    async with engine.begin() as conn:
        await conn.execute(
            text(
                "INSERT INTO patients (id, full_name, sex, identity_path, facility_id, "
                "created_by, age_years, uhid) "
                "VALUES (:id, 'DPDP Test Patient', 'other', 'demographics_only', :facility_id, "
                ":created_by, 30, :uhid)"
            ),
            {"id": pid, "facility_id": facility_id, "created_by": user_id, "uhid": f"UHID{pid.hex[:8]}"},
        )
    yield pid
