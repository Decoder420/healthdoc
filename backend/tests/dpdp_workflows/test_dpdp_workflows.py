"""Acceptance proofs for issue #451 DPDP workflows."""
from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

import httpx
import pytest
from fastapi import FastAPI, HTTPException
from pydantic import ValidationError
from sqlalchemy import func, select

from app.audit.models import AuditLog
from app.auth.deps import (
    AuthUser,
    DbUser,
    get_current_db_user,
    get_current_user,
)
from app.common.db import get_db
from app.consent import service as consent_service
from app.consent.models import ConsentPurpose
from app.dpdp import service
from app.dpdp.models import ConsentManager, DataProtectionOfficer, PatientGrievance
from app.dpdp.router import router as dpdp_router
from app.dpdp.schemas import (
    ConsentManagerCreate,
    ConsentManagerUpdate,
    DpoAppointmentCreate,
    GrievanceCreate,
    GrievanceTransition,
)
from app.patients.models import Patient
from app.users.models import User


async def _second_user(db, actor) -> User:
    user = User(
        id=uuid.uuid4(),
        keycloak_sub=f"dpdp-{uuid.uuid4()}",
        username=f"dpdp{uuid.uuid4().hex[:8]}",
        full_name="Second DPDP User",
        facility_id=actor.facility_id,
    )
    db.add(user)
    await db.flush()
    return user


async def _patient(db, actor) -> Patient:
    patient = Patient(
        id=uuid.uuid4(),
        uhid=f"DPDP{uuid.uuid4().hex[:10]}",
        full_name="DPDP Test Patient",
        sex="other",
        age_years=30,
        identity_path="demographics_only",
        facility_id=actor.facility_id,
        created_by=actor.id,
    )
    db.add(patient)
    await db.flush()
    return patient


async def test_dpo_appointment_requires_explicit_replacement_and_audits(db, seed):
    _department, _room, actor = seed
    successor = await _second_user(db, actor)
    first = await service.appoint_dpo(
        db,
        payload=DpoAppointmentCreate(
            user_id=actor.id,
            contact_published=True,
            published_contact="dpo@example.test",
        ),
        facility_id=actor.facility_id,
        actor_id=actor.id,
    )

    with pytest.raises(service.DpoConflict) as exc_info:
        await service.appoint_dpo(
            db,
            payload=DpoAppointmentCreate(user_id=successor.id),
            facility_id=actor.facility_id,
            actor_id=actor.id,
        )
    assert exc_info.value.code == "active_dpo_exists"

    replacement = await service.appoint_dpo(
        db,
        payload=DpoAppointmentCreate(
            user_id=successor.id, replaces_dpo_id=first.id
        ),
        facility_id=actor.facility_id,
        actor_id=actor.id,
    )
    assert first.is_active is False
    assert replacement.is_active is True
    assert (await service.get_active_dpo(db, facility_id=actor.facility_id)).id == replacement.id
    with pytest.raises(service.DpoNotFound):
        await service.get_active_dpo(db, facility_id=uuid.uuid4())
    with pytest.raises(service.DpoNotFound):
        await service.deactivate_dpo(
            db,
            dpo_id=replacement.id,
            facility_id=uuid.uuid4(),
            actor_id=actor.id,
        )
    audits = (
        await db.execute(
            select(func.count()).select_from(AuditLog).where(
                AuditLog.resource_type == "data_protection_officers"
            )
        )
    ).scalar_one()
    assert audits == 3


def test_published_dpo_contact_is_never_implicit():
    with pytest.raises(ValidationError):
        DpoAppointmentCreate(user_id=uuid.uuid4(), contact_published=True)
    with pytest.raises(ValidationError):
        DpoAppointmentCreate(
            user_id=uuid.uuid4(),
            contact_published=False,
            published_contact="hidden@example.test",
        )


async def _grievance(db, actor, patient, **overrides) -> PatientGrievance:
    values = {
        "patient_id": patient.id,
        "grievance_type": "access",
        "description": "Please provide my access history.",
        "due_at": datetime.now(UTC) + timedelta(days=7),
    }
    values.update(overrides)
    return await service.create_grievance(
        db,
        payload=GrievanceCreate(**values),
        facility_id=actor.facility_id,
        actor_id=actor.id,
    )


async def test_grievance_number_is_server_allocated_and_due_date_is_explicit(
    db, seed
):
    _department, _room, actor = seed
    patient = await _patient(db, actor)
    first = await _grievance(db, actor, patient)
    second = await _grievance(db, actor, patient, grievance_type="correction")
    assert first.grievance_number.startswith("GRV-TST01-")
    assert first.grievance_number.endswith("-0001")
    assert second.grievance_number.endswith("-0002")
    assert first.created_by == actor.id
    assert (
        await db.execute(
            select(AuditLog).where(
                AuditLog.resource_type == "patient_grievances",
                AuditLog.resource_id == first.id,
            )
        )
    ).scalar_one()

    with pytest.raises(ValidationError):
        GrievanceCreate(
            patient_id=patient.id,
            grievance_type="access",
            description="Late due date",
            due_at=datetime.now(UTC) - timedelta(seconds=1),
        )


async def test_grievance_transitions_require_evidence_and_closed_is_terminal(
    db, seed
):
    _department, _room, actor = seed
    patient = await _patient(db, actor)
    row = await _grievance(db, actor, patient)
    row = await service.transition_grievance(
        db,
        grievance_id=row.id,
        payload=GrievanceTransition(status="under_review", assigned_to=actor.id),
        facility_id=actor.facility_id,
        actor_id=actor.id,
    )
    with pytest.raises(service.GrievanceConflict) as exc_info:
        await service.transition_grievance(
            db,
            grievance_id=row.id,
            payload=GrievanceTransition(status="resolved"),
            facility_id=actor.facility_id,
            actor_id=actor.id,
        )
    assert exc_info.value.code == "resolution_required"

    row = await service.transition_grievance(
        db,
        grievance_id=row.id,
        payload=GrievanceTransition(
            status="resolved", resolution="Access history supplied securely."
        ),
        facility_id=actor.facility_id,
        actor_id=actor.id,
    )
    assert row.resolved_at is not None
    row = await service.transition_grievance(
        db,
        grievance_id=row.id,
        payload=GrievanceTransition(status="closed"),
        facility_id=actor.facility_id,
        actor_id=actor.id,
    )
    with pytest.raises(service.GrievanceConflict):
        await service.transition_grievance(
            db,
            grievance_id=row.id,
            payload=GrievanceTransition(status="under_review"),
            facility_id=actor.facility_id,
            actor_id=actor.id,
        )


async def test_grievance_tenant_boundary_is_non_disclosing(db, seed):
    _department, _room, actor = seed
    patient = await _patient(db, actor)
    row = await _grievance(db, actor, patient)
    other_facility_id = uuid.uuid4()
    with pytest.raises(service.ResourceNotFound) as exc_info:
        await service.create_grievance(
            db,
            payload=GrievanceCreate(
                patient_id=patient.id,
                grievance_type="access",
                description="Cross-facility attempt",
                due_at=datetime.now(UTC) + timedelta(days=1),
            ),
            facility_id=other_facility_id,
            actor_id=actor.id,
        )
    assert exc_info.value.code == "patient_not_found"
    with pytest.raises(service.GrievanceNotFound):
        await service.get_grievance(
            db, grievance_id=row.id, facility_id=other_facility_id
        )


async def test_consent_manager_uniqueness_activation_and_abdm_linkage(
    db, seed
):
    _department, _room, actor = seed
    patient = await _patient(db, actor)
    manager = await service.create_consent_manager(
        db,
        payload=ConsentManagerCreate(
            cm_registration_id="CM-TEST-001",
            name="Test Consent Manager",
            endpoint_url="https://cm.example.test",
        ),
        audit_facility_id=actor.facility_id,
        actor_id=actor.id,
    )
    with pytest.raises(service.ConsentManagerConflict):
        await service.create_consent_manager(
            db,
            payload=ConsentManagerCreate(
                cm_registration_id="CM-TEST-001", name="Duplicate"
            ),
            audit_facility_id=actor.facility_id,
            actor_id=actor.id,
        )

    purpose = ConsentPurpose(
        id=uuid.uuid4(),
        purpose_code=f"dpdp-{uuid.uuid4().hex[:8]}",
        description="DPDP test consent",
        requires_explicit_consent=True,
        is_active=True,
    )
    db.add(purpose)
    await db.flush()
    with pytest.raises(HTTPException) as missing_exc:
        await consent_service.create_consent_record(
            db,
            patient_id=patient.id,
            facility_id=actor.facility_id,
            created_by=actor.id,
            purpose_id=purpose.id,
            granted_by_type="patient",
            channel="abdm_consent_manager",
            status="requested",
        )
    assert missing_exc.value.status_code == 422

    record = await consent_service.create_consent_record(
        db,
        patient_id=patient.id,
        facility_id=actor.facility_id,
        created_by=actor.id,
        purpose_id=purpose.id,
        granted_by_type="patient",
        channel="abdm_consent_manager",
        status="requested",
        consent_manager_id=manager.id,
    )
    assert record.consent_manager_id == manager.id

    await service.update_consent_manager(
        db,
        manager_id=manager.id,
        payload=ConsentManagerUpdate(is_active=False),
        audit_facility_id=actor.facility_id,
        actor_id=actor.id,
    )
    with pytest.raises(HTTPException) as inactive_exc:
        await consent_service.create_consent_record(
            db,
            patient_id=patient.id,
            facility_id=actor.facility_id,
            created_by=actor.id,
            purpose_id=purpose.id,
            granted_by_type="patient",
            channel="abdm_consent_manager",
            status="requested",
            consent_manager_id=manager.id,
        )
    assert inactive_exc.value.status_code == 409

    with pytest.raises(ValidationError):
        ConsentManagerUpdate()
    with pytest.raises(ValidationError):
        ConsentManagerUpdate(name=None)


def _http_client(db, *, actor, roles: list[str]) -> httpx.AsyncClient:
    async def override_db():
        yield db

    app = FastAPI()
    app.include_router(dpdp_router)
    app.dependency_overrides[get_db] = override_db
    app.dependency_overrides[get_current_user] = lambda: AuthUser(
        sub=actor.keycloak_sub, username=actor.username, roles=roles
    )
    app.dependency_overrides[get_current_db_user] = lambda: DbUser(
        id=actor.id,
        keycloak_sub=actor.keycloak_sub,
        username=actor.username,
        facility_id=actor.facility_id,
        roles=roles,
    )
    return httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app), base_url="http://test"
    )


async def test_dpdp_http_role_gate_and_idempotent_grievance_create(
    db, seed
):
    _department, _room, actor = seed
    patient = await _patient(db, actor)
    body = {
        "patient_id": str(patient.id),
        "grievance_type": "access",
        "description": "Requesting access evidence",
        "due_at": (datetime.now(UTC) + timedelta(days=2)).isoformat(),
    }
    headers = {"Idempotency-Key": "dpdp-grievance-retry"}
    async with _http_client(db, actor=actor, roles=["doctor"]) as client:
        forbidden = await client.post(
            "/dpdp/grievances", headers=headers, json=body
        )
    assert forbidden.status_code == 403

    async with _http_client(db, actor=actor, roles=["receptionist"]) as client:
        first = await client.post("/dpdp/grievances", headers=headers, json=body)
        retry = await client.post("/dpdp/grievances", headers=headers, json=body)
    assert first.status_code == 201, first.text
    assert retry.status_code == 201, retry.text
    assert retry.json()["id"] == first.json()["id"]


async def test_auditor_can_read_the_consent_manager_register(db, seed):
    """The auditor governance screen must not fail on its fourth parallel read."""
    _department, _room, actor = seed

    async with _http_client(db, actor=actor, roles=["auditor"]) as client:
        allowed = await client.get("/dpdp/consent-managers")
    assert allowed.status_code == 200, allowed.text

    async with _http_client(db, actor=actor, roles=["doctor"]) as client:
        forbidden = await client.get("/dpdp/consent-managers")
    assert forbidden.status_code == 403


def test_dpdp_models_map_the_existing_tables():
    assert DataProtectionOfficer.__tablename__ == "data_protection_officers"
    assert PatientGrievance.__tablename__ == "patient_grievances"
    assert ConsentManager.__tablename__ == "consent_managers"
