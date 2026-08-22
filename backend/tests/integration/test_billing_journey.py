"""Live PostgreSQL HTTP journey replacing the valid Billing scope from stale PR #397."""

from __future__ import annotations

import asyncio
import uuid

import sqlalchemy as sa
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from tests._lab_seed import TEST_DATABASE_URL
from tests.billing.conftest import seed_draft_invoice, seed_visit
from tests.billing.test_billing_flows import _seed_billable_lab_charge
from tests.integration.conftest import (
    RECEPTIONIST,
    SUPERVISOR,
    TEST_FACILITY_ID,
)


async def _seed_billing_journey(patient_id: str) -> tuple[uuid.UUID, uuid.UUID]:
    engine = create_async_engine(TEST_DATABASE_URL)
    session_factory = async_sessionmaker(engine, expire_on_commit=False)
    try:
        async with session_factory() as db:
            actor_id = uuid.uuid5(uuid.NAMESPACE_OID, RECEPTIONIST.sub)
            visit_id = await seed_visit(
                db,
                facility_id=TEST_FACILITY_ID,
                patient_id=uuid.UUID(patient_id),
                created_by=actor_id,
            )
            invoice_id = await seed_draft_invoice(
                db,
                facility_id=TEST_FACILITY_ID,
                patient_id=uuid.UUID(patient_id),
                visit_id=visit_id,
                created_by=actor_id,
            )
            await _seed_billable_lab_charge(db, visit_id=visit_id, test_code="CBC")
            await db.commit()
            return visit_id, invoice_id
    finally:
        await engine.dispose()


async def _issue_invoice(invoice_id: uuid.UUID) -> None:
    engine = create_async_engine(TEST_DATABASE_URL)
    try:
        async with engine.begin() as connection:
            await connection.execute(
                sa.text("UPDATE invoices SET status='issued' WHERE id=:invoice_id"),
                {"invoice_id": invoice_id},
            )
    finally:
        await engine.dispose()


async def _payment_count(invoice_id: uuid.UUID) -> int:
    engine = create_async_engine(TEST_DATABASE_URL)
    try:
        async with engine.connect() as connection:
            return (
                await connection.execute(
                    sa.text("SELECT count(*) FROM payments WHERE invoice_id=:invoice_id"),
                    {"invoice_id": invoice_id},
                )
            ).scalar_one()
    finally:
        await engine.dispose()


def test_invoice_build_payment_replay_and_refund(client_as, seeded_patient_id):
    visit_id, invoice_id = asyncio.run(_seed_billing_journey(seeded_patient_id))
    clerk = client_as(RECEPTIONIST)

    response = clerk.post(
        f"/api/v1/billing/visits/{visit_id}/invoice/build",
        json={"dry_run": False},
    )
    assert response.status_code == 200, response.text
    assert response.json()["data"]["gross_amount"] == "300.00"

    asyncio.run(_issue_invoice(invoice_id))
    idempotency_key = f"payment-{uuid.uuid4()}"
    payment_request = {"amount": "300.00", "mode": "cash", "currency": "INR"}
    response = clerk.post(
        f"/api/v1/billing/invoices/{invoice_id}/payments",
        json=payment_request,
        headers={"Idempotency-Key": idempotency_key},
    )
    assert response.status_code == 201, response.text
    payment = response.json()["data"]

    replay = clerk.post(
        f"/api/v1/billing/invoices/{invoice_id}/payments",
        json=payment_request,
        headers={"Idempotency-Key": idempotency_key},
    )
    assert replay.status_code in (200, 201), replay.text
    assert replay.json()["data"]["id"] == payment["id"]
    assert asyncio.run(_payment_count(invoice_id)) == 1

    forbidden = clerk.post(
        f"/api/v1/billing/payments/{payment['id']}/refunds",
        json={"amount": "50.00", "reason": "Journey test partial refund"},
        headers={"Idempotency-Key": f"refund-{uuid.uuid4()}"},
    )
    assert forbidden.status_code == 403, forbidden.text

    supervisor = client_as(SUPERVISOR)
    refunded = supervisor.post(
        f"/api/v1/billing/payments/{payment['id']}/refunds",
        json={"amount": "50.00", "reason": "Journey test partial refund"},
        headers={"Idempotency-Key": f"refund-{uuid.uuid4()}"},
    )
    assert refunded.status_code == 201, refunded.text
    assert refunded.json()["data"]["amount"] == "50.00"
