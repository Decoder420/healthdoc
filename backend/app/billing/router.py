"""billing module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/billing", tags=["billing"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "billing", "status": "stub"}
