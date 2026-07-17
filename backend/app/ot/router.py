"""ot module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/ot", tags=["ot"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "ot", "status": "stub"}
