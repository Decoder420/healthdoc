"""Procedure records: trusted attribution, facility scope and validation."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

import pytest
from pydantic import ValidationError
from sqlalchemy import select

from app.audit.models import AuditLog
from app.opd.models import Encounter, Visit
from app.orders.models import Order, Prescription
from app.patients.models import Patient
from app.patients.service import _repoint_order_clinical_records
from app.procedures import service
from app.procedures.models import ProcedureRecord
from app.procedures.schemas import ProcedureCreate


@pytest.fixture
async def procedure_context(db, seed):
    department, _room, doctor = seed
    patient = Patient(
        id=uuid.uuid4(),
        uhid=f"PROC-{uuid.uuid4().hex[:8]}",
        facility_id=department.facility_id,
        full_name="Procedure Patient",
        sex="other",
        age_years=42,
        identity_path="demographics_only",
        created_by=doctor.id,
    )
    visit = Visit(
        id=uuid.uuid4(),
        visit_number=f"PV-{uuid.uuid4().hex[:8]}",
        patient_id=patient.id,
        facility_id=department.facility_id,
        department_id=department.id,
        visit_type="opd",
        visit_date=datetime.now(UTC),
        created_by=doctor.id,
    )
    encounter = Encounter(
        id=uuid.uuid4(),
        visit_id=visit.id,
        facility_id=department.facility_id,
        provider_user_id=doctor.id,
        created_by=doctor.id,
        note_status="pending",
        row_version=1,
    )
    procedure_order = Order(
        id=uuid.uuid4(),
        order_number=f"ORD-PROC-{uuid.uuid4().hex[:8]}",
        encounter_id=encounter.id,
        facility_id=department.facility_id,
        patient_id=patient.id,
        order_type="procedure",
        priority="routine",
        status="placed",
        ordered_at=datetime.now(UTC),
        created_by=doctor.id,
    )
    lab_order = Order(
        id=uuid.uuid4(),
        order_number=f"ORD-LAB-{uuid.uuid4().hex[:8]}",
        encounter_id=encounter.id,
        facility_id=department.facility_id,
        patient_id=patient.id,
        order_type="lab",
        priority="routine",
        status="placed",
        ordered_at=datetime.now(UTC),
        created_by=doctor.id,
    )
    db.add_all([patient, visit, encounter, procedure_order, lab_order])
    await db.flush()
    return department, doctor, patient, visit, encounter, procedure_order, lab_order


async def test_create_procedure_derives_scope_and_performer(db, procedure_context):
    department, doctor, patient, visit, encounter, order, _lab_order = procedure_context

    row = await service.create_procedure(
        db,
        ProcedureCreate(
            order_id=order.id,
            procedure_name="  Wound dressing  ",
            setting="opd_minor",
        ),
        facility_id=department.facility_id,
        performed_by=doctor.id,
    )

    assert row.order_id == order.id
    assert row.encounter_id == encounter.id
    assert row.patient_id == patient.id
    assert row.performed_by == doctor.id
    assert row.procedure_name == "Wound dressing"

    audit = (
        await db.execute(
            select(AuditLog).where(
                AuditLog.resource_type == "procedure_records",
                AuditLog.resource_id == row.id,
            )
        )
    ).scalar_one()
    assert audit.facility_id == department.facility_id
    assert audit.patient_id == patient.id
    assert audit.visit_id == visit.id


async def test_procedure_create_is_single_detail_and_facility_scoped(db, procedure_context):
    department, doctor, _patient, _visit, encounter, order, _lab_order = procedure_context
    payload = ProcedureCreate(
        order_id=order.id,
        procedure_name="Suture removal",
        setting="opd_minor",
    )
    row = await service.create_procedure(
        db,
        payload,
        facility_id=department.facility_id,
        performed_by=doctor.id,
    )

    rows = await service.list_procedures_for_encounter(
        db,
        encounter_id=encounter.id,
        facility_id=department.facility_id,
    )
    hidden = await service.list_procedures_for_encounter(
        db,
        encounter_id=encounter.id,
        facility_id=uuid.uuid4(),
    )
    assert [item.id for item in rows] == [row.id]
    assert hidden == []

    with pytest.raises(service.ProcedureAlreadyExists):
        await service.create_procedure(
            db,
            payload,
            facility_id=department.facility_id,
            performed_by=doctor.id,
        )


async def test_procedure_rejects_wrong_type_and_cross_facility(db, procedure_context):
    department, doctor, _patient, _visit, _encounter, order, lab_order = procedure_context

    with pytest.raises(service.ProcedureOrderTypeMismatch):
        await service.create_procedure(
            db,
            ProcedureCreate(order_id=lab_order.id, procedure_name="Not a lab", setting="bedside"),
            facility_id=department.facility_id,
            performed_by=doctor.id,
        )

    with pytest.raises(service.ProcedureOrderNotFound):
        await service.create_procedure(
            db,
            ProcedureCreate(order_id=order.id, procedure_name="Hidden", setting="bedside"),
            facility_id=uuid.uuid4(),
            performed_by=doctor.id,
        )


def test_procedure_schema_rejects_invalid_ot_link_and_time_order():
    with pytest.raises(ValidationError):
        ProcedureCreate(
            order_id=uuid.uuid4(),
            procedure_name="Dressing",
            setting="bedside",
            ot_schedule_id=uuid.uuid4(),
        )

    now = datetime.now(UTC)
    with pytest.raises(ValidationError):
        ProcedureCreate(
            order_id=uuid.uuid4(),
            procedure_name="Dressing",
            setting="bedside",
            started_at=now,
            ended_at=now - timedelta(minutes=1),
        )


async def test_patient_merge_repoints_order_prescription_and_procedure_together(
    db, procedure_context
):
    department, doctor, source, _visit, _encounter, order, _lab_order = procedure_context
    target = Patient(
        id=uuid.uuid4(),
        uhid=f"PROC-{uuid.uuid4().hex[:8]}",
        facility_id=department.facility_id,
        full_name="Surviving Patient",
        sex="other",
        age_years=42,
        identity_path="demographics_only",
        created_by=doctor.id,
    )
    prescription = Prescription(
        id=uuid.uuid4(),
        encounter_id=order.encounter_id,
        facility_id=department.facility_id,
        patient_id=source.id,
        created_by=doctor.id,
    )
    procedure = ProcedureRecord(
        id=uuid.uuid4(),
        order_id=order.id,
        encounter_id=order.encounter_id,
        patient_id=source.id,
        procedure_name="Repointed dressing",
        setting="opd_minor",
        performed_by=doctor.id,
    )
    db.add_all([target, prescription, procedure])
    await db.flush()

    await _repoint_order_clinical_records(db, source=source, target=target)
    await db.refresh(order)
    await db.refresh(prescription)
    await db.refresh(procedure)

    assert order.patient_id == target.id
    assert prescription.patient_id == target.id
    assert procedure.patient_id == target.id
