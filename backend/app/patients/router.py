"""patients module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "patients", "status": "stub"}
