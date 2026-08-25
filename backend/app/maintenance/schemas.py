"""Request and response contracts for equipment maintenance evidence."""
from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

MaintenanceType = Literal["preventive", "breakdown", "calibration", "qa_check"]


class MaintenanceLogCreate(BaseModel):
    machine_id: str = Field(min_length=1, max_length=50)
    department_id: uuid.UUID
    maintenance_type: MaintenanceType
    performed_at: datetime
    performed_by_vendor: str | None = Field(default=None, max_length=500)
    downtime_minutes: int | None = Field(default=None, ge=0)
    notes: str | None = Field(default=None, max_length=10_000)

    @field_validator("machine_id", "performed_by_vendor", "notes")
    @classmethod
    def strip_non_blank_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        if not normalized:
            raise ValueError("must not be blank")
        return normalized

    @field_validator("performed_at")
    @classmethod
    def performed_at_must_be_past_or_present(cls, value: datetime) -> datetime:
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError("performed_at must include a timezone")
        if value > datetime.now(UTC):
            raise ValueError("performed_at cannot be in the future")
        return value


class MaintenanceLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    machine_id: str
    department_id: uuid.UUID
    maintenance_type: str
    performed_at: datetime
    performed_by_vendor: str | None
    downtime_minutes: int | None
    notes: str | None
    created_by: uuid.UUID
    updated_by: uuid.UUID | None
    created_at: datetime
    updated_at: datetime


class MaintenanceLogListOut(BaseModel):
    items: list[MaintenanceLogOut]
    page: int
    page_size: int
    total: int
