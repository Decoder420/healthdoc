"""emergency module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/emergency", tags=["emergency"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "emergency", "status": "stub"}
