"""registration module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/registration", tags=["registration"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "registration", "status": "stub"}
