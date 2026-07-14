"""outbox module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/outbox", tags=["outbox"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "outbox", "status": "stub"}
