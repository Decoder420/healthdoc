import uuid
from datetime import datetime
from typing import Any, Dict
from pydantic import BaseModel, ConfigDict


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


class NotificationPreferenceSet(BaseModel):
    role: str
    event_type: str
    is_enabled: bool
 
 
class NotificationPreferenceOut(BaseModel):
    id: uuid.UUID
    facility_id: uuid.UUID
    role: str
    event_type: str
    is_enabled: bool
    created_at: datetime
    updated_at: datetime
 
    model_config = ConfigDict(from_attributes=True)
 
 
class NotificationPreferenceListOut(BaseModel):
    items: list[NotificationPreferenceOut]
