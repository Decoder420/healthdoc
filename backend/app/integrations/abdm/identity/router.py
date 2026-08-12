"""ABHA identity capture router — W6-01.

Repo path: backend/app/integrations/abdm/identity/router.py

Endpoints:
  POST   /patients/{patient_id}/abha  — link an ABHA number to a patient
  GET    /patients/{patient_id}/abha  — fetch linked ABHA details
  DELETE /patients/{patient_id}/abha  — unlink ABHA

Role rules:
  - link/unlink: receptionist | admin
  - read: doctor | nurse | receptionist | admin

facility_id always sourced from current_db_user — never from the payload.
"""
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentDbUser, require_roles
from app.common.db import get_db
from app.patients.models import Patient

router = APIRouter(prefix="/abdm/identity", tags=["abdm-identity"])


class AbhaLinkRequest(BaseModel):
    abha_number: str = Field(
        ...,
        min_length=14,
        max_length=17,
        description="14-digit ABHA number, with or without hyphens",
    )


class AbhaOut(BaseModel):
    patient_id: uuid.UUID
    abha_number: str | None

    model_config = {"from_attributes": True}


def _normalise_abha(raw: str) -> str:
    return raw.replace("-", "").strip()


async def _get_patient_or_404(
    db: AsyncSession, patient_id: uuid.UUID, facility_id: uuid.UUID
) -> Patient:
    patient = await db.get(Patient, patient_id)
    if patient is None or patient.deleted_at is not None:
        raise HTTPException(404, {"code": "patient_not_found"})
    if patient.facility_id != facility_id:
        raise HTTPException(404, {"code": "patient_not_found"})
    return patient


@router.get("/ping")
async def ping() -> dict:
    return {"module": "abdm-identity", "status": "ok"}


@router.post(
    "/patients/{patient_id}/abha",
    response_model=AbhaOut,
    status_code=201,
    dependencies=[Depends(require_roles("receptionist", "admin"))],
    summary="Link an ABHA number to a patient (W6-01)",
)
async def link_abha(
    patient_id: uuid.UUID,
    payload: AbhaLinkRequest,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> AbhaOut:
    patient = await _get_patient_or_404(db, patient_id, current_db_user.facility_id)
    normalised = _normalise_abha(payload.abha_number)

    existing = (
        await db.execute(
            select(Patient).where(
                Patient.abha_number == normalised,
                Patient.id != patient_id,
            )
        )
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(409, {
            "code": "duplicate_abha",
            "message": "This ABHA number is already linked to another patient",
        })

    if patient.abha_number and patient.abha_number != normalised:
        raise HTTPException(409, {
            "code": "abha_already_linked",
            "message": "Patient already has a different ABHA number linked. Unlink first.",
        })

    patient.abha_number = normalised
    patient.updated_by = current_db_user.id
    await db.flush()
    await db.refresh(patient)
    return AbhaOut(patient_id=patient.id, abha_number=patient.abha_number)


@router.get(
    "/patients/{patient_id}/abha",
    response_model=AbhaOut,
    dependencies=[Depends(require_roles("doctor", "nurse", "receptionist", "admin"))],
    summary="Get ABHA details for a patient (W6-01)",
)
async def get_abha(
    patient_id: uuid.UUID,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> AbhaOut:
    patient = await _get_patient_or_404(db, patient_id, current_db_user.facility_id)
    return AbhaOut(patient_id=patient.id, abha_number=patient.abha_number)


@router.delete(
    "/patients/{patient_id}/abha",
    response_model=AbhaOut,
    dependencies=[Depends(require_roles("receptionist", "admin"))],
    summary="Unlink ABHA number from a patient (W6-01)",
)
async def unlink_abha(
    patient_id: uuid.UUID,
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> AbhaOut:
    patient = await _get_patient_or_404(db, patient_id, current_db_user.facility_id)

    if patient.abha_number is None:
        raise HTTPException(409, {
            "code": "no_abha_linked",
            "message": "Patient has no ABHA number linked",
        })

    patient.abha_number = None
    patient.updated_by = current_db_user.id
    await db.flush()
    await db.refresh(patient)
    return AbhaOut(patient_id=patient.id, abha_number=None)
