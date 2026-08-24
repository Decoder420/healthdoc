"""backend/app/encounters/router.py -- /encounters endpoints.

created_by/updated_by come from current_db_user, never the request body (same
rule as opd/router.py). That sentence has been at the top of this file all
along and create_encounter did not follow it: it passed the payload straight to
the service, which wrote payload.created_by, payload.provider_user_id and a
facility copied from an unscoped visit lookup.

A note on how that survived review. `create_review` further down this same file
does it correctly — `reviewed_by=current_db_user.id, created_by=current_db_user.id`
— so the module contains a correct example of the rule sitting twenty lines
below a violation of it. Reading either one alone looks fine.
"""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status as http_status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentDbUser, require_roles
from app.common.db import get_db
from app.encounters import service
from app.encounters.schemas import (
    DiagnosisCreate, DiagnosisOut, DoctorReviewCreate, DoctorReviewOut,
    DoctorReviewStatusUpdate, EncounterCreate, EncounterOut, EncounterUpdate,
)

router = APIRouter(prefix="/encounters", tags=["encounters"])


async def _get_scoped_encounter(db: AsyncSession, encounter_id: UUID, caller_facility_id):
    """One encounter, or 404 — including when it exists at another facility.

    Every handler below routes through this. Before it, the whole module fetched
    by id with no facility comparison at all: any doctor, nurse or receptionist
    could read another hospital's consultation note, and PATCH could rewrite it.
    encounters.facility_id has existed since 0021; nothing was reading it.

    404 rather than 403 — 403 confirms the id exists, which is enough to
    enumerate another facility's encounters.
    """
    encounter = await service.get_encounter(db, encounter_id)
    if encounter is None or encounter.facility_id != caller_facility_id:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="encounter_not_found")
    return encounter



@router.post("", response_model=EncounterOut, status_code=http_status.HTTP_201_CREATED,
             dependencies=[Depends(require_roles("doctor", "nurse", "admin"))])
async def create_encounter(payload: EncounterCreate, current_db_user: CurrentDbUser,
                            db: AsyncSession = Depends(get_db)) -> EncounterOut:
    """Open an encounter.

    This handler took `current_db_user` and never referenced it. Authorship,
    facility scope and the attending clinician all came from the request body,
    while line 1 of this file states the opposite rule. The docstring was the
    specification; the code was the bug.
    """
    try:
        encounter = await service.create_encounter(
            db, payload, actor_id=current_db_user.id, facility_id=current_db_user.facility_id,
        )
    except service.VisitNotFound:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="visit_not_found")
    except service.ProviderNotInFacility:
        raise HTTPException(
            status_code=http_status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="provider_not_in_facility",
        )
    return EncounterOut.model_validate(encounter)


@router.get("/{encounter_id}", response_model=EncounterOut,
            dependencies=[Depends(require_roles("doctor", "nurse", "receptionist", "admin"))])
async def get_encounter(encounter_id: UUID, current_db_user: CurrentDbUser,
                         db: AsyncSession = Depends(get_db)) -> EncounterOut:
    encounter = await _get_scoped_encounter(db, encounter_id, current_db_user.facility_id)
    return EncounterOut.model_validate(encounter)


@router.patch("/{encounter_id}", response_model=EncounterOut,
              dependencies=[Depends(require_roles("doctor", "admin"))])
async def update_encounter(encounter_id: UUID, payload: EncounterUpdate, current_db_user: CurrentDbUser,
                            db: AsyncSession = Depends(get_db)) -> EncounterOut:
    encounter = await _get_scoped_encounter(db, encounter_id, current_db_user.facility_id)
    encounter = await service.update_encounter(db, encounter, payload, actor_id=current_db_user.id)
    return EncounterOut.model_validate(encounter)


@router.post("/{encounter_id}/diagnoses", response_model=DiagnosisOut, status_code=http_status.HTTP_201_CREATED,
             dependencies=[Depends(require_roles("doctor", "admin"))])
async def create_diagnosis(encounter_id: UUID, payload: DiagnosisCreate, current_db_user: CurrentDbUser,
                            db: AsyncSession = Depends(get_db)) -> DiagnosisOut:
    if payload.encounter_id != encounter_id:
        raise HTTPException(status_code=http_status.HTTP_400_BAD_REQUEST, detail="encounter_id_mismatch")
    await _get_scoped_encounter(db, encounter_id, current_db_user.facility_id)
    diagnosis = await service.create_diagnosis(db, payload, actor_id=current_db_user.id)
    return DiagnosisOut.model_validate(diagnosis)


@router.get("/{encounter_id}/diagnoses", response_model=list[DiagnosisOut],
            dependencies=[Depends(require_roles("doctor", "nurse", "receptionist", "admin"))])
async def list_diagnoses(encounter_id: UUID, current_db_user: CurrentDbUser,
                          db: AsyncSession = Depends(get_db)) -> list[DiagnosisOut]:
    await _get_scoped_encounter(db, encounter_id, current_db_user.facility_id)
    diagnoses = await service.list_diagnoses(db, encounter_id)
    return [DiagnosisOut.model_validate(d) for d in diagnoses]



@router.post("/{encounter_id}/reviews", response_model=DoctorReviewOut, status_code=http_status.HTTP_201_CREATED,
             dependencies=[Depends(require_roles("doctor", "admin"))])
async def create_review(encounter_id: UUID, payload: DoctorReviewCreate, current_db_user: CurrentDbUser,
                         db: AsyncSession = Depends(get_db)) -> DoctorReviewOut:
    """#200: doctor 'receives' the result(s) for this encounter by opening a
    review row -- starts at status='pending'. Optionally scoped to one
    incoming lab/radiology item; leave both null for a general
    encounter sign-off."""
    await _get_scoped_encounter(db, encounter_id, current_db_user.facility_id)
    try:
        review = await service.create_review(
            db,
            encounter_id=encounter_id,
            reviewed_by=current_db_user.id,
            created_by=current_db_user.id,
            lab_order_item_id=payload.lab_order_item_id,
            radiology_order_item_id=payload.radiology_order_item_id,
            notes=payload.notes,
        )
    except service.EncounterNotFound:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="encounter_not_found")
    return DoctorReviewOut.model_validate(review)


@router.get("/{encounter_id}/reviews", response_model=list[DoctorReviewOut],
            dependencies=[Depends(require_roles("doctor", "nurse", "receptionist", "admin"))])
async def list_reviews(encounter_id: UUID, current_db_user: CurrentDbUser,
                        db: AsyncSession = Depends(get_db)) -> list[DoctorReviewOut]:
    await _get_scoped_encounter(db, encounter_id, current_db_user.facility_id)
    reviews = await service.list_reviews(db, encounter_id)
    return [DoctorReviewOut.model_validate(r) for r in reviews]


@router.patch("/reviews/{review_id}", response_model=DoctorReviewOut,
              dependencies=[Depends(require_roles("doctor", "admin"))])
async def update_review(review_id: UUID, payload: DoctorReviewStatusUpdate, current_db_user: CurrentDbUser,
                         db: AsyncSession = Depends(get_db)) -> DoctorReviewOut:
    """Sign-off transition: pending -> reviewed -> signed_off, one step at
    a time. 404 unknown review, 409 on an invalid/backward/skip transition
    (includes re-signing an already signed_off review)."""
    review = await service.get_review(db, review_id)
    if review is None or review.facility_id != current_db_user.facility_id:
        # Signing off another facility's clinical review is a clinical act
        # attributed to the wrong hospital. 404, not 403 — see
        # _get_scoped_encounter.
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="review_not_found")

    try:
        review = await service.update_review_status(
            db, review, new_status=payload.status, updated_by=current_db_user.id, notes=payload.notes,
        )
    except service.InvalidReviewTransition as exc:
        raise HTTPException(
            status_code=http_status.HTTP_409_CONFLICT,
            detail={
                "code": "invalid_review_transition",
                "message": f"Cannot move review from '{exc.current_status}' to '{exc.requested_status}'",
            },
        )
    return DoctorReviewOut.model_validate(review)
