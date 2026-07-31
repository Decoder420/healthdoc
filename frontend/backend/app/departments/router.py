"""departments module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/departments", tags=["departments"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "departments", "status": "stub"}
