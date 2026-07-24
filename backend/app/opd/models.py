"""
backend/app/opd/models.py

SQLAlchemy model for the visits table (schema doc §3, migration 0007).
If your project already has this file, compare column-by-column instead
of overwriting -- don't blindly replace an existing model.
"""
import uuid

from sqlalchemy import Column, ForeignKey, String, Text, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.common.db import Base


class Visit(Base):
    __tablename__ = "visits"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.uuid_generate_v4(),
    )
    visit_number = Column(String(30), unique=True, nullable=False)
    patient_id = Column(
        UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False
    )
    facility_id = Column(
        UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=False
    )
    department_id = Column(
        UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True
    )
    visit_type = Column(String(30), nullable=False)
    status = Column(String(30), nullable=False, server_default="registered")
    visit_date = Column(DateTime(timezone=True), nullable=False)

    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (
        CheckConstraint(
            "visit_type IN ('opd', 'ipd', 'emergency', 'teleconsult')",
            name="ck_visits_visit_type",
        ),
        CheckConstraint(
            "status IN ('registered', 'in_consultation', 'completed', "
            "'lwbs', 'cancelled')",
            name="ck_visits_status",
        ),
    )