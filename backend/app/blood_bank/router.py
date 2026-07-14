"""blood_bank module router — endpoints land here; see this module's GitHub issues."""
from fastapi import APIRouter

router = APIRouter(prefix="/blood-bank", tags=["blood_bank"])


@router.get("/ping")
async def ping() -> dict:
    return {"module": "blood_bank", "status": "stub"}
