"""Facility-scoped purchase ordering and stock transfer workflows."""
from __future__ import annotations

from collections.abc import Awaitable, Callable
from typing import Annotated, TypeVar
from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentDbUser, require_roles
from app.common.db import get_db
from app.common.idempotency import (
    check_idempotency,
    hash_request_body,
    record_idempotent_response,
)
from app.inventory import service
from app.inventory.schemas import (
    PurchaseOrderCreate,
    PurchaseOrderListOut,
    PurchaseOrderOut,
    PurchaseOrderTransition,
    StockTransferAction,
    StockTransferCreate,
    StockTransferListOut,
    StockTransferOut,
)

router = APIRouter(
    prefix="/inventory",
    tags=["inventory"],
    dependencies=[Depends(require_roles("admin", "pharmacist"))],
)
DbSession = Annotated[AsyncSession, Depends(get_db)]
IdempotencyKey = Annotated[str | None, Header(alias="Idempotency-Key")]
ResponseT = TypeVar("ResponseT", bound=BaseModel)


async def _idempotent(
    *,
    db: AsyncSession,
    key: str | None,
    endpoint: str,
    payload: BaseModel,
    actor_id: UUID,
    status_code: int,
    response_type: type[ResponseT],
    operation: Callable[[], Awaitable[ResponseT]],
) -> ResponseT:
    if not key:
        raise HTTPException(status_code=400, detail="Idempotency-Key header is required")
    request_hash = hash_request_body(payload)
    cached = await check_idempotency(db, key, endpoint, request_hash, actor_id)
    if cached is not None:
        return response_type.model_validate(cached.response_body)
    result = await operation()
    await record_idempotent_response(
        db, key, endpoint, status_code, result.model_dump(mode="json"), actor_id
    )
    return result


@router.get("/ping")
async def ping() -> dict:
    return {"module": "inventory", "status": "ok"}


@router.post("/purchase-orders", response_model=PurchaseOrderOut, status_code=201)
async def create_purchase_order(
    payload: PurchaseOrderCreate,
    current_user: CurrentDbUser,
    db: DbSession,
    idempotency_key: IdempotencyKey = None,
) -> PurchaseOrderOut:
    return await _idempotent(
        db=db,
        key=idempotency_key,
        endpoint="POST /inventory/purchase-orders",
        payload=payload,
        actor_id=current_user.id,
        status_code=201,
        response_type=PurchaseOrderOut,
        operation=lambda: service.create_purchase_order(
            db, payload, facility_id=current_user.facility_id, actor_id=current_user.id
        ),
    )


@router.get("/purchase-orders", response_model=PurchaseOrderListOut)
async def list_purchase_orders(
    current_user: CurrentDbUser,
    db: DbSession,
    status: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
) -> PurchaseOrderListOut:
    return await service.list_purchase_orders(
        db,
        facility_id=current_user.facility_id,
        status=status,
        page=page,
        page_size=page_size,
    )


@router.get("/purchase-orders/{purchase_order_id}", response_model=PurchaseOrderOut)
async def get_purchase_order(
    purchase_order_id: UUID, current_user: CurrentDbUser, db: DbSession
) -> PurchaseOrderOut:
    return await service.get_purchase_order(
        db, purchase_order_id, facility_id=current_user.facility_id
    )


@router.post(
    "/purchase-orders/{purchase_order_id}/transition", response_model=PurchaseOrderOut
)
async def transition_purchase_order(
    purchase_order_id: UUID,
    payload: PurchaseOrderTransition,
    current_user: CurrentDbUser,
    db: DbSession,
    idempotency_key: IdempotencyKey = None,
) -> PurchaseOrderOut:
    return await _idempotent(
        db=db,
        key=idempotency_key,
        endpoint=f"POST /inventory/purchase-orders/{purchase_order_id}/transition",
        payload=payload,
        actor_id=current_user.id,
        status_code=200,
        response_type=PurchaseOrderOut,
        operation=lambda: service.transition_purchase_order(
            db,
            purchase_order_id,
            payload,
            facility_id=current_user.facility_id,
            actor_id=current_user.id,
        ),
    )


@router.post("/stock-transfers", response_model=StockTransferOut, status_code=201)
async def create_stock_transfer(
    payload: StockTransferCreate,
    current_user: CurrentDbUser,
    db: DbSession,
    idempotency_key: IdempotencyKey = None,
) -> StockTransferOut:
    return await _idempotent(
        db=db,
        key=idempotency_key,
        endpoint="POST /inventory/stock-transfers",
        payload=payload,
        actor_id=current_user.id,
        status_code=201,
        response_type=StockTransferOut,
        operation=lambda: service.create_stock_transfer(
            db, payload, facility_id=current_user.facility_id, actor_id=current_user.id
        ),
    )


@router.get("/stock-transfers", response_model=StockTransferListOut)
async def list_stock_transfers(
    current_user: CurrentDbUser,
    db: DbSession,
    status: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
) -> StockTransferListOut:
    return await service.list_stock_transfers(
        db,
        facility_id=current_user.facility_id,
        status=status,
        page=page,
        page_size=page_size,
    )


@router.get("/stock-transfers/{transfer_id}", response_model=StockTransferOut)
async def get_stock_transfer(
    transfer_id: UUID, current_user: CurrentDbUser, db: DbSession
) -> StockTransferOut:
    return await service.get_stock_transfer(
        db, transfer_id, facility_id=current_user.facility_id
    )


async def _transfer_action(
    *,
    action: str,
    transfer_id: UUID,
    payload: StockTransferAction,
    current_user: CurrentDbUser,
    db: AsyncSession,
    idempotency_key: str | None,
) -> StockTransferOut:
    operation = {
        "dispatch": service.dispatch_stock_transfer,
        "receive": service.receive_stock_transfer,
        "cancel": service.cancel_stock_transfer,
    }[action]
    return await _idempotent(
        db=db,
        key=idempotency_key,
        endpoint=f"POST /inventory/stock-transfers/{transfer_id}/{action}",
        payload=payload,
        actor_id=current_user.id,
        status_code=200,
        response_type=StockTransferOut,
        operation=lambda: operation(
            db,
            transfer_id,
            payload,
            facility_id=current_user.facility_id,
            actor_id=current_user.id,
        ),
    )


@router.post("/stock-transfers/{transfer_id}/dispatch", response_model=StockTransferOut)
async def dispatch_stock_transfer(
    transfer_id: UUID,
    payload: StockTransferAction,
    current_user: CurrentDbUser,
    db: DbSession,
    idempotency_key: IdempotencyKey = None,
) -> StockTransferOut:
    return await _transfer_action(
        action="dispatch",
        transfer_id=transfer_id,
        payload=payload,
        current_user=current_user,
        db=db,
        idempotency_key=idempotency_key,
    )


@router.post("/stock-transfers/{transfer_id}/receive", response_model=StockTransferOut)
async def receive_stock_transfer(
    transfer_id: UUID,
    payload: StockTransferAction,
    current_user: CurrentDbUser,
    db: DbSession,
    idempotency_key: IdempotencyKey = None,
) -> StockTransferOut:
    return await _transfer_action(
        action="receive",
        transfer_id=transfer_id,
        payload=payload,
        current_user=current_user,
        db=db,
        idempotency_key=idempotency_key,
    )


@router.post("/stock-transfers/{transfer_id}/cancel", response_model=StockTransferOut)
async def cancel_stock_transfer(
    transfer_id: UUID,
    payload: StockTransferAction,
    current_user: CurrentDbUser,
    db: DbSession,
    idempotency_key: IdempotencyKey = None,
) -> StockTransferOut:
    return await _transfer_action(
        action="cancel",
        transfer_id=transfer_id,
        payload=payload,
        current_user=current_user,
        db=db,
        idempotency_key=idempotency_key,
    )
