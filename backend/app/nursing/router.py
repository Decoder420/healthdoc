"""nursing module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/nursing", tags=["nursing"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "nursing", "status": "stub"}
