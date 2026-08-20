"""Clinical incident register — §3 0046, NABH DHS.

Distinct from `data_breach_notifications` (0022a), which is the DPDP/CERT-In
*data* incident path with its own 6-hour statutory clock. A patient fall and a
leaked record share the word "incident" and nothing else.

Nothing here deletes. An incident register that can be emptied is not a
register — the whole point is that it survives the shift it was written on.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    CheckConstraint, DateTime, ForeignKey, Index, String, Text, select,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from app.common.db import Base
from app.common.enums import (
    ClinicalIncidentSeverity, ClinicalIncidentStatus, ClinicalIncidentType,
)
from app.common.models import Blame, Timestamps, UUIDPk


class ClinicalIncident(Base, UUIDPk, Timestamps, Blame):
    __tablename__ = "clinical_incidents"
    __table_args__ = (
        CheckConstraint(ClinicalIncidentType.sql_check("incident_type"), name="incident_type"),
        CheckConstraint(ClinicalIncidentSeverity.sql_check("severity"), name="severity"),
        CheckConstraint(ClinicalIncidentStatus.sql_check("status"), name="status"),
        CheckConstraint("(reviewed_at IS NULL) = (reviewed_by IS NULL)", name="review_pair"),
        CheckConstraint(
            "status <> 'closed' OR (reviewed_at IS NOT NULL "
            "AND root_cause IS NOT NULL AND corrective_action IS NOT NULL)",
            name="closed_is_complete"),
        CheckConstraint("reported_at >= occurred_at", name="reported_after_occurred"),
        Index("ix_clinical_incidents_facility_status", "facility_id", "status", "occurred_at"),
    )

    facility_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("facilities.id", ondelete="RESTRICT"), nullable=False)
    department_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("departments.id", ondelete="RESTRICT"), nullable=True)
    ward_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("wards.id", ondelete="RESTRICT"), nullable=True)

    #: Nullable: a sharps injury to staff, or equipment found faulty before use,
    #: is reportable and has no patient. Requiring one would push staff to
    #: attribute incidents to whoever happened to be nearby.
    patient_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("patients.id", ondelete="RESTRICT"), nullable=True)
    admission_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("admissions.id", ondelete="RESTRICT"), nullable=True)

    incident_type: Mapped[str] = mapped_column(String(50), nullable=False)

    #: Harm that REACHED the patient, not harm risked. near_miss is a type.
    severity: Mapped[str] = mapped_column(String(30), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, server_default="reported")

    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    reported_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    description: Mapped[str] = mapped_column(Text, nullable=False)
    #: Required. An incident with no recorded response is the one a review
    #: cannot defend.
    immediate_action: Mapped[str] = mapped_column(Text, nullable=False)

    reported_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    reviewed_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    root_cause: Mapped[str | None] = mapped_column(Text, nullable=True)
    corrective_action: Mapped[str | None] = mapped_column(Text, nullable=True)


class IncidentNotFound(Exception):
    def __init__(self, incident_id: uuid.UUID) -> None:
        self.incident_id = incident_id


class IncidentClosureIncomplete(Exception):
    """Closing needs a root cause and a corrective action."""


async def report_incident(
    db: AsyncSession, *, facility_id: uuid.UUID, reported_by: uuid.UUID, **fields
) -> ClinicalIncident:
    """File an incident. Always starts `reported`.

    `reported_at` defaults to now but the caller may pass it: an incident
    written up at the end of a shift still occurred when it occurred, and
    0046's CHECK only requires reported_at >= occurred_at.
    """
    incident = ClinicalIncident(
        id=uuid.uuid4(),
        facility_id=facility_id,
        status=ClinicalIncidentStatus.REPORTED.value,
        reported_by=reported_by,
        created_by=reported_by,
        reported_at=fields.pop("reported_at", None) or datetime.now(timezone.utc),
        **fields,
    )
    db.add(incident)
    await db.flush()
    await db.refresh(incident)
    return incident


async def list_incidents(
    db: AsyncSession,
    facility_id: uuid.UUID,
    *,
    status: str | None = None,
    patient_id: uuid.UUID | None = None,
) -> list[ClinicalIncident]:
    """The register for one facility, most recent occurrence first."""
    stmt = select(ClinicalIncident).where(ClinicalIncident.facility_id == facility_id)
    if status is not None:
        stmt = stmt.where(ClinicalIncident.status == status)
    if patient_id is not None:
        stmt = stmt.where(ClinicalIncident.patient_id == patient_id)
    rows = await db.execute(stmt.order_by(ClinicalIncident.occurred_at.desc()))
    return list(rows.scalars().all())


async def review_incident(
    db: AsyncSession,
    incident_id: uuid.UUID,
    *,
    status: str,
    reviewed_by: uuid.UUID,
    root_cause: str | None = None,
    corrective_action: str | None = None,
) -> ClinicalIncident:
    """Advance an incident through review.

    Closing requires both a root cause and a corrective action — enforced here
    so the caller gets a named 422, and again by 0046's CHECK so nothing
    writing around this function can close an empty investigation. A register
    of closed incidents with no findings teaches nobody anything.
    """
    incident = await db.get(ClinicalIncident, incident_id)
    if incident is None:
        raise IncidentNotFound(incident_id)

    if status == ClinicalIncidentStatus.CLOSED.value:
        effective_cause = root_cause or incident.root_cause
        effective_action = corrective_action or incident.corrective_action
        if not (effective_cause and effective_cause.strip()) or not (
                effective_action and effective_action.strip()):
            raise IncidentClosureIncomplete(
                "closing an incident requires both root_cause and corrective_action")

    incident.status = status
    if root_cause is not None:
        incident.root_cause = root_cause
    if corrective_action is not None:
        incident.corrective_action = corrective_action
    incident.reviewed_by = reviewed_by
    incident.reviewed_at = datetime.now(timezone.utc)
    incident.updated_by = reviewed_by

    await db.flush()
    await db.refresh(incident)
    return incident
