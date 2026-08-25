"""Real PostgreSQL proof that grievance numbering cannot race."""
from __future__ import annotations

import asyncio
from datetime import UTC, datetime, timedelta

from app.dpdp import service
from app.dpdp.schemas import GrievanceCreate


async def test_concurrent_grievances_receive_distinct_server_numbers(
    session_factory, facility_id, user_id, patient_id
):
    async def create_one(suffix: str) -> str:
        async with session_factory() as db:
            row = await service.create_grievance(
                db,
                payload=GrievanceCreate(
                    patient_id=patient_id,
                    grievance_type="access",
                    description=f"Concurrent grievance {suffix}",
                    due_at=datetime.now(UTC) + timedelta(days=2),
                ),
                facility_id=facility_id,
                actor_id=user_id,
            )
            await db.commit()
            return row.grievance_number

    numbers = await asyncio.gather(create_one("A"), create_one("B"))
    assert len(set(numbers)) == 2
    assert sorted(number.rsplit("-", 1)[1] for number in numbers) == ["0001", "0002"]
