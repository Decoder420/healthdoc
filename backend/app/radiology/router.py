"""radiology module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/radiology", tags=["radiology"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "radiology", "status": "stub"}
