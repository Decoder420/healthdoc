from __future__ import annotations

import asyncio
import uuid
from datetime import date, timedelta
from decimal import Decimal

import pytest
from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.inventory.schemas import (
    PurchaseOrderCreate,
    PurchaseOrderItemCreate,
    PurchaseOrderTransition,
    StockTransferAction,
    StockTransferCreate,
    StockTransferItemCreate,
)
from app.inventory.service import (
    cancel_stock_transfer,
    create_purchase_order,
    create_stock_transfer,
    dispatch_stock_transfer,
    get_purchase_order,
    receive_stock_transfer,
    transition_purchase_order,
)
from app.pharmacy.schemas import GrnCreate, GrnItemCreate, GrnVerifyRequest
from app.pharmacy.service import create_grn, verify_grn


async def _create_approved_po(db_session, inventory_seed, quantity: str = "50"):
    po = await create_purchase_order(
        db_session,
        PurchaseOrderCreate(
            supplier_id=inventory_seed["supplier_id"],
            expected_date=date.today() + timedelta(days=7),
            items=[
                PurchaseOrderItemCreate(
                    item_id=inventory_seed["medicine_id"],
                    quantity=Decimal(quantity),
                    unit_price=Decimal("2.50"),
                )
            ],
        ),
        facility_id=inventory_seed["facility_id"],
        actor_id=inventory_seed["pharmacist_id"],
    )
    return await transition_purchase_order(
        db_session,
        po.id,
        PurchaseOrderTransition(target_status="approved"),
        facility_id=inventory_seed["facility_id"],
        actor_id=inventory_seed["pharmacist_id"],
    )


async def _receive_against_po(db_session, inventory_seed, po_id, quantity: str, suffix: str):
    grn = await create_grn(
        db_session,
        GrnCreate(
            supplier_id=inventory_seed["supplier_id"],
            purchase_order_id=po_id,
            invoice_number=f"INV-{suffix}",
            received_date=date.today(),
            items=[
                GrnItemCreate(
                    item_id=inventory_seed["medicine_id"],
                    batch_number=f"PO-BATCH-{suffix}",
                    expiry_date=date.today() + timedelta(days=365),
                    quantity=Decimal(quantity),
                    unit_price=Decimal("2.50"),
                )
            ],
        ),
        current_user_id=inventory_seed["pharmacist_id"],
        facility_id=inventory_seed["facility_id"],
    )
    return await verify_grn(
        db_session,
        grn.id,
        GrnVerifyRequest(stock_location_id=inventory_seed["location_id"]),
        current_user_id=inventory_seed["pharmacist_id"],
        facility_id=inventory_seed["facility_id"],
    )


@pytest.mark.asyncio
async def test_po_linked_grns_progress_partial_to_received(db_session, inventory_seed):
    po = await _create_approved_po(db_session, inventory_seed)

    await _receive_against_po(db_session, inventory_seed, po.id, "20", "PART")
    partial = await get_purchase_order(
        db_session, po.id, facility_id=inventory_seed["facility_id"]
    )
    assert partial.status == "partially_received"
    assert partial.items[0].received_quantity == Decimal("20")

    await _receive_against_po(db_session, inventory_seed, po.id, "30", "FINAL")
    complete = await get_purchase_order(
        db_session, po.id, facility_id=inventory_seed["facility_id"]
    )
    assert complete.status == "received"
    assert complete.items[0].received_quantity == Decimal("50")


@pytest.mark.asyncio
async def test_po_rejects_over_receipt_and_cross_facility_reads(db_session, inventory_seed):
    po = await _create_approved_po(db_session, inventory_seed, "5")
    with pytest.raises(HTTPException) as over:
        await create_grn(
            db_session,
            GrnCreate(
                supplier_id=inventory_seed["supplier_id"],
                purchase_order_id=po.id,
                received_date=date.today(),
                items=[
                    GrnItemCreate(
                        item_id=inventory_seed["medicine_id"],
                        batch_number=f"OVER-{index}",
                        expiry_date=date.today() + timedelta(days=365),
                        quantity=Decimal("3"),
                    )
                    for index in range(2)
                ],
            ),
            current_user_id=inventory_seed["pharmacist_id"],
            facility_id=inventory_seed["facility_id"],
        )
    assert over.value.status_code == 409

    with pytest.raises(HTTPException) as hidden:
        await get_purchase_order(db_session, po.id, facility_id=uuid.uuid4())
    assert hidden.value.status_code == 404


async def _destination_location(db_session, facility_id):
    destination_id = uuid.uuid4()
    await db_session.execute(
        text("""
            INSERT INTO stock_locations (id, name, location_type, facility_id)
            VALUES (:id, 'Transfer Destination', 'ward', :facility_id)
        """),
        {"id": destination_id, "facility_id": facility_id},
    )
    return destination_id


async def _transfer_payload(db_session, inventory_seed, quantity: str):
    source_id = (
        await db_session.execute(
            text("SELECT stock_location_id FROM inventory_batches WHERE id = :id"),
            {"id": inventory_seed["early_batch_id"]},
        )
    ).scalar_one()
    destination_id = await _destination_location(db_session, inventory_seed["facility_id"])
    return StockTransferCreate(
        from_location_id=source_id,
        to_location_id=destination_id,
        items=[
            StockTransferItemCreate(
                item_id=inventory_seed["medicine_id"],
                batch_id=inventory_seed["early_batch_id"],
                quantity=Decimal(quantity),
            )
        ],
    )


@pytest.mark.asyncio
async def test_transfer_reserves_then_moves_stock_with_balanced_ledger(
    db_session, inventory_seed
):
    payload = await _transfer_payload(db_session, inventory_seed, "4")
    transfer = await create_stock_transfer(
        db_session,
        payload,
        facility_id=inventory_seed["facility_id"],
        actor_id=inventory_seed["pharmacist_id"],
    )
    dispatched = await dispatch_stock_transfer(
        db_session,
        transfer.id,
        StockTransferAction(reason="ward replenishment"),
        facility_id=inventory_seed["facility_id"],
        actor_id=inventory_seed["pharmacist_id"],
    )
    assert dispatched.status == "in_transit"
    reserved = (
        await db_session.execute(
            text("SELECT reserved_quantity FROM inventory_batches WHERE id = :id"),
            {"id": inventory_seed["early_batch_id"]},
        )
    ).scalar_one()
    assert reserved == Decimal("4")

    received = await receive_stock_transfer(
        db_session,
        transfer.id,
        StockTransferAction(reason="counted at destination"),
        facility_id=inventory_seed["facility_id"],
        actor_id=inventory_seed["pharmacist_id"],
    )
    assert received.status == "received"
    quantities = (
        await db_session.execute(
            text("""
                SELECT stock_location_id, quantity, reserved_quantity
                FROM inventory_batches
                WHERE item_id = :item_id AND batch_number = 'EARLY'
                ORDER BY stock_location_id
            """),
            {"item_id": inventory_seed["medicine_id"]},
        )
    ).mappings().all()
    assert sum((row["quantity"] for row in quantities), Decimal("0")) == Decimal("6")
    assert sum((row["reserved_quantity"] for row in quantities), Decimal("0")) == 0
    ledger = (
        await db_session.execute(
            text("""
                SELECT count(*) AS legs, sum(quantity) AS balance,
                       min(quantity) AS outbound, max(quantity) AS inbound
                FROM stock_ledger
                WHERE reference_type = 'stock_transfer' AND reference_id = :id
            """),
            {"id": transfer.id},
        )
    ).mappings().one()
    assert ledger["legs"] == 2
    assert ledger["balance"] == 0
    assert ledger["outbound"] == Decimal("-4")
    assert ledger["inbound"] == Decimal("4")


@pytest.mark.asyncio
async def test_concurrent_dispatch_cannot_over_reserve(engine, db_session, inventory_seed):
    first_payload = await _transfer_payload(db_session, inventory_seed, "4")
    second_payload = await _transfer_payload(db_session, inventory_seed, "4")
    first = await create_stock_transfer(
        db_session,
        first_payload,
        facility_id=inventory_seed["facility_id"],
        actor_id=inventory_seed["pharmacist_id"],
    )
    second = await create_stock_transfer(
        db_session,
        second_payload,
        facility_id=inventory_seed["facility_id"],
        actor_id=inventory_seed["pharmacist_id"],
    )
    await db_session.commit()

    session_factory = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    async def attempt(transfer_id):
        async with session_factory() as session:
            try:
                await dispatch_stock_transfer(
                    session,
                    transfer_id,
                    StockTransferAction(),
                    facility_id=inventory_seed["facility_id"],
                    actor_id=inventory_seed["pharmacist_id"],
                )
                await session.commit()
                return 200
            except HTTPException as exc:
                await session.rollback()
                return exc.status_code

    results = await asyncio.gather(attempt(first.id), attempt(second.id))
    assert sorted(results) == [200, 409]
    state = (
        await db_session.execute(
            text("SELECT quantity, reserved_quantity FROM inventory_batches WHERE id = :id"),
            {"id": inventory_seed["early_batch_id"]},
        )
    ).mappings().one()
    assert state["quantity"] == Decimal("6")
    assert state["reserved_quantity"] == Decimal("4")

    successful_id = (
        await db_session.execute(
            text("""
                SELECT id FROM stock_transfers
                WHERE id IN (:first_id, :second_id) AND status = 'in_transit'
            """),
            {"first_id": first.id, "second_id": second.id},
        )
    ).scalar_one()
    await cancel_stock_transfer(
        db_session,
        successful_id,
        StockTransferAction(reason="test cleanup"),
        facility_id=inventory_seed["facility_id"],
        actor_id=inventory_seed["pharmacist_id"],
    )
    # This test has to commit the seed so two independent sessions can see it.
    # Rename the global catalog rows afterwards so repeated local test runs do
    # not pollute medicine-search tests (inventory_items is a shared catalog).
    await db_session.execute(
        text("""
            UPDATE inventory_items SET name = :name, generic_name = :name
            WHERE id IN (:medicine_id, :substitute_id)
        """),
        {
            "name": f"Concurrency fixture {uuid.uuid4()}",
            "medicine_id": inventory_seed["medicine_id"],
            "substitute_id": inventory_seed["substitute_medicine_id"],
        },
    )
    await db_session.commit()
