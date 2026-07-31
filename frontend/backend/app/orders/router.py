"""orders module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "orders", "status": "stub"}
