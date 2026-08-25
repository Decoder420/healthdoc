"""Facility-safe DPDP governance APIs."""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentDbUser, require_roles
from app.common.db import get_db
from app.common.enums import GrievanceStatus, GrievanceType
from app.common.idempotency import (
    check_idempotency,
    hash_request_body,
    record_idempotent_response,
)
from app.dpdp import service
from app.dpdp.schemas import (
    ConsentManagerCreate,
    ConsentManagerOut,
    ConsentManagerUpdate,
    DpoAppointmentCreate,
    DpoOut,
    GrievanceCreate,
    GrievanceListOut,
    GrievanceOut,
    GrievanceTransition,
)

router = APIRouter(prefix="/dpdp", tags=["dpdp"])
DbSession = Annotated[AsyncSession, Depends(get_db)]
IdempotencyHeader = Annotated[str | None, Header(alias="Idempotency-Key")]


def _require_key(value: str | None) -> str:
    if not value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Idempotency-Key header is required",
        )
    return value


def _raise_resource_not_found(exc: service.ResourceNotFound) -> None:
    raise HTTPException(status_code=404, detail=exc.code) from None


@router.post(
    "/dpo",
    response_model=DpoOut,
    status_code=201,
    dependencies=[Depends(require_roles("admin"))],
)
async def appoint_dpo(
    payload: DpoAppointmentCreate,
    user: CurrentDbUser,
    db: DbSession,
    idempotency_key: IdempotencyHeader = None,
) -> DpoOut:
    key = _require_key(idempotency_key)
    endpoint = "POST /dpdp/dpo"
    request_hash = hash_request_body(payload)
    cached = await check_idempotency(db, key, endpoint, request_hash, user.id)
    if cached is not None:
        return DpoOut.model_validate(cached.response_body)
    try:
        row = await service.appoint_dpo(
            db,
            payload=payload,
            facility_id=user.facility_id,
            actor_id=user.id,
        )
    except service.ResourceNotFound as exc:
        _raise_resource_not_found(exc)
    except service.DpoNotFound:
        raise HTTPException(status_code=404, detail="dpo_not_found") from None
    except service.DpoConflict as exc:
        raise HTTPException(status_code=409, detail={"code": exc.code}) from exc
    response = DpoOut.model_validate(row)
    await record_idempotent_response(
        db, key, endpoint, 201, response.model_dump(mode="json"), user.id
    )
    return response


@router.get(
    "/dpo",
    response_model=DpoOut,
    dependencies=[Depends(require_roles("admin", "auditor"))],
)
async def get_active_dpo(user: CurrentDbUser, db: DbSession) -> DpoOut:
    try:
        row = await service.get_active_dpo(db, facility_id=user.facility_id)
    except service.DpoNotFound:
        raise HTTPException(status_code=404, detail="dpo_not_found") from None
    return DpoOut.model_validate(row)


@router.get(
    "/dpo/history",
    response_model=list[DpoOut],
    dependencies=[Depends(require_roles("admin", "auditor"))],
)
async def list_dpo_history(user: CurrentDbUser, db: DbSession) -> list[DpoOut]:
    rows = await service.list_dpo_history(db, facility_id=user.facility_id)
    return [DpoOut.model_validate(row) for row in rows]


@router.post(
    "/dpo/{dpo_id}/deactivate",
    response_model=DpoOut,
    dependencies=[Depends(require_roles("admin"))],
)
async def deactivate_dpo(
    dpo_id: uuid.UUID,
    user: CurrentDbUser,
    db: DbSession,
    idempotency_key: IdempotencyHeader = None,
) -> DpoOut:
    key = _require_key(idempotency_key)
    endpoint = f"POST /dpdp/dpo/{dpo_id}/deactivate"
    payload = DpoAppointmentCreate(user_id=user.id)
    request_hash = hash_request_body(payload)
    cached = await check_idempotency(db, key, endpoint, request_hash, user.id)
    if cached is not None:
        return DpoOut.model_validate(cached.response_body)
    try:
        row = await service.deactivate_dpo(
            db, dpo_id=dpo_id, facility_id=user.facility_id, actor_id=user.id
        )
    except service.DpoNotFound:
        raise HTTPException(status_code=404, detail="dpo_not_found") from None
    except service.DpoConflict as exc:
        raise HTTPException(status_code=409, detail={"code": exc.code}) from exc
    response = DpoOut.model_validate(row)
    await record_idempotent_response(
        db, key, endpoint, 200, response.model_dump(mode="json"), user.id
    )
    return response


@router.post(
    "/grievances",
    response_model=GrievanceOut,
    status_code=201,
    dependencies=[Depends(require_roles("admin", "auditor", "receptionist"))],
)
async def create_grievance(
    payload: GrievanceCreate,
    user: CurrentDbUser,
    db: DbSession,
    idempotency_key: IdempotencyHeader = None,
) -> GrievanceOut:
    key = _require_key(idempotency_key)
    endpoint = "POST /dpdp/grievances"
    request_hash = hash_request_body(payload)
    cached = await check_idempotency(db, key, endpoint, request_hash, user.id)
    if cached is not None:
        return GrievanceOut.model_validate(cached.response_body)
    try:
        row = await service.create_grievance(
            db,
            payload=payload,
            facility_id=user.facility_id,
            actor_id=user.id,
        )
    except service.ResourceNotFound as exc:
        _raise_resource_not_found(exc)
    response = GrievanceOut.model_validate(row)
    await record_idempotent_response(
        db, key, endpoint, 201, response.model_dump(mode="json"), user.id
    )
    return response


@router.get(
    "/grievances",
    response_model=GrievanceListOut,
    dependencies=[Depends(require_roles("admin", "auditor"))],
)
async def list_grievances(
    user: CurrentDbUser,
    db: DbSession,
    patient_id: uuid.UUID | None = None,
    grievance_type: GrievanceType | None = None,
    grievance_status: GrievanceStatus | None = Query(default=None, alias="status"),
    due_before: datetime | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
) -> GrievanceListOut:
    rows, total = await service.list_grievances(
        db,
        facility_id=user.facility_id,
        patient_id=patient_id,
        grievance_type=grievance_type.value if grievance_type else None,
        status=grievance_status.value if grievance_status else None,
        due_before=due_before,
        page=page,
        page_size=page_size,
    )
    return GrievanceListOut(
        items=[GrievanceOut.model_validate(row) for row in rows],
        page=page,
        page_size=page_size,
        total=total,
    )


@router.get(
    "/grievances/{grievance_id}",
    response_model=GrievanceOut,
    dependencies=[Depends(require_roles("admin", "auditor"))],
)
async def get_grievance(
    grievance_id: uuid.UUID, user: CurrentDbUser, db: DbSession
) -> GrievanceOut:
    try:
        row = await service.get_grievance(
            db, grievance_id=grievance_id, facility_id=user.facility_id
        )
    except service.GrievanceNotFound:
        raise HTTPException(status_code=404, detail="grievance_not_found") from None
    return GrievanceOut.model_validate(row)


@router.post(
    "/grievances/{grievance_id}/transition",
    response_model=GrievanceOut,
    dependencies=[Depends(require_roles("admin", "auditor"))],
)
async def transition_grievance(
    grievance_id: uuid.UUID,
    payload: GrievanceTransition,
    user: CurrentDbUser,
    db: DbSession,
    idempotency_key: IdempotencyHeader = None,
) -> GrievanceOut:
    key = _require_key(idempotency_key)
    endpoint = f"POST /dpdp/grievances/{grievance_id}/transition"
    request_hash = hash_request_body(payload)
    cached = await check_idempotency(db, key, endpoint, request_hash, user.id)
    if cached is not None:
        return GrievanceOut.model_validate(cached.response_body)
    try:
        row = await service.transition_grievance(
            db,
            grievance_id=grievance_id,
            payload=payload,
            facility_id=user.facility_id,
            actor_id=user.id,
        )
    except service.GrievanceNotFound:
        raise HTTPException(status_code=404, detail="grievance_not_found") from None
    except service.ResourceNotFound as exc:
        _raise_resource_not_found(exc)
    except service.GrievanceConflict as exc:
        raise HTTPException(status_code=409, detail={"code": exc.code}) from exc
    response = GrievanceOut.model_validate(row)
    await record_idempotent_response(
        db, key, endpoint, 200, response.model_dump(mode="json"), user.id
    )
    return response


@router.post(
    "/consent-managers",
    response_model=ConsentManagerOut,
    status_code=201,
    dependencies=[Depends(require_roles("admin"))],
)
async def create_consent_manager(
    payload: ConsentManagerCreate,
    user: CurrentDbUser,
    db: DbSession,
    idempotency_key: IdempotencyHeader = None,
) -> ConsentManagerOut:
    key = _require_key(idempotency_key)
    endpoint = "POST /dpdp/consent-managers"
    request_hash = hash_request_body(payload)
    cached = await check_idempotency(db, key, endpoint, request_hash, user.id)
    if cached is not None:
        return ConsentManagerOut.model_validate(cached.response_body)
    try:
        row = await service.create_consent_manager(
            db,
            payload=payload,
            audit_facility_id=user.facility_id,
            actor_id=user.id,
        )
    except service.ConsentManagerConflict as exc:
        raise HTTPException(status_code=409, detail={"code": exc.code}) from exc
    response = ConsentManagerOut.model_validate(row)
    await record_idempotent_response(
        db, key, endpoint, 201, response.model_dump(mode="json"), user.id
    )
    return response


@router.get(
    "/consent-managers",
    response_model=list[ConsentManagerOut],
    # Auditors can read the rest of the governance register and the frontend
    # route is intentionally available to them. Keeping this one list
    # admin-only made that screen fail with 403 after its other reads passed.
    dependencies=[Depends(require_roles("admin", "auditor"))],
)
async def list_consent_managers(
    user: CurrentDbUser,
    db: DbSession,
    is_active: bool | None = None,
) -> list[ConsentManagerOut]:
    # The registry is global, but reading the resolved caller keeps the route
    # fail-closed and makes the authenticated facility boundary explicit.
    _ = user.facility_id
    rows = await service.list_consent_managers(db, is_active=is_active)
    return [ConsentManagerOut.model_validate(row) for row in rows]


@router.patch(
    "/consent-managers/{manager_id}",
    response_model=ConsentManagerOut,
    dependencies=[Depends(require_roles("admin"))],
)
async def update_consent_manager(
    manager_id: uuid.UUID,
    payload: ConsentManagerUpdate,
    user: CurrentDbUser,
    db: DbSession,
    idempotency_key: IdempotencyHeader = None,
) -> ConsentManagerOut:
    key = _require_key(idempotency_key)
    endpoint = f"PATCH /dpdp/consent-managers/{manager_id}"
    request_hash = hash_request_body(payload)
    cached = await check_idempotency(db, key, endpoint, request_hash, user.id)
    if cached is not None:
        return ConsentManagerOut.model_validate(cached.response_body)
    try:
        row = await service.update_consent_manager(
            db,
            manager_id=manager_id,
            payload=payload,
            audit_facility_id=user.facility_id,
            actor_id=user.id,
        )
    except service.ConsentManagerNotFound:
        raise HTTPException(status_code=404, detail="consent_manager_not_found") from None
    response = ConsentManagerOut.model_validate(row)
    await record_idempotent_response(
        db, key, endpoint, 200, response.model_dump(mode="json"), user.id
    )
    return response
