"""ORM mapping for procedure_records (migration 0008)."""

import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.common.db import Base
from app.common.enums import ProcedureSetting
from app.common.models import Timestamps, UUIDPk


class ProcedureRecord(UUIDPk, Timestamps, Base):
    __tablename__ = "procedure_records"

    order_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("orders.id", ondelete="RESTRICT"), nullable=True
    )
    encounter_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("encounters.id", ondelete="RESTRICT"), nullable=False
    )
    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("patients.id", ondelete="RESTRICT"), nullable=False
    )
    procedure_name: Mapped[str] = mapped_column(Text, nullable=False)
    procedure_code: Mapped[str | None] = mapped_column(String(30), nullable=True)
    code_system: Mapped[str | None] = mapped_column(String(30), nullable=True)
    setting: Mapped[str] = mapped_column(String(50), nullable=False)
    ot_schedule_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("ot_schedules.id", ondelete="RESTRICT"), nullable=True
    )
    performed_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    assisted_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    outcome: Mapped[str | None] = mapped_column(Text, nullable=True)
    complications: Mapped[str | None] = mapped_column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint(ProcedureSetting.sql_check("setting"), name="setting"),
        CheckConstraint(
            "ot_schedule_id IS NULL OR setting = 'ot'",
            name="ot_schedule_only_when_ot",
        ),
        Index("ix_procedure_records_encounter_id", "encounter_id"),
        Index("ix_procedure_records_patient_id", "patient_id"),
    )
