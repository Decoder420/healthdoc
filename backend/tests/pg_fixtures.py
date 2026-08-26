"""A generic PostgreSQL session fixture, shared by the suites that need one.

Most tests use the shared in-memory SQLite `db` fixture in tests/conftest.py.
Some cannot, and the reasons are always the same two:

  * a PostgreSQL-only column type that SQLite can render but not bind —
    ARRAY(Text) on user_account_requests.requested_roles, JSONB on
    facility_modules.config;
  * a constraint or trigger that exists only in a migration, so it is absent
    from the ORM-built SQLite schema — ck_user_account_requests_requester_ne_approver,
    the facility_modules module_code CHECK.

Testing either of those against SQLite proves nothing about what ships. This is
the same blind spot that hid the queue-token index bug for weeks.

Import into a package conftest with:

    from tests.pg_fixtures import db, engine  # noqa: F401

Session shape matches tests/billing/conftest.py: function-scoped engine, one
session per test inside an outer transaction rolled back on teardown, so tests
need no cleanup and can run in any order.
"""
import os

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

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
async def engine():
    # The skip belongs in the fixture: a `pytestmark` in a CONFTEST applies
    # to the conftest, not to the modules beside it. See pharmacy/conftest.py.
    if not TEST_DATABASE_URL:
        pytest.skip("needs real PostgreSQL — run `make test-pg` from the repo root")
    eng = create_async_engine(TEST_DATABASE_URL, pool_pre_ping=True)
    yield eng
    await eng.dispose()


@pytest_asyncio.fixture
async def db(engine) -> AsyncSession:
    connection = await engine.connect()
    outer_tx = await connection.begin()
    session_factory = async_sessionmaker(
        bind=connection, expire_on_commit=False, join_transaction_mode="create_savepoint"
    )
    session = session_factory()
    try:
        yield session
    finally:
        await session.close()
        await outer_tx.rollback()
        await connection.close()
