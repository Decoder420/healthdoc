# backend/scripts/seed_demo_251.py
"""
Demo seed for issue #251 — nurse recording (vitals), for the #250 demo chain.
Scope: vitals only, no pharmacy dispense (nursing/pharmacy are separate
modules per app/nursing/models.py and app/pharmacy/models.py).

Prerequisite: seed_dev_data.py must already have run (creates the facility
and dev.nurse user this script attaches to).

Run with:
    docker compose -f infra/docker-compose.yml --env-file .env exec backend \
        python scripts/seed_demo_251.py
"""
from __future__ import annotations

import asyncio
import uuid
from datetime import datetime, timezone

from sqlalchemy import select

from app.common.db import SessionLocal
from app.patients.models import Patient
from app.admissions.models import Ward, Bed, Admission
from app.opd.models import Visit, VisitNumberCounter
from app.nursing.models import Vitals
from app.users.models import User  # adjust import path if different
import app.departments.models  # noqa: F401 — registers 'departments' table for FK resolution
from app.common.enums import (
    Sex, IdentityPath, IdentityStatus, PatientStatus,
    VisitType, VisitStatus, AdmissionStatus, BedStatus,
)

FACILITY_ID = uuid.UUID("00000000-0000-0000-0000-000000000101")  # matches seed_dev_data.py

# Stable deterministic IDs so reruns update instead of duplicating
PATIENT_ID = uuid.uuid5(uuid.NAMESPACE_URL, "healthdoc:demo-251-patient")
WARD_ID = uuid.uuid5(uuid.NAMESPACE_URL, "healthdoc:demo-251-ward")
BED_ID = uuid.uuid5(uuid.NAMESPACE_URL, "healthdoc:demo-251-bed")
VISIT_ID = uuid.uuid5(uuid.NAMESPACE_URL, "healthdoc:demo-251-visit")
ADMISSION_ID = uuid.uuid5(uuid.NAMESPACE_URL, "healthdoc:demo-251-admission")


async def seed() -> None:
    async with SessionLocal() as session, session.begin():
        nurse = (
            await session.execute(select(User).where(User.username == "dev.nurse"))
        ).scalar_one_or_none()
        if nurse is None:
            raise RuntimeError(
                "dev.nurse user not found — run seed_dev_data.py --user dev.nurse=<sub> first"
            )

        # Patient
        patient = await session.get(Patient, PATIENT_ID)
        if patient is None:
            patient = Patient(
                id=PATIENT_ID,
                uhid="DEMO251",
                full_name="Demo Patient 251",
                sex=Sex.FEMALE.value,
                age_years=45,
                identity_path=IdentityPath.DEMOGRAPHICS_ONLY.value,
                identity_status=IdentityStatus.VERIFIED.value,
                status=PatientStatus.ACTIVE.value,
                facility_id=FACILITY_ID,
                created_by=nurse.id,
                updated_by=nurse.id,
            )
            session.add(patient)
            await session.flush()

        # Ward
        ward = await session.get(Ward, WARD_ID)
        if ward is None:
            ward = Ward(id=WARD_ID, name="Demo Ward", facility_id=FACILITY_ID, is_active=True)
            session.add(ward)
            await session.flush()

        # Bed
        bed = await session.get(Bed, BED_ID)
        if bed is None:
            bed = Bed(id=BED_ID, ward_id=WARD_ID, bed_number="D-01", status=BedStatus.OCCUPIED.value)
            session.add(bed)
            await session.flush()

        # Visit number counter + Visit
        visit = await session.get(Visit, VISIT_ID)
        if visit is None:
            visit = Visit(
                id=VISIT_ID,
                visit_number=f"DEMO-251-{datetime.now(timezone.utc):%Y%m%d}",
                patient_id=PATIENT_ID,
                facility_id=FACILITY_ID,
                visit_type=VisitType.IPD.value,
                status="completed",
                visit_date=datetime.now(timezone.utc),
                created_by=nurse.id,
                updated_by=nurse.id,
            )
            session.add(visit)
            await session.flush()

        # Admission
        admission = await session.get(Admission, ADMISSION_ID)
        if admission is None:
            admission = Admission(
                id=ADMISSION_ID,
                visit_id=VISIT_ID,
                patient_id=PATIENT_ID,
                ward_id=WARD_ID,
                bed_id=BED_ID,
                admitted_at=datetime.now(timezone.utc),
                reason="Demo admission for #251 nurse recording",
                status=AdmissionStatus.ADMITTED.value,
                created_by=nurse.id,
                updated_by=nurse.id,
            )
            session.add(admission)
            await session.flush()

        # Vitals — the actual nurse recording
        vitals = Vitals(
            admission_id=ADMISSION_ID,
            encounter_id=None,
            patient_id=PATIENT_ID,
            measured_at=datetime.now(timezone.utc),
            temp_c=37.1,
            pulse_bpm=78,
            resp_rate=16,
            bp_systolic=118,
            bp_diastolic=76,
            spo2_pct=98,
            pain_score=1,
            created_by=nurse.id,
            updated_by=nurse.id,
        )
        session.add(vitals)

    print(f"Seeded demo patient {PATIENT_ID}, admission {ADMISSION_ID}, vitals recorded.")


if __name__ == "__main__":
    asyncio.run(seed())