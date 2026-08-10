"""queue module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/queue", tags=["queue"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "queue", "status": "stub"}
