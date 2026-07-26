import uuid
from decimal import Decimal

from sqlalchemy import CheckConstraint, ForeignKey, Index, Numeric, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.db import Base
from app.common.enums import DispenseStatus
from app.common.models import Timestamps, UUIDPk


class PharmacyDispense(Base, UUIDPk, Timestamps):
    

    __tablename__ = "pharmacy_dispenses"

    prescription_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("prescriptions.id", ondelete="RESTRICT"), nullable=False
    )
    visit_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("visits.id", ondelete="RESTRICT"), nullable=True
    )
    status: Mapped[str] = mapped_column(
        nullable=False, default=DispenseStatus.RECEIVED
    )
    dispensed_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    version: Mapped[int] = mapped_column(nullable=False)
    is_current: Mapped[bool] = mapped_column(nullable=False)

    items: Mapped[list["PharmacyDispenseItem"]] = relationship(
        back_populates="dispense", cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint(
            DispenseStatus.sql_check("status"), name="ck_pharmacy_dispenses_status"
        ),
        UniqueConstraint(
            "prescription_id", "version", name="uq_pharmacy_dispenses_prescription_id_version"
        ),
        Index("ix_pharmacy_dispenses_visit_id", "visit_id"),
        Index("ix_pharmacy_dispenses_dispensed_by", "dispensed_by"),
    )


class PharmacyDispenseItem(Base, UUIDPk, Timestamps):
    __tablename__ = "pharmacy_dispense_items"

    dispense_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("pharmacy_dispenses.id", ondelete="CASCADE"), nullable=False
    )
    prescription_item_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("prescription_items.id", ondelete="RESTRICT"), nullable=False
    )
    batch_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("inventory_batches.id", ondelete="RESTRICT"), nullable=False
    )
    quantity_prescribed: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    quantity_dispensed: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    is_substitute: Mapped[bool] = mapped_column(nullable=False, default=False)
    substitute_reason: Mapped[str | None] = mapped_column(nullable=True)

    dispense: Mapped["PharmacyDispense"] = relationship(back_populates="items")

    __table_args__ = (
        Index("ix_pharmacy_dispense_items_dispense_id", "dispense_id"),
        Index("ix_pharmacy_dispense_items_prescription_item_id", "prescription_item_id"),
        Index("ix_pharmacy_dispense_items_batch_id", "batch_id"),
    )
