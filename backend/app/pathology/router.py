"""pathology module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/pathology", tags=["pathology"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "pathology", "status": "stub"}
