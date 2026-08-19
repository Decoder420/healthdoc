"""
Integration test for the Lab journey (#243): order -> sample collection ->
result entry -> verify -> critical alert.

AUTH: tests/integration/conftest.py's client_as fixture (dependency
overrides), NOT bearer headers. client_as() mutates a single global
override on the shared app object - hold ONE `client` variable and call
client_as() again to switch identity, rather than holding two client
handles as if independent.

ENVELOPE: every JSON response is wrapped {"success","data","error","meta"}
by app/common/envelope.py - every access goes through resp.json()["data"].
"""
from __future__ import annotations

import uuid

import pytest
import sqlalchemy as sa
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.auth.deps import AuthUser
from app.notifications.models import NotificationHistory
from tests._lab_seed import ORDER_ID, TEST_DATABASE_URL
from tests._lab_seed import _seed as _lab_seed_chain
from tests.integration.conftest import LAB_TECH, PATHOLOGIST


async def seed_order_chain_async(subs: list[str]) -> str:
    await _lab_seed_chain(subs)
    return str(ORDER_ID)


DUAL_ROLE_USER = AuthUser(
    sub="labjrn-dual-role-0001", username="labjrn-dual", roles=["lab_tech", "pathologist"]
)


async def _notifications_for_item(item_id: str) -> list[NotificationHistory]:
    engine = create_async_engine(TEST_DATABASE_URL)
    try:
        session_factory = async_sessionmaker(engine, expire_on_commit=False)
        async with session_factory() as session:
            rows = (
                await session.execute(
                    sa.select(NotificationHistory).where(
                        NotificationHistory.event_type == "lab_critical_result",
                    )
                )
            ).scalars().all()
            return [n for n in rows if n.payload.get("lab_order_item_id") == item_id]
    finally:
        await engine.dispose()


@pytest.mark.asyncio
async def test_lab_journey_order_to_critical_alert(client_as, seeded_patient_id):
    order_id = await seed_order_chain_async([LAB_TECH.sub, PATHOLOGIST.sub])

    client = client_as(LAB_TECH)

    resp = client.post(
        "/api/v1/pathology/order-items",
        params={"order_id": order_id},
        json={"test_code": "HB", "test_name": "Hemoglobin", "sample_type": "blood"},
    )
    assert resp.status_code == 201, resp.text
    item = resp.json()["data"]
    item_id = item["id"]
    assert item["status"] == "placed"
    assert item["accession_number"]

    resp = client.put(
        f"/api/v1/pathology/order-items/{item_id}/sample-collection",
        json={"barcode": f"LABJRN-{uuid.uuid4().hex[:10]}"},
    )
    assert resp.status_code == 200, resp.text
    assert resp.json()["data"]["status"] == "in_progress"

    resp = client.put(
        f"/api/v1/pathology/order-items/{item_id}/sample-collection",
        json={"barcode": f"LABJRN-{uuid.uuid4().hex[:10]}"},
    )
    assert resp.status_code == 409

    resp = client.post(
        f"/api/v1/pathology/order-items/{item_id}/results",
        json={"result_data": {"hemoglobin_g_dl": 5.2}, "remarks": "low, recollect if unexpected"},
    )
    assert resp.status_code == 201, resp.text
    assert resp.json()["data"]["status"] == "preliminary"

    client = client_as(PATHOLOGIST)
    resp = client.put(f"/api/v1/pathology/order-items/{item_id}/results/verify", json={})
    assert resp.status_code == 200, resp.text
    verified = resp.json()["data"]
    assert verified["status"] == "final"
    assert verified["tat_minutes"] is not None

    client = client_as(LAB_TECH)
    resp = client.get("/api/v1/pathology/order-items", params={"status": "released"})
    assert any(i["id"] == item_id for i in resp.json()["data"]["items"])

    matching = await _notifications_for_item(item_id)
    assert matching, "expected _publish_critical_alert to have written a NotificationHistory row"
    assert matching[0].payload["flagged_field_count"] == 1


@pytest.mark.asyncio
async def test_lab_journey_same_user_cannot_verify_own_result(client_as):
    order_id = await seed_order_chain_async([DUAL_ROLE_USER.sub])
    client = client_as(DUAL_ROLE_USER)

    resp = client.post(
        "/api/v1/pathology/order-items",
        params={"order_id": order_id},
        json={"test_code": "HB", "test_name": "Hemoglobin", "sample_type": "blood"},
    )
    assert resp.status_code == 201, resp.text
    item_id = resp.json()["data"]["id"]

    resp = client.put(
        f"/api/v1/pathology/order-items/{item_id}/sample-collection",
        json={"barcode": f"LABJRN-{uuid.uuid4().hex[:10]}"},
    )
    assert resp.status_code == 200, resp.text

    resp = client.post(
        f"/api/v1/pathology/order-items/{item_id}/results",
        json={"result_data": {"hemoglobin_g_dl": 13.0}, "remarks": None},
    )
    assert resp.status_code == 201, resp.text

    resp = client.put(f"/api/v1/pathology/order-items/{item_id}/results/verify", json={})
    assert resp.status_code == 403