"""charge_master admin + effective-dated lookup (#287).

0033 created this table in July and nothing read or wrote it. The behaviours
that matter are the ones that decide what a patient is charged:

  * a price change is a new row; the superseded row is closed, not edited
  * back-dating is refused, because it would change what past invoices resolve to
  * a scheme rate beats the general tariff
  * retiring a tariff never deletes it
"""
from __future__ import annotations

import uuid
from datetime import date, timedelta
from decimal import Decimal

import pytest
import sqlalchemy as sa

from app.billing import service
from app.billing.service import charge_master_t

pytestmark = pytest.mark.asyncio

JAN = date(2026, 1, 1)
JUN = date(2026, 6, 1)


async def _tariff(db, facility_id, actor, **over):
    kwargs = dict(
        facility_id=facility_id, charge_code="CBC", description="Complete Blood Count",
        charge_category="lab", unit_price=Decimal("300.00"), effective_from=JAN,
        created_by=actor,
    )
    kwargs.update(over)
    return await service.create_tariff(db, **kwargs)


@pytest.fixture
def ids(facility, user):
    """Real seeded rows, not bare uuid4()s.

    charge_master.facility_id and created_by are FKs. A generated UUID compiles
    fine and fails at the database, which is only visible once the tests run
    against real Postgres — the conftest already seeds both.
    """
    return facility, user


async def test_lookup_returns_the_row_in_force(db, ids):
    facility_id, actor = ids
    await _tariff(db, facility_id, actor)

    row = await service.charge_for(db, facility_id, "CBC", JUN)
    assert row is not None
    assert row.unit_price == Decimal("300.00")


async def test_lookup_ignores_a_tariff_that_has_not_started(db, ids):
    facility_id, actor = ids
    await _tariff(db, facility_id, actor, effective_from=JUN)

    assert await service.charge_for(db, facility_id, "CBC", JAN) is None


async def test_price_change_supersedes_rather_than_edits(db, ids):
    """The old row must survive with its original price.

    invoice_items.charge_master_id points at it, so rewriting unit_price in
    place would silently change what every already-raised invoice says the
    patient was charged.
    """
    facility_id, actor = ids
    first_id = await _tariff(db, facility_id, actor, unit_price=Decimal("300.00"))
    await _tariff(db, facility_id, actor, unit_price=Decimal("350.00"), effective_from=JUN)

    old = (await db.execute(
        sa.select(charge_master_t).where(charge_master_t.c.id == first_id))).first()
    assert old.unit_price == Decimal("300.00"), "the superseded price must not be rewritten"
    assert old.effective_to == JUN - timedelta(days=1), "and it must be closed, not left open"

    # Each date resolves to the price that was in force on it.
    assert (await service.charge_for(db, facility_id, "CBC", date(2026, 5, 31))).unit_price == Decimal("300.00")
    assert (await service.charge_for(db, facility_id, "CBC", JUN)).unit_price == Decimal("350.00")


async def test_backdating_a_price_change_is_refused(db, ids):
    facility_id, actor = ids
    await _tariff(db, facility_id, actor, effective_from=JUN)

    with pytest.raises(service.TariffOverlap):
        await _tariff(db, facility_id, actor, unit_price=Decimal("1.00"), effective_from=JAN)


async def test_scheme_rate_wins_over_the_general_tariff(db, ids):
    """Billing a PMJAY patient at the self-pay rate is a reimbursement dispute."""
    facility_id, actor = ids
    await _tariff(db, facility_id, actor, unit_price=Decimal("300.00"))
    await _tariff(db, facility_id, actor, unit_price=Decimal("210.00"), scheme_code="PMJAY")

    general = await service.charge_for(db, facility_id, "CBC", JUN)
    assert general.unit_price == Decimal("300.00")

    scheme = await service.charge_for(db, facility_id, "CBC", JUN, scheme_code="PMJAY")
    assert scheme.unit_price == Decimal("210.00")
    assert scheme.scheme_code == "PMJAY"


async def test_unknown_scheme_falls_back_to_the_general_tariff(db, ids):
    facility_id, actor = ids
    await _tariff(db, facility_id, actor, unit_price=Decimal("300.00"))

    row = await service.charge_for(db, facility_id, "CBC", JUN, scheme_code="CGHS")
    assert row.unit_price == Decimal("300.00"), "no CGHS rate configured — self-pay applies"


async def test_a_scheme_tariff_does_not_leak_into_another_scheme(db, ids):
    facility_id, actor = ids
    await _tariff(db, facility_id, actor, unit_price=Decimal("210.00"), scheme_code="PMJAY")

    # No general row exists, so a CGHS patient has no tariff at all rather than
    # silently getting the PMJAY rate.
    assert await service.charge_for(db, facility_id, "CBC", JUN, scheme_code="CGHS") is None


async def test_tariffs_are_scoped_to_their_facility(db, ids):
    facility_id, actor = ids
    other_facility = uuid.uuid4()
    await _tariff(db, facility_id, actor)

    assert await service.charge_for(db, other_facility, "CBC", JUN) is None


async def test_deactivate_retires_without_deleting(db, ids):
    facility_id, actor = ids
    tariff_id = await _tariff(db, facility_id, actor)

    assert await service.deactivate_tariff(db, tariff_id, updated_by=actor) is True
    assert await service.charge_for(db, facility_id, "CBC", JUN) is None

    row = (await db.execute(
        sa.select(charge_master_t).where(charge_master_t.c.id == tariff_id))).first()
    assert row is not None, "the row must survive — invoice lines point at it"
    assert row.is_active is False


async def test_deactivating_twice_reports_no_change(db, ids):
    facility_id, actor = ids
    tariff_id = await _tariff(db, facility_id, actor)
    await service.deactivate_tariff(db, tariff_id, updated_by=actor)

    assert await service.deactivate_tariff(db, tariff_id, updated_by=actor) is False


async def test_listing_hides_retired_rows_unless_asked(db, ids):
    facility_id, actor = ids
    tariff_id = await _tariff(db, facility_id, actor)
    await service.deactivate_tariff(db, tariff_id, updated_by=actor)

    assert await service.list_charge_master(db, facility_id) == []
    assert len(await service.list_charge_master(db, facility_id, active_only=False)) == 1
