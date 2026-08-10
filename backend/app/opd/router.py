"""opd module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/opd", tags=["opd"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "opd", "status": "stub"}
