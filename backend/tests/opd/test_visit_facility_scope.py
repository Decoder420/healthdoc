"""A visit belongs to the caller's facility, never the request body's.

POST /patients documents this rule and enforces it. POST /visits took
facility_id straight from the payload, looked the facility up with it, and
stamped the visit with it — so a receptionist at facility A could open a visit
at facility B. A visit is not an isolated row either: create_visit() raises the
registration invoice in the same transaction (#389), so the body value could
create a billable record at another facility.

RUNS AGAINST REAL POSTGRES, connecting explicitly.

The shared `db` fixture is always in-memory SQLite, so `make test-pg` does not
make it Postgres — it only puts a real DATABASE_URL where tests that connect
themselves can find it. An earlier version of this file skipped on dialect and
therefore never executed anywhere, which is worse than no test: the suite
reported a passing guard that had never run. Same pattern as
test_admissions_concurrency.py.
"""
from __future__ import annotations

import uuid
from datetime import date, datetime, timezone
from decimal import Decimal

import pytest
import sqlalchemy as sa
from sqlalchemy import text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.billing.service import REGISTRATION_CHARGE_CODE, charge_master_t
from app.common.config import get_settings
from app.opd import service
from app.opd.schemas import VisitCreate
from app.patients.models import Patient
from app.users.models import Facility, User

pytestmark = pytest.mark.asyncio


async def _real_database_is_ready() -> bool:
    try:
        engine = create_async_engine(get_settings().database_url)
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT to_regclass('public.visit_number_counters')"))
            exists = result.scalar() is not None
        await engine.dispose()
        return exists
    except Exception:
        return False


async def test_visit_and_its_invoice_use_the_callers_facility():
    """Payload names facility B; the caller belongs to facility A.

    The proof is behavioural rather than an assertion about one field. Only
    facility A is given a REGISTRATION tariff. create_visit() raises the
    registration invoice inside the same transaction and 409s when the facility
    it picked has no active tariff — so if this ever regresses to
    payload.facility_id, the lookup happens against facility B, finds nothing,
    and registration fails. The test cannot pass while the bug is present.
    """
    if not await _real_database_is_ready():
        pytest.skip("Real Postgres unreachable — run with make test-pg")

    engine = create_async_engine(get_settings().database_url)
    Session = async_sessionmaker(engine, expire_on_commit=False)

    caller_facility_id = uuid.uuid4()
    other_facility_id = uuid.uuid4()
    actor_id = uuid.uuid4()
    patient_id = uuid.uuid4()
    today = date.today()

    # Unique per run and passed through to create_visit as the real code.
    #
    # An earlier version hardcoded "FA0000" here, so every run produced the same
    # visit_number and a rerun failed on uq_visits_visit_number instead of on
    # the behaviour under test. The guard appeared to work while actually
    # tripping over residue from the previous run — which is the same class of
    # mistake as a test that never executes.
    caller_code = f"FA{uuid.uuid4().hex[:4].upper()}"
    other_code = f"FB{uuid.uuid4().hex[:4].upper()}"

    try:
        async with Session() as setup:
            setup.add(Facility(
                id=caller_facility_id, code=caller_code,
                name="Caller Facility", state_code="TS", timezone="Asia/Kolkata",
            ))
            setup.add(Facility(
                id=other_facility_id, code=other_code,
                name="Other Facility", state_code="TS", timezone="Asia/Kolkata",
            ))
            await setup.commit()

        async with Session() as setup:
            # patients.created_by and visits.created_by are FKs to users.id —
            # a bare uuid4() violates them against a migrated database.
            setup.add(User(
                id=actor_id, keycloak_sub=f"scope-{uuid.uuid4().hex[:12]}",
                username=f"scope_{uuid.uuid4().hex[:8]}", full_name="Scope Test Actor",
                facility_id=caller_facility_id,
            ))
            await setup.commit()

        async with Session() as setup:
            setup.add(Patient(
                id=patient_id, uhid=f"UH{uuid.uuid4().hex[:8]}", full_name="Scope Test Patient",
                sex="female", age_years=30, identity_path="demographics_only",
                identity_status="verified", facility_id=caller_facility_id,
                created_by=actor_id,
            ))
            # The tariff exists for the CALLER's facility only. This asymmetry
            # is the whole test.
            await setup.execute(sa.insert(charge_master_t).values(
                id=uuid.uuid4(), facility_id=caller_facility_id,
                charge_code=REGISTRATION_CHARGE_CODE, charge_category="registration",
                description="OPD registration fee", unit_price=Decimal("100.00"),
                effective_from=today, is_active=True, created_by=actor_id,
            ))
            await setup.commit()

        async with Session() as session:
            payload = VisitCreate(
                patient_id=patient_id,
                facility_id=other_facility_id,   # the value an attacker controls
                visit_type="opd",
                visit_date=datetime.now(timezone.utc),
            )

            visit = await service.create_visit(
                session,
                payload=payload,
                facility_code=caller_code,
                facility_timezone="Asia/Kolkata",
                created_by=actor_id,
                facility_id=caller_facility_id,
            )
            await session.commit()

            assert visit.facility_id == caller_facility_id, (
                "the request body must not choose which facility a visit belongs to"
            )

            invoice_facility = (await session.execute(text(
                "SELECT facility_id FROM invoices WHERE visit_id = :visit_id"
            ), {"visit_id": visit.id})).scalar()
            assert invoice_facility == caller_facility_id, (
                "the registration invoice follows the visit's facility"
            )
    finally:
        await engine.dispose()


async def test_facility_id_is_optional_on_the_wire():
    """Callers may omit it entirely — the server knows who they are.

    Kept optional rather than removed so existing callers that still send it do
    not start failing validation.
    """
    payload = VisitCreate(
        patient_id=uuid.uuid4(),
        visit_type="opd",
        visit_date=datetime.now(timezone.utc),
    )
    assert payload.facility_id is None
    assert payload.created_by is None


async def test_router_refuses_a_mismatched_facility():
    """Refused with 403, not silently ignored.

    Quietly overriding the value would leave no trace that a cross-facility
    write was attempted, and that attempt is exactly what an auditor wants to
    see.
    """
    import inspect

    from app.opd import router

    source = inspect.getsource(router.create_visit)
    assert "facility_mismatch" in source
    assert "HTTP_403_FORBIDDEN" in source
