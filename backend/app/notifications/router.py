"""notifications module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "notifications", "status": "stub"}
