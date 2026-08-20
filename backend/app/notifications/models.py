import uuid
from datetime import datetime
from sqlalchemy import Boolean, DateTime, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.common.db import Base
from app.common.models import Blame, Timestamps, UUIDPk


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
    """Per-role opt-out for one event_type at one facility. §3 0044 (#230).

    Absence of a row means enabled — see 0044's docstring for why the default
    is opt-out rather than opt-in. A row records a deliberate decision to
    silence something, and `enabled` stays explicit so re-enabling is an UPDATE
    with a trail rather than a DELETE that erases the earlier decision.
    """

    __tablename__ = "notification_preferences"
    __table_args__ = (
        # Doubles as the lookup index: the unique constraint's btree covers
        # (facility_id, role, event_type) in that order, which is both the
        # point read and the facility-wide list. A separate index on the same
        # columns would be a duplicate tree maintained on every write.
        UniqueConstraint("facility_id", "role", "event_type",
                         name="uq_notification_preferences_scope"),
    )

    facility_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("facilities.id", ondelete="RESTRICT"), nullable=False)

    #: Not CHECK-constrained: roles come from the Keycloak realm, not our schema.
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    #: Nor is this: publishing modules define event_type values, and pinning
    #: them here would mean a migration every time one is added.
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)

    enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")
