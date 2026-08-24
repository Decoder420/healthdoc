"""Request and response contracts for procedure records."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.common.enums import ProcedureSetting


class ProcedureCreate(BaseModel):
    """Create the clinical detail row for an existing procedure order.

    Encounter, patient and performer are intentionally absent: the server
    derives them from the facility-scoped order and authenticated user.
    """

    order_id: UUID
    procedure_name: str = Field(min_length=1)
    procedure_code: str | None = Field(default=None, max_length=30)
    code_system: str | None = Field(default=None, max_length=30)
    setting: ProcedureSetting
    ot_schedule_id: UUID | None = None
    assisted_by: UUID | None = None
    started_at: datetime | None = None
    ended_at: datetime | None = None
    outcome: str | None = None
    complications: str | None = None

    @model_validator(mode="after")
    def validate_procedure(self) -> ProcedureCreate:
        self.procedure_name = self.procedure_name.strip()
        if not self.procedure_name:
            raise ValueError("procedure_name must not be blank")
        if self.ot_schedule_id is not None and self.setting != ProcedureSetting.OT:
            raise ValueError("ot_schedule_id is only valid when setting is ot")
        if (
            self.started_at is not None
            and self.ended_at is not None
            and self.ended_at < self.started_at
        ):
            raise ValueError("ended_at must not be before started_at")
        return self


class ProcedureOut(BaseModel):
    id: UUID
    order_id: UUID | None
    encounter_id: UUID
    patient_id: UUID
    procedure_name: str
    procedure_code: str | None
    code_system: str | None
    setting: ProcedureSetting
    ot_schedule_id: UUID | None
    performed_by: UUID
    assisted_by: UUID | None
    started_at: datetime | None
    ended_at: datetime | None
    outcome: str | None
    complications: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProcedureListOut(BaseModel):
    items: list[ProcedureOut]
