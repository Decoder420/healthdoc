"""A bound portal user can read only the patient selected by their binding."""
from __future__ import annotations

import uuid

from sqlalchemy import select

from app.auth.deps import DbUser
from app.consent.models import DataAccessLog
from app.patients.models import Patient, PatientPortalBinding
from app.patients.portal_self_router import (
    get_my_abha,
    get_my_access_history,
    get_my_consents,
)


async def _bound_patient(db, department, user) -> tuple[Patient, PatientPortalBinding, DbUser]:
    patient = Patient(
        id=uuid.uuid4(),
        thid=f"TH-SELF-{uuid.uuid4().hex[:8]}",
        full_name="Self Service Patient",
        sex="unknown",
        age_years=32,
        identity_path="demographics_only",
        facility_id=department.facility_id,
        abha_number="12345678901234",
        created_by=user.id,
    )
    binding = PatientPortalBinding(
        id=uuid.uuid4(),
        user_id=user.id,
        patient_id=patient.id,
        facility_id=department.facility_id,
        verification_method="abha_otp",
        verification_reference="OTP-SELF-TEST",
        verified_by=user.id,
    )
    db.add_all([patient, binding])
    await db.flush()
    caller = DbUser(
        id=user.id,
        keycloak_sub=user.keycloak_sub,
        username=user.username,
        facility_id=department.facility_id,
        roles=["patient"],
    )
    return patient, binding, caller


async def test_self_abha_and_empty_consents_are_bound_and_access_logged(db, seed) -> None:
    department, _room, user = seed
    patient, binding, caller = await _bound_patient(db, department, user)

    abha = await get_my_abha(binding, caller, db)
    consents = await get_my_consents(binding, caller, db)

    assert abha.patient_id == patient.id
    assert abha.abha_number == "12345678901234"
    assert consents == []
    resources = set(
        (await db.execute(
            select(DataAccessLog.resource_type).where(DataAccessLog.patient_id == patient.id)
        )).scalars()
    )
    assert resources == {"abha_identity", "consent_records"}


async def test_access_history_cannot_cross_the_bound_patient(db, seed) -> None:
    department, _room, user = seed
    patient, binding, caller = await _bound_patient(db, department, user)
    other_patient_id = uuid.uuid4()
    db.add_all([
        DataAccessLog(
            id=uuid.uuid4(), user_id=user.id, role="doctor", resource_type="lab_results",
            patient_id=patient.id, purpose_code="clinical_review", access_channel="api",
            emergency_access=False, consent_required=True, consent_verified=True,
        ),
        DataAccessLog(
            id=uuid.uuid4(), user_id=user.id, role="doctor", resource_type="prescriptions",
            patient_id=other_patient_id, purpose_code="clinical_review", access_channel="api",
            emergency_access=False, consent_required=True, consent_verified=True,
        ),
    ])
    await db.flush()

    history = await get_my_access_history(binding, caller, db, limit=50, offset=0)

    assert history.total == 2  # clinical read plus this self-review access
    assert {item.resource_type for item in history.items} == {"lab_results", "data_access_log"}
    assert "prescriptions" not in {item.resource_type for item in history.items}
