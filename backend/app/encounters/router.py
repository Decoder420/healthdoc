"""encounters module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/encounters", tags=["encounters"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "encounters", "status": "stub"}
