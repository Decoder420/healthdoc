"""ipd module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/ipd", tags=["ipd"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "ipd", "status": "stub"}
