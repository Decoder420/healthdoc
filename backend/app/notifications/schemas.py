from uuid import UUID
import uuid
from datetime import datetime
from typing import Any, Dict
from pydantic import BaseModel, ConfigDict, Field


class NotificationHistoryCreate(BaseModel):
    event_type: str
    payload: Dict[str, Any]
    department_id: uuid.UUID | None = None
    facility_id: uuid.UUID


class NotificationHistoryOut(BaseModel):
    id: uuid.UUID
    event_type: str
    payload: Dict[str, Any]
    department_id: uuid.UUID | None
    facility_id: uuid.UUID
    created_at: datetime
    # No updated_at: notification_history is append-only with a block-update
    # trigger, so the table has no such column and model_validate() would raise.

    model_config = ConfigDict(from_attributes=True)


class NotificationHistoryListOut(BaseModel):
    items: list[NotificationHistoryOut]
    page: int
    page_size: int
    total: int


# ============================================================ per-role preferences (#230)

class NotificationPreferenceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    facility_id: UUID
    role: str
    event_type: str
    enabled: bool


class NotificationPreferenceSet(BaseModel):
    """Upsert one (role, event_type) decision for the caller's facility.

    Absence of a row means enabled, so posting enabled=true for something never
    silenced is a no-op that simply records the decision explicitly.
    """

    role: str = Field(..., max_length=50,
                      description="Keycloak realm role, e.g. nurse, pharmacist, hod.")
    event_type: str = Field(..., max_length=50,
                            description="e.g. token_called, low_stock_alert, lab_critical_result.")
    enabled: bool
