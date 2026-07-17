"""files module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/files", tags=["files"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "files", "status": "stub"}
