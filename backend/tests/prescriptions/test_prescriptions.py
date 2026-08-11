import uuid

from sqlalchemy import select

from app.audit.models import AuditLog
from tests.prescriptions.conftest import DOCTOR, NURSE


def test_create_prescription_success(client_as, seeded_encounter_and_patient):
    encounter_id, patient_id = seeded_encounter_and_patient
    client = client_as(DOCTOR)
    resp = client.post(
        "/api/v1/prescriptions",
        json={
            "encounter_id": encounter_id,
            "patient_id": patient_id,
            "notes": "take with food",
            "items": [
                {"medicine_name": "Paracetamol", "dosage": "500mg",
                 "frequency": "twice daily", "duration_days": 5},
                {"medicine_name": "Amoxicillin", "dosage": "250mg",
                 "frequency": "thrice daily", "duration_days": 7},
            ],
        },
    )
    assert resp.status_code == 201
    body = resp.json()["data"]
    assert body["encounter_id"] == encounter_id
    assert body["notes"] == "take with food"
    assert len(body["items"]) == 2
    assert body["items"][0]["status"] == "prescribed"


def test_create_prescription_missing_encounter_404(client_as, seeded_encounter_and_patient):
    _, patient_id = seeded_encounter_and_patient
    client = client_as(DOCTOR)
    resp = client.post(
        "/api/v1/prescriptions",
        json={
            "encounter_id": str(uuid.uuid4()),
            "patient_id": patient_id,
            "items": [{"medicine_name": "Paracetamol"}],
        },
    )
    assert resp.status_code == 404


def test_create_prescription_empty_items_422(client_as, seeded_encounter_and_patient):
    encounter_id, patient_id = seeded_encounter_and_patient
    client = client_as(DOCTOR)
    resp = client.post(
        "/api/v1/prescriptions",
        json={"encounter_id": encounter_id, "patient_id": patient_id, "items": []},
    )
    assert resp.status_code == 422


def test_create_prescription_writes_audit_log(client_as, seeded_encounter_and_patient):
    encounter_id, patient_id = seeded_encounter_and_patient
    client = client_as(DOCTOR)
    resp = client.post(
        "/api/v1/prescriptions",
        json={
            "encounter_id": encounter_id,
            "patient_id": patient_id,
            "items": [{"medicine_name": "Ibuprofen", "dosage": "400mg"}],
        },
    )
    prescription_id = uuid.UUID(resp.json()["data"]["id"])

    from tests.prescriptions.conftest import _TestSession
    import asyncio

    async def _check():
        async with _TestSession() as session:
            result = await session.execute(
                select(AuditLog).where(
                    AuditLog.resource_type == "prescriptions",
                    AuditLog.resource_id == prescription_id,
                    AuditLog.action == "create",
                )
            )
            return result.scalar_one_or_none()

    row = asyncio.run(_check())
    assert row is not None
