"""audit module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "audit", "status": "stub"}
