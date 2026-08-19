"""
Integration test for the Billing journey (#243): invoice/build -> payment
-> refund. Anchored on real router POSTs, not direct service.* calls
(that's what tests/billing/test_billing_flows.py already covers).

ENVELOPE: every JSON response is wrapped {"success","data","error","meta"}
- every access below goes through resp.json()["data"].

Draft invoice is still seeded directly via tests/billing/conftest.py's
seed_draft_invoice - if this repo's POST /visits now creates the invoice
at registration (tests/integration/conftest.py's _seed() here shows a
charge_master REGISTRATION row, suggesting #389 may be fixed in THIS
checkout), that's worth switching to a real POST later, but the seeded
path still exercises build/payment/refund correctly either way.
"""
from __future__ import annotations

import uuid

import pytest
import sqlalchemy as sa
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from tests._lab_seed import TEST_DATABASE_URL
from tests.billing.conftest import seed_draft_invoice, seed_facility, seed_patient, seed_user, seed_visit
from tests.billing.test_billing_flows import _seed_billable_lab_charge
from tests.integration.conftest import RECEPTIONIST, SUPERVISOR


def _session_factory():
    engine = create_async_engine(TEST_DATABASE_URL)
    return engine, async_sessionmaker(engine, expire_on_commit=False)


@pytest.mark.asyncio
async def test_billing_journey_invoice_to_refund(client_as):
    engine, Session = _session_factory()
    try:
        async with Session() as db:
            facility = await seed_facility(db)
            patient = await seed_patient(db, facility_id=facility)
            user = await seed_user(db, facility_id=facility)
            visit = await seed_visit(db, facility_id=facility, patient_id=patient)
            invoice_id = await seed_draft_invoice(
                db, facility_id=facility, patient_id=patient, visit_id=visit, created_by=user,
            )
            await _seed_billable_lab_charge(db, visit_id=visit, test_code="CBC")
            await db.commit()

        clerk = client_as(RECEPTIONIST)

        resp = clerk.post(f"/api/v1/billing/visits/{visit}/invoice/build", json={"dry_run": False})
        assert resp.status_code == 200, resp.text
        build = resp.json()["data"]
        assert build["lines_added"] == 1
        assert build["status"] == "draft"
        assert build["gross_amount"] == "300.00"

        async with Session() as db:
            await db.execute(sa.text("UPDATE invoices SET status = 'issued' WHERE id = :id"), {"id": invoice_id})
            await db.commit()

        first_payment_key = f"pay-{uuid.uuid4()}"
        resp = clerk.post(
            f"/api/v1/billing/invoices/{invoice_id}/payments",
            json={"amount": "300.00", "mode": "cash", "currency": "INR"},
            headers={"Idempotency-Key": first_payment_key},
        )
        assert resp.status_code == 201, resp.text
        payment = resp.json()["data"]
        assert payment["amount"] == "300.00"
        assert payment["status"] == "success"

        resp = clerk.post(
            f"/api/v1/billing/invoices/{invoice_id}/payments",
            json={"amount": "1.00", "mode": "cash", "currency": "INR"},
        )
        assert resp.status_code == 400

        resp = clerk.post(
            f"/api/v1/billing/invoices/{invoice_id}/payments",
            json={"amount": "300.00", "mode": "cash", "currency": "INR"},
            headers={"Idempotency-Key": first_payment_key},
        )
        assert resp.status_code in (200, 201)
        assert resp.json()["data"]["id"] == payment["id"]

        async with Session() as db:
            count_after_replay = (
                await db.execute(sa.text("SELECT count(*) FROM payments WHERE invoice_id = :id"), {"id": invoice_id})
            ).scalar_one()
            assert count_after_replay == 1

            invoice_row = (
                await db.execute(sa.text("SELECT status FROM invoices WHERE id = :id"), {"id": invoice_id})
            ).one()
            assert invoice_row.status == "paid"

        resp = clerk.post(
            f"/api/v1/billing/payments/{payment['id']}/refunds",
            json={"amount": "50.00", "reason": "journey test partial refund"},
            headers={"Idempotency-Key": f"rfd-{uuid.uuid4()}"},
        )
        assert resp.status_code == 403

        supervisor = client_as(SUPERVISOR)
        resp = supervisor.post(
            f"/api/v1/billing/payments/{payment['id']}/refunds",
            json={"amount": "50.00", "reason": "journey test partial refund"},
            headers={"Idempotency-Key": f"rfd-{uuid.uuid4()}"},
        )
        assert resp.status_code == 201, resp.text
        refund = resp.json()["data"]
        assert refund["amount"] == "50.00"

        async with Session() as db:
            invoice_row = (
                await db.execute(
                    sa.text("SELECT status, row_version FROM invoices WHERE id = :id"), {"id": invoice_id}
                )
            ).one()
            assert invoice_row.status == "partially_paid"
            assert invoice_row.row_version == 4

        resp = supervisor.post(
            f"/api/v1/billing/payments/{payment['id']}/refunds",
            json={"amount": "999.00", "reason": "should fail"},
            headers={"Idempotency-Key": f"rfd-{uuid.uuid4()}"},
        )
        assert resp.status_code == 409
    finally:
        await engine.dispose()


@pytest.mark.asyncio
async def test_billing_journey_payment_blocked_before_invoice_issued(client_as):
    engine, Session = _session_factory()
    try:
        async with Session() as db:
            facility = await seed_facility(db)
            patient = await seed_patient(db, facility_id=facility)
            user = await seed_user(db, facility_id=facility)
            visit = await seed_visit(db, facility_id=facility, patient_id=patient)
            invoice_id = await seed_draft_invoice(
                db, facility_id=facility, patient_id=patient, visit_id=visit, created_by=user,
            )
            await db.commit()

        clerk = client_as(RECEPTIONIST)
        resp = clerk.post(
            f"/api/v1/billing/invoices/{invoice_id}/payments",
            json={"amount": "100.00", "mode": "cash", "currency": "INR"},
            headers={"Idempotency-Key": f"pay-{uuid.uuid4()}"},
        )
        assert resp.status_code == 409
    finally:
        await engine.dispose()