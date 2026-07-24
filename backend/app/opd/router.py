"""
backend/app/opd/router.py

/visits endpoints. Response fields follow §4.4 of the schema doc.
"""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status as http_status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import require_roles, get_current_user
from app.common.db import get_db
from app.opd import service
from app.opd.schemas import VisitCreate, VisitOut, VisitStatusUpdate

router = APIRouter(prefix="/visits", tags=["visits"])


@router.post("", response_model=VisitOut, status_code=http_status.HTTP_201_CREATED)
async def create_visit(
    payload: VisitCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles("receptionist", "admin")),
):
    facility_code = await _get_facility_code(db, payload.facility_id)
    next_sequence = await _next_visit_sequence(db, payload.facility_id)

    visit = await service.create_visit(
        db=db,
        payload=payload,
        facility_code=facility_code,
        next_sequence=next_sequence,
        created_by=current_user.id,
    )
    await db.commit()
    return visit


@router.get("/{visit_id}", response_model=VisitOut)
async def get_visit(
    visit_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    visit = await service.get_visit(db, visit_id)
    if visit is None:
        raise HTTPException(status_code=404, detail="Visit not found")
    return visit


@router.patch("/{visit_id}/status", response_model=VisitOut)
async def update_visit_status(
    visit_id: UUID,
    payload: VisitStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles("doctor", "receptionist", "admin")),
):
    visit = await service.get_visit(db, visit_id)
    if visit is None:
        raise HTTPException(status_code=404, detail="Visit not found")

    try:
        visit = await service.transition_visit_status(
            db=db,
            visit=visit,
            target_status=payload.status,
            reason=payload.reason,
            updated_by=current_user.id,
        )
    except service.InvalidVisitTransition as exc:
        raise HTTPException(
            status_code=409,
            detail={"code": "invalid_visit_transition", "message": str(exc)},
        ) from exc
    except service.MissingTransitionReason as exc:
        raise HTTPException(
            status_code=422,
            detail={"code": "reason_required", "message": str(exc)},
        ) from exc

    await db.commit()
    return visit


async def _get_facility_code(db: AsyncSession, facility_id: UUID) -> str:
    """Look up facilities.code for the given facility_id (§3-0002)."""
    raise NotImplementedError("Wire this to your facilities table lookup")


async def _next_visit_sequence(db: AsyncSession, facility_id: UUID) -> int:
    """Allocate the next gapless sequence number (§3-0014 pattern)."""
    raise NotImplementedError("Wire this to your sequence/counter service")
