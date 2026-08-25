"""Two facilities placing orders on the same day must not collide.

`orders.order_number` carries uq_orders_order_number — a GLOBAL unique
constraint (0008). The allocator's counter is per (facility_id, counter_date).
Those two facts are only compatible if the formatted string distinguishes
facilities, and it did not: the format was ORD-<YYYYMMDD>-<SEQ6>.

So every facility independently allocated seq=1 each morning and formatted the
identical "ORD-20260823-000001". The second facility to place an order on any
given day got a UniqueViolation — one hospital's first order of every day
failing, permanently, in a multi-tenant deployment.

app/opd/visit_number.py does the same job correctly:
VST-<FACILITYCODE>-<YYYYMMDD>-<SEQ5>. The facility code is what makes a
per-facility counter safe under a global unique index.

Why the suite never caught it: tests/_lab_seed.py inserts its order with the
literal 'ORD-LABTEST-0001', so only the OPD journey ever exercised the real
allocator — from one facility. The collision needs two.
"""
from __future__ import annotations

from datetime import date

import pytest

from app.orders import order_number



def test_the_number_embeds_the_facility_code():
    """The regression guard, stated on the formatter alone.

    Deliberately not a DB test: the collision is a property of the string, and
    asserting it here means the guard runs in the default SQLite suite too,
    where a global unique constraint on a real table would not be exercised.
    """
    a = order_number.format_order_number("JPR001", date(2026, 8, 23), 1)
    b = order_number.format_order_number("DEL002", date(2026, 8, 23), 1)

    assert a != b, (
        "two facilities allocating seq=1 on the same date must not produce the "
        "same order_number — uq_orders_order_number is global"
    )
    assert a == "ORD-JPR001-20260823-000001"
    assert b == "ORD-DEL002-20260823-000001"


def test_the_number_still_fits_the_column():
    """orders.order_number is String(30) (0008). The longest realistic facility
    code in the schema is String(20), but a 6-char code is the live shape —
    assert the realistic case fits and flag the ceiling."""
    formatted = order_number.format_order_number("JPR001", date(2026, 12, 31), 999999)

    assert len(formatted) == 26
    assert len(formatted) <= 30


def test_facility_code_is_required_not_defaulted():
    """A default would let a caller silently reintroduce the collision, and it
    would only surface once a second facility went live."""
    with pytest.raises(TypeError):
        order_number.format_order_number(date(2026, 8, 23), 1)  # type: ignore[arg-type,call-arg]
