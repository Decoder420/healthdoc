"""consent module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/consent", tags=["consent"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "consent", "status": "stub"}
