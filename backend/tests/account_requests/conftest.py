"""PostgreSQL fixtures for the maker-checker account-request suite.

WHY NOT THE SHARED SQLite `db` FIXTURE:
`user_account_requests.requested_roles` is ARRAY(Text). tests/conftest.py
registers a @compiles hook that renders ARRAY as TEXT so the DDL compiles on
SQLite, and its docstring is explicit about the limit — "TEXT is only good
enough to make the DDL render; nothing here reads or writes that column. If a
test ever needs real array semantics it belongs on Postgres". Binding a Python
list still fails at runtime with "unsupported type", which is exactly what
happened when these tests were first written against the shared fixture.

This suite also leans on ck_user_account_requests_requester_ne_approver, a real
CHECK constraint that does not exist in the ORM-built SQLite schema at all.

Same engine/session shape as tests/billing/conftest.py: function-scoped engine,
one session per test inside an outer transaction that is rolled back on
teardown, so tests need no cleanup and can run in any order.
"""
import os

import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql+asyncpg://healthdoc:change-me@localhost:5432/healthdoc_test",
)


@pytest_asyncio.fixture
async def engine():
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
