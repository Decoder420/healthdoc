from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentDbUser
from app.common.db import get_db
from app.common.modules import get_capabilities

router = APIRouter(prefix="/facility", tags=["facility"])


@router.get("/capabilities")
async def facility_capabilities(
    current_db_user: CurrentDbUser,
    db: AsyncSession = Depends(get_db),
) -> dict:
    modules = await get_capabilities(db, current_db_user.facility_id)
    return {
        "modules": modules,
        "config": {module_code: {} for module_code in modules},
    }
