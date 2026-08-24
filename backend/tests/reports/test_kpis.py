"""GET /reports/kpis — the module that was a ping stub.

kpi_snapshots has existed since 0025. app/reports/router.py had one route that
returned {"status": "stub"}. The last module in the product with no endpoints.

The test that matters is test_no_snapshots_is_not_the_same_as_zero. A dashboard
that renders "never measured" as "0" tells a hospital its infection rate is nil
when nothing has ever computed it.
"""
import uuid
from datetime import date, timedelta
from decimal import Decimal

import pytest
import sqlalchemy as sa

from app.reports import router as reports_router

pytestmark = pytest.mark.asyncio


class _Caller:
    def __init__(self, facility_id):
        self.facility_id = facility_id
        self.id = uuid.uuid4()
        self.roles = ["admin"]


async def _facility(db) -> uuid.UUID:
    fid = uuid.uuid4()
    await db.execute(sa.text(
        "INSERT INTO facilities (id, code, name, state_code) "
        "VALUES (:id, :c, 'KPI Facility', 'TS')"),
        {"id": fid, "c": f"K{uuid.uuid4().hex[:5].upper()}"})
    await db.flush()
    return fid


async def _snapshot(db, facility_id, *, code, start, end, value,
                    numerator=None, denominator=None):
    await db.execute(sa.text(
        "INSERT INTO kpi_snapshots "
        " (id, facility_id, kpi_code, period_start, period_end, value, numerator, denominator) "
        "VALUES (:id, :f, :c, :s, :e, :v, :n, :d)"),
        {"id": uuid.uuid4(), "f": facility_id, "c": code, "s": start, "e": end,
         "v": value, "n": numerator, "d": denominator})
    await db.flush()


async def test_no_snapshots_is_not_the_same_as_zero(db):
    """The distinction the whole response shape exists for.

    "Nobody has computed this" and "the measured value was zero" are different
    claims, and a chart cannot show the difference. The flag can.
    """
    fid = await _facility(db)

    empty = await reports_router.list_kpis(_Caller(fid), period="monthly", db=db)
    assert empty.items == []
    assert empty.no_snapshots is True

    await _snapshot(db, fid, code="bed_occupancy", start=date.today(),
                    end=date.today(), value=Decimal("0"))

    measured = await reports_router.list_kpis(_Caller(fid), period="monthly", db=db)
    assert len(measured.items) == 1
    assert measured.items[0].value == Decimal("0")
    assert measured.no_snapshots is False, (
        "a measured zero must NOT report as 'never measured'"
    )


async def test_a_snapshot_overlapping_the_window_is_included(db):
    """Overlap, not containment. A monthly snapshot is part of a quarter's
    picture; requiring containment drops it from every window that does not
    align to its boundaries."""
    fid = await _facility(db)
    today = date.today()

    # Starts before the 7-day window and ends inside it.
    await _snapshot(db, fid, code="alos", start=today - timedelta(days=20),
                    end=today - timedelta(days=3), value=Decimal("4.2"))

    result = await reports_router.list_kpis(_Caller(fid), period="weekly", db=db)

    assert [i.kpi_code for i in result.items] == ["alos"]


async def test_a_snapshot_outside_the_window_is_excluded(db):
    fid = await _facility(db)
    today = date.today()
    await _snapshot(db, fid, code="alos", start=today - timedelta(days=400),
                    end=today - timedelta(days=380), value=Decimal("9"))

    result = await reports_router.list_kpis(_Caller(fid), period="weekly", db=db)

    assert result.items == []
    assert result.no_snapshots is True


async def test_numerator_and_denominator_survive(db):
    """"94%" is not reviewable; "47 of 50" is. A rate over a denominator of 3
    looks identical to one over 3,000 until you can see it."""
    fid = await _facility(db)
    await _snapshot(db, fid, code="hand_hygiene", start=date.today(), end=date.today(),
                    value=Decimal("94.0"), numerator=Decimal("47"), denominator=Decimal("50"))

    result = await reports_router.list_kpis(_Caller(fid), period="daily", db=db)

    assert result.items[0].numerator == Decimal("47")
    assert result.items[0].denominator == Decimal("50")


async def test_kpis_are_facility_scoped(db):
    ours, theirs = await _facility(db), await _facility(db)
    await _snapshot(db, theirs, code="bed_occupancy", start=date.today(),
                    end=date.today(), value=Decimal("81"))

    result = await reports_router.list_kpis(_Caller(ours), period="monthly", db=db)

    assert result.items == []
    assert result.no_snapshots is True, (
        "another facility's snapshot must not count as ours"
    )


async def test_explicit_dates_win_over_the_period_shorthand(db):
    fid = await _facility(db)
    today = date.today()
    await _snapshot(db, fid, code="alos", start=today - timedelta(days=200),
                    end=today - timedelta(days=190), value=Decimal("3.1"))

    # 'daily' alone would miss it; explicit dates must take precedence.
    result = await reports_router.list_kpis(
        _Caller(fid), period="daily",
        date_from=today - timedelta(days=365), date_to=today, db=db,
    )

    assert [i.kpi_code for i in result.items] == ["alos"]


async def test_codes_come_from_the_data_not_a_catalogue(db):
    """A hardcoded list would show a hospital metrics nobody computes for it,
    each rendering as an empty chart indistinguishable from a real zero."""
    fid = await _facility(db)
    await _snapshot(db, fid, code="bed_occupancy", start=date.today(),
                    end=date.today(), value=Decimal("77"))
    await _snapshot(db, fid, code="alos", start=date.today(),
                    end=date.today(), value=Decimal("4"))

    codes = await reports_router.list_kpi_codes(_Caller(fid), db=db)

    assert codes["items"] == ["alos", "bed_occupancy"]
