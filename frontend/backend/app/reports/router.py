"""reports module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "reports", "status": "stub"}
