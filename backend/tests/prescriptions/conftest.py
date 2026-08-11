"""Auth overrides for the prescriptions API tests (mirror of tests/radiology/conftest.py)."""
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.auth.deps import AuthUser, DbUser, get_current_db_user, get_current_user
from app.common.db import get_db
from app.main import app
from tests._lab_seed import TEST_DATABASE_URL

DOCTOR = AuthUser(sub=str(uuid.uuid4()), username="doc1", roles=["doctor"])
NURSE = AuthUser(sub=str(uuid.uuid4()), username="nurse1", roles=["nurse"])

TEST_FACILITY_ID = uuid.UUID("00000000-0000-0000-0000-0000000000f1")


def _db_user_for(user: AuthUser) -> DbUser:
    return DbUser(
        id=uuid.uuid5(uuid.NAMESPACE_OID, user.sub),
        keycloak_sub=user.sub,
        username=user.username,
        facility_id=TEST_FACILITY_ID,
        roles=user.roles,
    )


_test_engine = create_async_engine(TEST_DATABASE_URL, poolclass=NullPool)
_TestSession = async_sessionmaker(_test_engine, expire_on_commit=False)


async def _test_get_db():
    async with _TestSession() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


@pytest.fixture
def client_as():
    with TestClient(app) as client:
        def _make(user: AuthUser) -> TestClient:
            app.dependency_overrides[get_current_user] = lambda: user
            app.dependency_overrides[get_current_db_user] = lambda: _db_user_for(user)
            app.dependency_overrides[get_db] = _test_get_db
            return client

        yield _make

    app.dependency_overrides.pop(get_current_user, None)
    app.dependency_overrides.pop(get_current_db_user, None)
    app.dependency_overrides.pop(get_db, None)


@pytest.fixture(scope="session")
def seeded_encounter_and_patient() -> tuple[str, str]:
    """Real encounters.id / patients.id, whole FK chain committed.

    Reuses seed_order_chain (facility -> users -> patient -> visit ->
    encounter -> order) since it already seeds through encounters and is
    idempotent — prescriptions don't need the order row it also creates,
    but that's harmless.
    """
    from tests._lab_seed import ENCOUNTER_ID, PATIENT_ID, seed_order_chain
    seed_order_chain([u.sub for u in (DOCTOR, NURSE)])
    return str(ENCOUNTER_ID), str(PATIENT_ID)
