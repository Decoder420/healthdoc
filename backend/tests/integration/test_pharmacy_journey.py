"""tests/integration/test_pharmacy_journey.py

Integration test for the Pharmacy journey (#243, journey 5 of 5):

    prescription -> dispense -> stock ledger -> reorder alert

REWRITTEN against the real app/pharmacy/router.py and schemas.py (previous
version guessed paths that didn't exist - e.g. there is no
/pharmacy/stock-ledger GET endpoint at all).

CONFIRMED from router.py + schemas.py directly:
  - POST /api/v1/pharmacy/dispenses          role: pharmacist, requires
    Idempotency-Key. Body: DispenseCreate{prescription_id,
    items: [DispenseItemCreate{prescription_item_id, quantity_dispensed,
    batch_id?, ...}], allow_partial}. Response: DispenseOut{id,
    prescription_id, visit_id, status, dispensed_by, version, is_current,
    created_at, items: [DispenseItemOut{...}]}.
  - GET /api/v1/pharmacy/inventory/reorder-alerts   role: pharmacist|admin|hod.
    Response: ReorderAlertsResponse{items: [ReorderAlertItem{item_id,
    item_name, reorder_level, current_stock}]}.
  - There is NO stock-ledger GET endpoint anywhere in router.py. "stock
    ledger" in the journey name refers to the stock_ledger TABLE, checked
    directly here (same pattern as the Lab journey checking
    NotificationHistory directly - there's no GET for that either).

CONFIRMED table columns (from app/pharmacy/service.py's get_reorder_alerts/
issue_indent/approve_adjustment, pasted earlier in this session - NOT
guessed):
  - inventory_items: id, name, reorder_level, is_active
  - inventory_batches: id, item_id, stock_location_id, quantity,
    batch_number, expiry_date, issue_rate_mrp (batch_number/expiry_date/
    issue_rate_mrp from schemas.py's BatchAvailability)
  - stock_locations: id, facility_id
  - stock_ledger: id, item_id, batch_id, transaction_type, quantity,
    reference_type, reference_id, performed_by, reason (nullable)

STILL GENUINELY UNCONFIRMED - flagged, not silently guessed:

1. prescriptions / prescription_items table shape. Migration
   0008_orders_prescriptions created these tables per the alembic log
   from this session, but neither that migration file nor
   app/prescriptions/models.py has been seen. _seed_prescription() below
   guesses columns from PrescriptionQueueItem's fields (encounter_id,
   patient_id, visit_id, prescribed_at) plus repo-wide conventions
   (created_by, facility_id). If wrong, this fails at the INSERT, not the
   HTTP layer - check migrations/versions/0008_orders_prescriptions.py
   before assuming create_dispense is broken.

2. Whether create_dispense (app/pharmacy/service.py's actual body - not
   shown, only router.py/schemas.py were provided) decrements
   inventory_batches.quantity and writes a stock_ledger row at all. The
   router and schemas confirm the REQUEST/RESPONSE shape; they say
   nothing about what create_dispense does internally. This test asserts
   both effects happen - if service.py's create_dispense doesn't do this
   yet, that is itself a real, worth-reporting finding (same category as
   the Lab critical-alert bug and the Billing idempotency bug already
   found this session), not a test-writing mistake.

Left as a single xfail until #1 is confirmed against the real migration/
model file - remove the xfail once that's checked and either the test
passes or #2 turns up a real bug worth its own xfail reason (same
pattern already used for Lab and Billing).
"""
from __future__ import annotations

import uuid
from decimal import Decimal

import pytest
import sqlalchemy as sa
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.auth.deps import AuthUser
from tests._lab_seed import TEST_DATABASE_URL
from tests.integration.conftest import TEST_FACILITY_ID, seeded_patient_id  # noqa: F401

# Not yet in tests/integration/conftest.py's ALL_TEST_USERS - move there
# once the "pharmacist" role name is confirmed against the real Keycloak
# realm role list (same caution billing/router.py's own docstring raises
# about "receptionist" not being a confirmed realm role either).
PHARMACIST = AuthUser(sub="pharmj-sub-pharmacist-0001", username="pharmj-pharmacist1", roles=["pharmacist"])

ITEM_ID = uuid.UUID("00000000-0000-0000-0000-0000000000d1")
BATCH_ID = uuid.UUID("00000000-0000-0000-0000-0000000000d2")
STOCK_LOCATION_ID = uuid.UUID("00000000-0000-0000-0000-0000000000d3")
PRESCRIPTION_ID = uuid.UUID("00000000-0000-0000-0000-0000000000d4")
PRESCRIPTION_ITEM_ID = uuid.UUID("00000000-0000-0000-0000-0000000000d5")
ENCOUNTER_ID = uuid.UUID("00000000-0000-0000-0000-0000000000d6")

DRUG_NAME = "Paracetamol 500mg"
SEEDED_QUANTITY = Decimal("10")   # above reorder_level - not alerting yet
REORDER_LEVEL = Decimal("5")      # dispensing all 10 should cross this


def _session_factory():
    engine = create_async_engine(TEST_DATABASE_URL)
    return engine, async_sessionmaker(engine, expire_on_commit=False)


async def _seed_inventory(db, *, facility_id) -> None:
    """CONFIRMED columns - see module docstring."""
    await db.execute(sa.text(
        "INSERT INTO stock_locations (id, facility_id, name) VALUES (:id, :fac, :name) "
        "ON CONFLICT (id) DO NOTHING"
    ), {"id": STOCK_LOCATION_ID, "fac": facility_id, "name": "Pharmacy Journey Test Store"})

    await db.execute(sa.text(
        "INSERT INTO inventory_items (id, name, reorder_level, is_active) "
        "VALUES (:id, :name, :level, true) ON CONFLICT (id) DO NOTHING"
    ), {"id": ITEM_ID, "name": DRUG_NAME, "level": REORDER_LEVEL})

    await db.execute(sa.text(
        "INSERT INTO inventory_batches "
        "(id, item_id, stock_location_id, quantity, batch_number, expiry_date, issue_rate_mrp) "
        "VALUES (:id, :item, :loc, :qty, 'PHARMJRN-B1', CURRENT_DATE + INTERVAL '1 year', 5.00) "
        "ON CONFLICT (id) DO UPDATE SET quantity = :qty"
    ), {"id": BATCH_ID, "item": ITEM_ID, "loc": STOCK_LOCATION_ID, "qty": SEEDED_QUANTITY})


async def _seed_prescription(db, *, patient_id: str, facility_id, prescribed_by) -> None:
    """UNCONFIRMED table shape - see assumption #1 in module docstring.
    Check migrations/versions/0008_orders_prescriptions.py before trusting this."""
    await db.execute(sa.text(
        "INSERT INTO encounters (id, visit_id, facility_id, provider_user_id, created_by) "
        "SELECT :enc, v.id, :fac, :by, :by FROM visits v WHERE v.patient_id = :pid LIMIT 1 "
        "ON CONFLICT (id) DO NOTHING"
    ), {"enc": ENCOUNTER_ID, "fac": facility_id, "by": prescribed_by, "pid": patient_id})

    await db.execute(sa.text(
        "INSERT INTO prescriptions (id, encounter_id, patient_id, facility_id, created_by) "
        "VALUES (:id, :enc, :pid, :fac, :by) ON CONFLICT (id) DO NOTHING"
    ), {"id": PRESCRIPTION_ID, "enc": ENCOUNTER_ID, "pid": patient_id, "fac": facility_id, "by": prescribed_by})

    await db.execute(sa.text(
        "INSERT INTO prescription_items (id, prescription_id, item_id, quantity_prescribed) "
        "VALUES (:id, :presc, :item, :qty) ON CONFLICT (id) DO NOTHING"
    ), {"id": PRESCRIPTION_ITEM_ID, "presc": PRESCRIPTION_ID, "item": ITEM_ID, "qty": SEEDED_QUANTITY})


async def _stock_ledger_entries_for_batch() -> list:
    engine, Session = _session_factory()
    try:
        async with Session() as db:
            rows = (await db.execute(sa.text(
                "SELECT * FROM stock_ledger WHERE batch_id = :batch"
            ), {"batch": BATCH_ID})).mappings().all()
            return list(rows)
    finally:
        await engine.dispose()


@pytest.mark.xfail(
    reason="prescriptions/prescription_items table shape is unconfirmed (migration "
           "0008_orders_prescriptions.py / app/prescriptions/models.py never seen - "
           "see module docstring assumption #1). If the seed INSERT itself fails, "
           "that confirms the table shape needs checking, not that dispense is "
           "broken. If the seed succeeds but the dispense endpoint 404s/422s, that "
           "narrows to assumption #2 (create_dispense's internals unconfirmed).",
    strict=False,
)
@pytest.mark.asyncio
async def test_pharmacy_journey_prescription_to_reorder_alert(client_as, seeded_patient_id):
    engine, Session = _session_factory()
    try:
        async with Session() as db:
            prescribed_by = uuid.uuid5(uuid.NAMESPACE_OID, PHARMACIST.sub)
            await _seed_inventory(db, facility_id=TEST_FACILITY_ID)
            await _seed_prescription(
                db, patient_id=seeded_patient_id, facility_id=TEST_FACILITY_ID,
                prescribed_by=prescribed_by,
            )
            await db.commit()

        client = client_as(PHARMACIST)

        # --- 1. dispense (confirmed shape: DispenseCreate / DispenseOut) ---
        resp = client.post(
            "/api/v1/pharmacy/dispenses",
            json={
                "prescription_id": str(PRESCRIPTION_ID),
                "items": [{
                    "prescription_item_id": str(PRESCRIPTION_ITEM_ID),
                    "quantity_dispensed": str(SEEDED_QUANTITY),
                    "batch_id": str(BATCH_ID),
                }],
                "allow_partial": False,
            },
            headers={"Idempotency-Key": f"disp-{uuid.uuid4()}"},
        )
        assert resp.status_code == 201, resp.text
        dispensed = resp.json()["data"]
        assert dispensed["prescription_id"] == str(PRESCRIPTION_ID)
        assert dispensed["items"][0]["quantity_dispensed"] == str(SEEDED_QUANTITY)

        # --- 2. stock ledger side effect (table checked directly - no GET exists) ---
        ledger_rows = await _stock_ledger_entries_for_batch()
        assert ledger_rows, (
            "expected create_dispense to write a stock_ledger row for the dispensed "
            "batch - if this is empty, that's assumption #2 turning up a real gap, "
            "not a test bug"
        )

        # --- 3. reorder alert (confirmed path: GET .../inventory/reorder-alerts) ---
        resp = client.get("/api/v1/pharmacy/inventory/reorder-alerts")
        assert resp.status_code == 200, resp.text
        alerts = resp.json()["data"]["items"]
        assert any(a["item_id"] == str(ITEM_ID) for a in alerts), (
            "expected a reorder alert for an item dispensed down to/below its "
            "reorder_level"
        )
    finally:
        await engine.dispose()