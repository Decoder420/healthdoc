"""pharmacy module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/pharmacy", tags=["pharmacy"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "pharmacy", "status": "stub"}
