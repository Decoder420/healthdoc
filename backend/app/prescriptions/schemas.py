"""
Request/response shapes for the e-prescription API (#182).
Mirrors radiology/schemas.py pattern - snake_case, header + nested items.
"""
import uuid
from datetime import datetime
from pydantic import BaseModel


class PrescriptionItemCreate(BaseModel):
    """One drug line, nested inside POST /prescriptions body."""
    medicine_item_id: uuid.UUID | None = None
    medicine_name: str
    dosage: str | None = None
    frequency: str | None = None
    duration_days: int | None = None
    route: str | None = None
    instructions: str | None = None


class PrescriptionItemOut(BaseModel):
    id: uuid.UUID
    prescription_id: uuid.UUID
    medicine_item_id: uuid.UUID | None
    medicine_name: str
    dosage: str | None
    frequency: str | None
    duration_days: int | None
    route: str | None
    instructions: str | None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class PrescriptionCreate(BaseModel):
    """Body for POST /prescriptions"""
    encounter_id: uuid.UUID
    patient_id: uuid.UUID
    notes: str | None = None
    items: list[PrescriptionItemCreate]


class PrescriptionOut(BaseModel):
    id: uuid.UUID
    encounter_id: uuid.UUID
    patient_id: uuid.UUID
    notes: str | None
    created_at: datetime
    items: list[PrescriptionItemOut]

    class Config:
        from_attributes = True
