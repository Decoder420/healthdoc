"""ICD search used by the consultation diagnosis picker.

The WHO ICD service is optional.  ICD11Client falls back to the local
``icd_codes`` catalogue, so losing that container never blocks a consultation.
"""
from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import require_roles
from app.common.db import get_db
from app.integrations.icd11.client import ICD11Client

router = APIRouter(prefix="/diagnoses", tags=["diagnoses"])
_client = ICD11Client()


class IcdConceptOut(BaseModel):
    code: str
    title: str
    icd_uri: str | None = None
    is_postcoordinable: bool = False
    version: str


class IcdSearchOut(BaseModel):
    items: list[IcdConceptOut]
    source: Literal["who_api", "local_catalog", "unavailable"]


@router.get(
    "/icd-search",
    response_model=IcdSearchOut,
    dependencies=[Depends(require_roles("doctor", "admin"))],
)
async def search_icd(
    q: str = Query(..., min_length=1, max_length=100),
    limit: int = Query(default=20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
) -> IcdSearchOut:
    result = await _client.search(q.strip(), db=db, limit=limit)
    return IcdSearchOut.model_validate(result)
