"""ORM mapping for machine_maintenance_logs from migration 0024."""
from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.common.db import Base
from app.common.models import Blame, Timestamps, UUIDPk


class MachineMaintenanceLog(UUIDPk, Blame, Timestamps, Base):
    """Append-only evidence of work performed on a named machine."""

    __tablename__ = "machine_maintenance_logs"

    machine_id: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    department_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("departments.id", ondelete="RESTRICT"),
        nullable=True,
    )
    maintenance_type: Mapped[str] = mapped_column(String(50), nullable=False)
    performed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    performed_by_vendor: Mapped[str | None] = mapped_column(Text, nullable=True)
    downtime_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
