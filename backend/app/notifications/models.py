import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, func, Boolean, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.common.db import Base
from app.common.models import UUIDPk, Blame, Timestamps


class NotificationHistory(Base, UUIDPk):
    __tablename__ = "notification_history"

    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    payload: Mapped[dict] = mapped_column(JSONB, nullable=False)
    department_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True)
    # NOT NULL: every notification belongs to a facility. department_id stays
    # nullable because a facility-wide announcement has no department.
    facility_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())


class NotificationPreference(Base, UUIDPk, Timestamps, Blame):
    """Per-facility, per-role, per-event-type opt-out. Absence of a row
    means "default: enabled" -- there's no fixed catalog of every
    possible event_type to seed rows for (they're free-form strings
    introduced ad hoc across modules), so this only stores explicit
    exceptions, not a full matrix."""

    __tablename__ = "notification_preferences"

    facility_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    is_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    __table_args__ = (
        UniqueConstraint("facility_id", "role", "event_type",
                          name="uq_notification_preferences_facility_role_event"),
    )
