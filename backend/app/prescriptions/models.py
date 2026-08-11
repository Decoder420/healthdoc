from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.common.models import UUIDPk, Timestamps, Blame
from app.common.db import Base


class Prescription(Base, UUIDPk, Timestamps, Blame):
    __tablename__ = "prescriptions"

    encounter_id = Column(UUID(as_uuid=True), ForeignKey("encounters.id", ondelete="RESTRICT"),
                           nullable=False, index=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="RESTRICT"),
                         nullable=False, index=True)
    notes = Column(Text, nullable=True)


class PrescriptionItem(Base, UUIDPk, Timestamps):
    __tablename__ = "prescription_items"

    prescription_id = Column(UUID(as_uuid=True), ForeignKey("prescriptions.id", ondelete="CASCADE"),
                              nullable=False, index=True)
    medicine_item_id = Column(UUID(as_uuid=True), nullable=True)  # FK added in 0012
    medicine_name = Column(Text, nullable=False)
    dosage = Column(String(50), nullable=True)
    frequency = Column(String(50), nullable=True)
    duration_days = Column(Integer, nullable=True)
    route = Column(String(30), nullable=True)
    instructions = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, server_default="prescribed")
