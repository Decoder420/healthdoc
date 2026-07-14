"""wards module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/wards", tags=["wards"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "wards", "status": "stub"}
