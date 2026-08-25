"""Clinical procedure routes backed by procedure_records."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentDbUser, require_roles
from app.common.db import get_db
from app.common.idempotency import (
    check_idempotency,
    hash_request_body,
    record_idempotent_response,
)
from app.procedures import service
from app.procedures.schemas import ProcedureCreate, ProcedureListOut, ProcedureOut

router = APIRouter(prefix="/procedures", tags=["procedures"])
_CREATE_ENDPOINT = "POST /procedures"


async def _require_idempotency_key(
    idempotency_key: Annotated[str | None, Header(alias="Idempotency-Key")] = None,
) -> str:
    if not idempotency_key:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            {
                "code": "missing_idempotency_key",
                "message": "Idempotency-Key header is required for this endpoint",
            },
        )
    return idempotency_key


@router.post(
    "",
    response_model=ProcedureOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles("doctor", "nurse", "emergency"))],
)
async def create_procedure(
    payload: ProcedureCreate,
    current_db_user: CurrentDbUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    idempotency_key: Annotated[str, Depends(_require_idempotency_key)],
) -> ProcedureOut:
    request_hash = hash_request_body(payload)
    cached = await check_idempotency(
        db,
        idempotency_key,
        _CREATE_ENDPOINT,
        request_hash,
        current_db_user.id,
    )
    if cached is not None:
        return ProcedureOut.model_validate(cached.response_body)

    try:
        procedure = await service.create_procedure(
            db,
            payload,
            facility_id=current_db_user.facility_id,
            performed_by=current_db_user.id,
        )
    except service.ProcedureOrderNotFound:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "procedure_order_not_found") from None
    except service.ProcedureOrderTypeMismatch:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            {
                "code": "order_type_mismatch",
                "message": "A procedure record requires order_type=procedure",
            },
        ) from None
    except service.ProcedureAlreadyExists:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            {
                "code": "procedure_already_exists",
                "message": "This order already has a procedure record",
            },
        ) from None
    except service.ProcedureAssistantNotFound:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "assistant_not_found") from None
    except service.ProcedureOtScheduleNotFound:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "ot_schedule_not_found") from None

    response = ProcedureOut.model_validate(procedure)
    await record_idempotent_response(
        db,
        idempotency_key,
        _CREATE_ENDPOINT,
        status.HTTP_201_CREATED,
        response.model_dump(mode="json"),
        current_db_user.id,
    )
    return response


@router.get(
    "",
    response_model=ProcedureListOut,
    dependencies=[Depends(require_roles("doctor", "nurse", "emergency", "admin"))],
)
async def list_procedures(
    current_db_user: CurrentDbUser,
    encounter_id: Annotated[UUID, Query()],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ProcedureListOut:
    rows = await service.list_procedures_for_encounter(
        db,
        encounter_id=encounter_id,
        facility_id=current_db_user.facility_id,
    )
    return ProcedureListOut(items=[ProcedureOut.model_validate(row) for row in rows])
