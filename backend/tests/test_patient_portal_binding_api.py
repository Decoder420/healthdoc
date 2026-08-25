"""Provisioning and revocation rules for patient portal identity."""
from __future__ import annotations

import uuid
from types import SimpleNamespace

import pytest
from fastapi import HTTPException
from sqlalchemy import select

from app.audit.models import AuditLog
from app.auth.deps import DbUser
from app.patients.models import Patient, PatientPortalBinding
from app.patients.portal_router import (
    BindingCreate,
    BindingRevoke,
    create_binding,
    get_active_patient_binding,
    revoke_binding,
)


async def _patient(db, verifier, facility_id) -> Patient:
    patient = Patient(
        id=uuid.uuid4(),
        thid=f"TH-PORTAL-{uuid.uuid4().hex[:8]}",
        full_name="Portal Patient",
        sex="unknown",
        age_years=28,
        identity_path="demographics_only",
        facility_id=facility_id,
        created_by=verifier.id,
    )
    db.add(patient)
    await db.flush()
    return patient


async def test_binding_is_scoped_resolvable_and_safely_audited(db, seed) -> None:
    department, _room, verifier = seed
    patient = await _patient(db, verifier, department.facility_id)
    caller = DbUser(
        id=verifier.id,
        keycloak_sub=verifier.keycloak_sub,
        username=verifier.username,
        facility_id=department.facility_id,
        roles=["admin"],
    )
    binding = await create_binding(
        BindingCreate(
            user_id=verifier.id,
            patient_id=patient.id,
            verification_method="in_person_document",
            verification_reference="DOCUMENT-REF-SECRET",
        ),
        caller,
        db,
        SimpleNamespace(),
    )

    resolved = await get_active_patient_binding(caller, db)
    assert resolved.id == binding.id
    audit = (
        await db.execute(
            select(AuditLog)
            .where(AuditLog.resource_type == "patient_portal_bindings")
            .order_by(AuditLog.created_at.desc())
        )
    ).scalars().first()
    assert audit is not None
    assert audit.user_id == verifier.id
    assert "verification_reference" not in audit.new_value
    assert "DOCUMENT-REF-SECRET" not in str(audit.new_value)


async def test_active_binding_conflicts_and_revocation_fail_closed(db, seed) -> None:
    department, _room, verifier = seed
    patient = await _patient(db, verifier, department.facility_id)
    caller = DbUser(
        id=verifier.id, keycloak_sub=verifier.keycloak_sub,
        username=verifier.username, facility_id=department.facility_id,
        roles=["admin"],
    )
    binding = await create_binding(
        BindingCreate(
            user_id=verifier.id, patient_id=patient.id,
            verification_method="abha_otp", verification_reference="OTP-TXN-123",
        ),
        caller, db, SimpleNamespace(),
    )
    with pytest.raises(HTTPException) as conflict:
        await create_binding(
            BindingCreate(
                user_id=verifier.id, patient_id=patient.id,
                verification_method="abha_otp", verification_reference="OTP-TXN-456",
            ),
            caller, db, SimpleNamespace(),
        )
    assert conflict.value.status_code == 409

    await revoke_binding(
        binding.id,
        BindingRevoke(reason="Patient requested portal deactivation"),
        caller, db, SimpleNamespace(),
    )
    with pytest.raises(HTTPException) as unbound:
        await get_active_patient_binding(caller, db)
    assert unbound.value.status_code == 403
    assert unbound.value.detail["code"] == "patient_identity_not_bound"

    row = await db.get(PatientPortalBinding, binding.id)
    assert row.revoked_by == verifier.id
    assert row.revocation_reason == "Patient requested portal deactivation"
