from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, model_validator


class PurchaseOrderItemCreate(BaseModel):
    item_id: UUID
    quantity: Decimal = Field(gt=0)
    unit_price: Decimal | None = Field(default=None, ge=0)


class PurchaseOrderCreate(BaseModel):
    supplier_id: UUID
    expected_date: date | None = None
    items: list[PurchaseOrderItemCreate] = Field(min_length=1)

    @model_validator(mode="after")
    def unique_items(self):
        ids = [item.item_id for item in self.items]
        if len(ids) != len(set(ids)):
            raise ValueError("purchase order items must be unique")
        return self


class PurchaseOrderTransition(BaseModel):
    target_status: Literal["approved", "sent", "cancelled"]


class PurchaseOrderItemOut(BaseModel):
    id: UUID
    item_id: UUID
    item_name: str
    quantity: Decimal
    received_quantity: Decimal
    unit_price: Decimal | None


class PurchaseOrderOut(BaseModel):
    id: UUID
    po_number: str
    supplier_id: UUID
    supplier_name: str
    status: str
    approved_by: UUID | None
    expected_date: date | None
    created_at: datetime
    updated_at: datetime
    items: list[PurchaseOrderItemOut]


class PurchaseOrderListOut(BaseModel):
    items: list[PurchaseOrderOut]
    page: int
    page_size: int
    total: int


class StockTransferItemCreate(BaseModel):
    item_id: UUID
    batch_id: UUID
    quantity: Decimal = Field(gt=0)


class StockTransferCreate(BaseModel):
    from_location_id: UUID
    to_location_id: UUID
    items: list[StockTransferItemCreate] = Field(min_length=1)

    @model_validator(mode="after")
    def valid_transfer(self):
        if self.from_location_id == self.to_location_id:
            raise ValueError("source and destination locations must differ")
        batches = [item.batch_id for item in self.items]
        if len(batches) != len(set(batches)):
            raise ValueError("a batch may appear only once in a transfer")
        return self


class StockTransferAction(BaseModel):
    reason: str | None = Field(default=None, max_length=500)


class StockTransferItemOut(BaseModel):
    id: UUID
    item_id: UUID
    item_name: str
    batch_id: UUID
    batch_number: str
    quantity: Decimal


class StockTransferOut(BaseModel):
    id: UUID
    from_location_id: UUID
    from_location_name: str
    to_location_id: UUID
    to_location_name: str
    status: str
    created_by: UUID
    created_at: datetime
    updated_at: datetime
    items: list[StockTransferItemOut]


class StockTransferListOut(BaseModel):
    items: list[StockTransferOut]
    page: int
    page_size: int
    total: int
