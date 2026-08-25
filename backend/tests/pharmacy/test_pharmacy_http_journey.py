"""Live PostgreSQL HTTP journey replacing PR #397's invalid xfailed Pharmacy test."""

from __future__ import annotations

import uuid
from decimal import Decimal

import httpx
import pytest
from sqlalchemy import text

from app.auth.deps import (
    AuthUser,
    DbUser,
    get_current_db_user,
    get_current_user,
)
from app.common.db import get_db
from app.main import app


@pytest.mark.asyncio
async def test_prescription_dispense_ledger_and_reorder_alert(db_session, pharmacy_seed):
    auth_user = AuthUser(
        sub="pharmacy-http-journey",
        username="pharmacy-http-journey",
        roles=["pharmacist"],
    )
    db_user = DbUser(
        id=pharmacy_seed["pharmacist_id"],
        keycloak_sub=auth_user.sub,
        username=auth_user.username,
        facility_id=pharmacy_seed["facility_id"],
        roles=auth_user.roles,
    )

    async def override_db():
        yield db_session

    app.dependency_overrides[get_current_user] = lambda: auth_user
    app.dependency_overrides[get_current_db_user] = lambda: db_user
    app.dependency_overrides[get_db] = override_db
    try:
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            queue = await client.get("/api/v1/pharmacy/queue")
            assert queue.status_code == 200, queue.text
            assert any(
                row["prescription_id"] == str(pharmacy_seed["prescription_id"])
                for row in queue.json()["data"]["items"]
            )

            dispensed = await client.post(
                "/api/v1/pharmacy/dispenses",
                json={
                    "prescription_id": str(pharmacy_seed["prescription_id"]),
                    "items": [
                        {
                            "prescription_item_id": str(pharmacy_seed["prescription_item_id"]),
                            "quantity_dispensed": "26",
                        }
                    ],
                    "allow_partial": False,
                },
                headers={"Idempotency-Key": f"dispense-{uuid.uuid4()}"},
            )
            assert dispensed.status_code == 201, dispensed.text
            dispense_id = dispensed.json()["data"]["id"]

            ledger_quantity = (
                await db_session.execute(
                    text(
                        "SELECT COALESCE(SUM(-quantity), 0) FROM stock_ledger "
                        "WHERE reference_id=:dispense_id"
                    ),
                    {"dispense_id": uuid.UUID(dispense_id)},
                )
            ).scalar_one()
            assert ledger_quantity == Decimal("26")

            alerts = await client.get("/api/v1/pharmacy/inventory/reorder-alerts")
            assert alerts.status_code == 200, alerts.text
            assert any(
                row["item_id"] == str(pharmacy_seed["medicine_id"])
                and Decimal(str(row["current_stock"])) == Decimal("0")
                for row in alerts.json()["data"]["items"]
            )
    finally:
        app.dependency_overrides.pop(get_current_user, None)
        app.dependency_overrides.pop(get_current_db_user, None)
        app.dependency_overrides.pop(get_db, None)
