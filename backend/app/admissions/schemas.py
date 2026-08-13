"""backend/app/admissions/schemas.py -- request/response models for #216
(B3-W5-01): IPD admission and transfers. Discharge schemas land in the
follow-up PR that adds discharge_patient()."""
from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class AdmissionCreate(BaseModel):
    visit_id: UUID
    ward_id: UUID
    bed_id: UUID
    reason: str | None = None
    admitted_at: datetime | None = None


class AdmissionOut(BaseModel):
    id: UUID
    visit_id: UUID
    patient_id: UUID
    ward_id: UUID
    bed_id: UUID
    admitted_at: datetime
    reason: str | None
    status: str
    model_config = {"from_attributes": True}


class TransferRequest(BaseModel):
    to_ward_id: UUID
    to_bed_id: UUID
    reason: str | None = None
