import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.common.db import Base
from app.common.models import Timestamps, UUIDPk


class Supplier(Base, UUIDPk, Timestamps):
    __tablename__ = "suppliers"

    facility_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("facilities.id", ondelete="RESTRICT"), nullable=False
    )
    name: Mapped[str] = mapped_column(Text, nullable=False)
    contact_info: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    __table_args__ = (
        Index("ix_suppliers_facility_id", "facility_id"),
    )


class InventoryItem(Base, UUIDPk, Timestamps):
    __tablename__ = "inventory_items"

    name: Mapped[str] = mapped_column(Text, nullable=False)
    generic_name: Mapped[str | None] = mapped_column(Text, nullable=True)
    strength: Mapped[str | None] = mapped_column(String(50), nullable=True)
    form: Mapped[str | None] = mapped_column(String(50), nullable=True)
    item_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_controlled_drug: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    manufacturer: Mapped[str | None] = mapped_column(Text, nullable=True)
    ingredient_code: Mapped[str | None] = mapped_column(String(50), nullable=True)
    owning_department_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True
    )
    reorder_level: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0"))
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    #: WHO ATC level-5 where available, local ingredient list otherwise
    #: (migration 0032). This is what app.allergies.service matches an
    #: active allergy against -- never inventory_item_id, since two
    #: different stock items (e.g. amoxicillin, penicillin V) can share
    #: one ingredient and must both trigger the same allergy.
    ingredient_code: Mapped[str | None] = mapped_column(String(50), nullable=True)

    __table_args__ = (
        CheckConstraint(
            "form IN ('tablet','capsule','injection','syrup','ointment','fluid',"
            "'reagent','consumable','film','implant','blood_component')",
            name="form",
        ),
        CheckConstraint(
            "item_type IN ('medicine','reagent','consumable','film','implant',"
            "'blood_component')",
            name="item_type",
        ),
        Index("ix_inventory_items_owning_department_id", "owning_department_id"),
        Index("ix_inventory_items_ingredient_code", "ingredient_code"),
    )


class DrugInteraction(Base, UUIDPk, Timestamps):
    __tablename__ = "drug_interactions"

    ingredient_code_a: Mapped[str] = mapped_column(String(50), nullable=False)
    ingredient_code_b: Mapped[str] = mapped_column(String(50), nullable=False)
    severity: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    __table_args__ = (
        CheckConstraint("severity IN ('contraindicated','major','moderate','minor')", name="severity"),
        CheckConstraint("ingredient_code_a < ingredient_code_b", name="ordered_pair"),
        UniqueConstraint("ingredient_code_a", "ingredient_code_b"),
        Index("ix_drug_interactions_a", "ingredient_code_a"),
        Index("ix_drug_interactions_b", "ingredient_code_b"),
    )

    @property
    def is_absolute(self) -> bool:
        return self.severity == "contraindicated"


class StockLocation(Base, UUIDPk, Timestamps):
    __tablename__ = "stock_locations"

    name: Mapped[str] = mapped_column(Text, nullable=False)
    location_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    department_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True
    )
    facility_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=False
    )

    __table_args__ = (
        CheckConstraint(
            "location_type IN ('central','pharmacy','lab','radiology','ward',"
            "'emergency','ot')",
            name="location_type",
        ),
        Index("ix_stock_locations_department_id", "department_id"),
        Index("ix_stock_locations_facility_id", "facility_id"),
    )


class InventoryBatch(Base, UUIDPk, Timestamps):
    __tablename__ = "inventory_batches"

    item_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("inventory_items.id"), nullable=False
    )
    batch_number: Mapped[str] = mapped_column(String(50), nullable=False)
    expiry_date: Mapped[date] = mapped_column(Date, nullable=False)
    quantity: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    reserved_quantity: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), nullable=False, default=Decimal("0"), server_default="0"
    )
    purchase_rate: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    issue_rate_mrp: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    stock_location_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("stock_locations.id"), nullable=False
    )
    row_version: Mapped[int] = mapped_column(Integer, nullable=False, default=1, server_default="1")

    __table_args__ = (
        CheckConstraint("quantity >= 0", name="quantity"),
        CheckConstraint(
            "reserved_quantity >= 0 AND reserved_quantity <= quantity",
            name="reserved_quantity",
        ),
        UniqueConstraint(
            "item_id", "batch_number", "stock_location_id",
        ),
        Index("ix_inventory_batches_stock_location_id", "stock_location_id"),
    )


class StockLedger(Base, UUIDPk):
    __tablename__ = "stock_ledger"

    item_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("inventory_items.id"), nullable=False
    )
    batch_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("inventory_batches.id"), nullable=True
    )
    transaction_type: Mapped[str] = mapped_column(String(50), nullable=False)
    quantity: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    reference_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    reference_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    performed_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (
        CheckConstraint(
            "transaction_type IN ('purchase','issue','return','transfer',"
            "'consumption','adjustment','write_off')",
            name="transaction_type",
        ),
        CheckConstraint("quantity <> 0", name="quantity_nonzero"),
        CheckConstraint(
            "(transaction_type IN ('purchase','return') AND quantity > 0) OR "
            "(transaction_type IN ('issue','consumption','write_off') AND quantity < 0) OR "
            "(transaction_type IN ('adjustment','transfer'))",
            name="quantity_sign_matches_type",
        ),
        Index("ix_stock_ledger_item_id", "item_id"),
        Index("ix_stock_ledger_batch_id", "batch_id"),
        Index("ix_stock_ledger_performed_by", "performed_by"),
    )


class PurchaseOrder(Base, UUIDPk, Timestamps):
    __tablename__ = "purchase_orders"

    po_number: Mapped[str] = mapped_column(String(30), nullable=False, unique=True)
    supplier_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("suppliers.id", ondelete="RESTRICT"), nullable=False
    )
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="draft")
    approved_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=True
    )
    expected_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    facility_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("facilities.id", ondelete="RESTRICT"), nullable=False
    )
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    updated_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=True
    )

    __table_args__ = (
        CheckConstraint(
            "status IN ('draft','approved','sent','partially_received','received','cancelled')",
            name="status",
        ),
        Index("ix_purchase_orders_supplier_id", "supplier_id"),
        Index("ix_purchase_orders_facility_id", "facility_id"),
    )


class PurchaseOrderItem(Base, UUIDPk, Timestamps):
    __tablename__ = "purchase_order_items"

    purchase_order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("purchase_orders.id", ondelete="CASCADE"),
        nullable=False,
    )
    item_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("inventory_items.id", ondelete="RESTRICT"), nullable=False
    )
    quantity: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    unit_price: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)

    __table_args__ = (
        CheckConstraint("quantity > 0", name="quantity_positive"),
        Index("ix_purchase_order_items_purchase_order_id", "purchase_order_id"),
    )


class StockTransfer(Base, UUIDPk, Timestamps):
    __tablename__ = "stock_transfers"

    from_location_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("stock_locations.id", ondelete="RESTRICT"), nullable=False
    )
    to_location_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("stock_locations.id", ondelete="RESTRICT"), nullable=False
    )
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="requested")
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    updated_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=True
    )

    __table_args__ = (
        CheckConstraint(
            "status IN ('requested','in_transit','received','cancelled')", name="status"
        ),
        CheckConstraint("from_location_id <> to_location_id", name="distinct_locations"),
        Index("ix_stock_transfers_from_location_id", "from_location_id"),
        Index("ix_stock_transfers_to_location_id", "to_location_id"),
    )


class StockTransferItem(Base, UUIDPk, Timestamps):
    __tablename__ = "stock_transfer_items"

    stock_transfer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("stock_transfers.id", ondelete="CASCADE"),
        nullable=False,
    )
    item_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("inventory_items.id", ondelete="RESTRICT"), nullable=False
    )
    batch_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("inventory_batches.id", ondelete="RESTRICT"), nullable=True
    )
    quantity: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)

    __table_args__ = (
        CheckConstraint("quantity > 0", name="quantity_positive"),
        Index("ix_stock_transfer_items_stock_transfer_id", "stock_transfer_id"),
        Index("ix_stock_transfer_items_batch_id", "batch_id"),
    )
