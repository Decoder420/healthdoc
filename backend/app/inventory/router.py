"""inventory module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "inventory", "status": "stub"}
