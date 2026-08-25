"""backend/app/orders/order_number.py -- race-safe allocator:
ORD-<FACILITYCODE>-<YYYYMMDD>-<SEQ6>.

Same atomic INSERT ... ON CONFLICT pattern as app/opd/visit_number.py.

THE FACILITY CODE IS LOAD-BEARING, NOT DECORATION.

This module used to emit ORD-<YYYYMMDD>-<SEQ6>, with a note explaining that
the counter is scoped by facility_id "even though the number string itself
doesn't embed a facility code, to avoid cross-facility contention". The
contention reasoning was right; the consequence was missed.

`orders.order_number` carries uq_orders_order_number, a GLOBAL unique
constraint (0008). The counter is per (facility_id, counter_date). So on any
given business date, every facility independently allocates seq=1 and formats
the identical string — and the second facility to place an order that day gets
a UniqueViolation. In a multi-tenant deployment that is one hospital's first
order of every day failing, permanently.

app/opd/visit_number.py, written for the same job, embeds the facility code:
VST-<FACILITYCODE>-<YYYYMMDD>-<SEQ5>. That is what makes a per-facility counter
safe under a global unique index, and it is the shape copied here.

Existing rows keep their old format. No migration is needed: order_number is a
generated string, not a parsed key, and String(30) already fits
"ORD-JPR001-20260823-000001" (26 chars).
"""
from datetime import date
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def next_order_sequence(db: AsyncSession, facility_id: UUID, business_date: date) -> int:
    result = await db.execute(
        text(
            "INSERT INTO order_number_counters (facility_id, counter_date, seq) "
            "VALUES (:facility_id, :d, 1) "
            "ON CONFLICT (facility_id, counter_date) DO UPDATE "
            "SET seq = order_number_counters.seq + 1 "
            "RETURNING seq"
        ),
        {"facility_id": str(facility_id), "d": business_date},
    )
    return result.scalar_one()


def format_order_number(facility_code: str, business_date: date, seq: int) -> str:
    """ORD-<FACILITYCODE>-<YYYYMMDD>-<SEQ6>.

    facility_code is required, not optional with a default: a default would let
    a caller silently reintroduce the collision this parameter exists to
    prevent, and the failure would only appear once a second facility went live.
    """
    return f"ORD-{facility_code}-{business_date:%Y%m%d}-{seq:06d}"
