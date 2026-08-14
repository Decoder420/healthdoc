"""
Service-layer tests for app.admissions.service -- admit_patient,
transfer_patient. Discharge tests land in the follow-up PR stacked on
this one, alongside discharge_patient() itself.
"""
from __future__ import annotations

import uuid

import pytest
from sqlalchemy import select

from app.admissions import service
from app.admissions.models import PatientMovementLog
from app.audit.models import AuditLog
from tests.admissions.conftest import seed_bed, seed_patient, seed_visit, seed_ward

pytestmark = pytest.mark.asyncio


async def _last_audit_log(db, resource_id):
    """Ordered by chain_seq, not created_at -- two audit rows for the
    same resource (e.g. admit then transfer) can land in the same
    SQLite timestamp tick, so created_at ties and doesn't reliably
    reflect insertion order. chain_seq is stamped monotonically by
    the root conftest's before_insert listener specifically for this
    (it mirrors audit_logs.chain_seq, the real per-facility ordering
    column -- schema.md §3 0003)."""
    result = await db.execute(
        select(AuditLog).where(AuditLog.resource_id == resource_id).order_by(AuditLog.chain_seq.desc())
    )
    return result.scalars().first()


class TestAdmitPatient:
    async def test_admit_creates_admission_and_occupies_bed(self, db, seed, visit, ward, bed):
        _dept, _room, doctor = seed
        admission = await service.admit_patient(
            db, visit_id=visit.id, ward_id=ward.id, bed_id=bed.id, created_by=doctor.id,
            reason="observation",
        )
        assert admission.status == "admitted"
        assert admission.patient_id == visit.patient_id

        await db.refresh(bed)
        assert bed.status == "occupied"

        log = await _last_audit_log(db, admission.id)
        assert log is not None
        assert log.action == "create"
        assert log.resource_type == "admissions"
        assert log.new_value["bed_id"] == str(bed.id)

    async def test_admit_into_nonexistent_bed_raises(self, db, seed, visit, ward):
        _dept, _room, doctor = seed
        with pytest.raises(service.BedNotFound):
            await service.admit_patient(
                db, visit_id=visit.id, ward_id=ward.id, bed_id=uuid.uuid4(), created_by=doctor.id,
            )

    async def test_admit_into_occupied_bed_raises_before_touching_db_constraint(
        self, db, seed, visit, ward, bed,
    ):
        _dept, _room, doctor = seed
        await service.admit_patient(
            db, visit_id=visit.id, ward_id=ward.id, bed_id=bed.id, created_by=doctor.id,
        )
        other_patient = await seed_patient(db, facility_id=visit.facility_id, created_by=doctor.id)
        other_visit = await seed_visit(
            db, facility_id=visit.facility_id, patient_id=other_patient.id, created_by=doctor.id,
        )
        with pytest.raises(service.BedNotAvailable):
            await service.admit_patient(
                db, visit_id=other_visit.id, ward_id=ward.id, bed_id=bed.id, created_by=doctor.id,
            )

    async def test_admit_with_nonexistent_visit_raises(self, db, seed, ward, bed):
        _dept, _room, doctor = seed
        with pytest.raises(service.VisitNotFound):
            await service.admit_patient(
                db, visit_id=uuid.uuid4(), ward_id=ward.id, bed_id=bed.id, created_by=doctor.id,
            )

    async def test_admit_race_past_precheck_still_converts_to_bed_not_available(
        self, db, seed, visit, ward, bed, monkeypatch,
    ):
        """Simulates the race the reviewer flagged on #372: a second
        request admits to the same bed in the window between the
        pre-check and the insert. uq_admissions_active_bed (0034) is
        the real guarantee that stops it, via a Postgres unique
        violation (sqlstate 23505) on flush -- but SQLite has no
        sqlstate attribute on its own IntegrityError, so a real SQLite
        constraint violation can't exercise the sqlstate check this
        code actually does. Instead, db.flush() is monkeypatched to
        raise a crafted IntegrityError with .orig.sqlstate = '23505',
        which tests exactly the branch this code takes in production
        against Postgres, independent of which dialect the test suite
        runs on."""
        import types
        from sqlalchemy.exc import IntegrityError as _IntegrityError

        _dept, _room, doctor = seed

        class _FakeOrig(Exception):
            sqlstate = "23505"

        async def _fake_flush_raises_unique_violation():
            raise _IntegrityError("duplicate key value violates unique constraint", None, _FakeOrig())

        monkeypatch.setattr(db, "flush", _fake_flush_raises_unique_violation)

        with pytest.raises(service.BedNotAvailable):
            await service.admit_patient(
                db, visit_id=visit.id, ward_id=ward.id, bed_id=bed.id, created_by=doctor.id,
            )

    async def test_admit_reraises_non_unique_integrity_errors(self, db, seed, visit, ward, bed, monkeypatch):
        """The sqlstate check must be specific -- some other constraint
        violation (e.g. a NOT NULL failure) must propagate as-is, not
        get misreported as BedNotAvailable."""
        from sqlalchemy.exc import IntegrityError as _IntegrityError

        _dept, _room, doctor = seed

        class _FakeOrig(Exception):
            sqlstate = "23502"  # not_null_violation, not unique_violation

        async def _fake_flush_raises_other_violation():
            raise _IntegrityError("null value in column violates not-null constraint", None, _FakeOrig())

        monkeypatch.setattr(db, "flush", _fake_flush_raises_other_violation)

        with pytest.raises(_IntegrityError):
            await service.admit_patient(
                db, visit_id=visit.id, ward_id=ward.id, bed_id=bed.id, created_by=doctor.id,
            )


class TestTransferPatient:
    async def test_transfer_moves_ward_and_bed_and_frees_old_bed(self, db, seed, visit, ward, bed):
        _dept, _room, doctor = seed
        admission = await service.admit_patient(
            db, visit_id=visit.id, ward_id=ward.id, bed_id=bed.id, created_by=doctor.id,
        )
        to_ward = await seed_ward(db, facility_id=visit.facility_id, name="Ward 2")
        to_bed = await seed_bed(db, ward_id=to_ward.id, bed_number="1")

        moved = await service.transfer_patient(
            db, admission=admission, to_ward_id=to_ward.id, to_bed_id=to_bed.id,
            moved_by=doctor.id, reason="ICU downgrade",
        )
        assert moved.ward_id == to_ward.id
        assert moved.bed_id == to_bed.id

        await db.refresh(bed)
        await db.refresh(to_bed)
        assert bed.status == "vacant"
        assert to_bed.status == "occupied"

        result = await db.execute(
            select(PatientMovementLog).where(PatientMovementLog.admission_id == admission.id)
        )
        movement = result.scalar_one()
        assert movement.from_bed_id == bed.id
        assert movement.to_bed_id == to_bed.id

        log = await _last_audit_log(db, admission.id)
        assert log.action == "transfer"
        assert log.old_value["bed_id"] == str(bed.id)
        assert log.new_value["bed_id"] == str(to_bed.id)

    async def test_transfer_into_occupied_bed_raises(self, db, seed, visit, ward, bed):
        _dept, _room, doctor = seed
        admission = await service.admit_patient(
            db, visit_id=visit.id, ward_id=ward.id, bed_id=bed.id, created_by=doctor.id,
        )
        occupied_bed = await seed_bed(db, ward_id=ward.id, bed_number="2")
        other_patient = await seed_patient(db, facility_id=visit.facility_id, created_by=doctor.id)
        other_visit = await seed_visit(
            db, facility_id=visit.facility_id, patient_id=other_patient.id, created_by=doctor.id,
        )
        await service.admit_patient(
            db, visit_id=other_visit.id, ward_id=ward.id, bed_id=occupied_bed.id, created_by=doctor.id,
        )

        with pytest.raises(service.BedNotAvailable):
            await service.transfer_patient(
                db, admission=admission, to_ward_id=ward.id, to_bed_id=occupied_bed.id, moved_by=doctor.id,
            )

    async def test_transfer_of_non_admitted_admission_raises(self, db, seed, visit, ward, bed):
        """Uses a direct status flip rather than discharge_patient() --
        that function isn't in this PR (see admissions/service.py
        module docstring). Admission.status='discharged' is exactly
        the precondition transfer_patient() checks, so this still
        exercises the real guard without depending on discharge."""
        _dept, _room, doctor = seed
        admission = await service.admit_patient(
            db, visit_id=visit.id, ward_id=ward.id, bed_id=bed.id, created_by=doctor.id,
        )
        admission.status = "discharged"
        await db.flush()

        to_ward = await seed_ward(db, facility_id=visit.facility_id, name="Ward 2")
        to_bed = await seed_bed(db, ward_id=to_ward.id, bed_number="1")

        with pytest.raises(service.AdmissionNotActive):
            await service.transfer_patient(
                db, admission=admission, to_ward_id=to_ward.id, to_bed_id=to_bed.id, moved_by=doctor.id,
            )

    async def test_transfer_race_past_precheck_still_converts_to_bed_not_available(
        self, db, seed, visit, ward, bed, monkeypatch,
    ):
        """Same race as admit_patient (see that test's docstring),
        applied to transfer_patient's own pre-check-then-update. Same
        dialect-independent approach: db.flush() is monkeypatched to
        raise a crafted IntegrityError with .orig.sqlstate = '23505'."""
        from sqlalchemy.exc import IntegrityError as _IntegrityError

        _dept, _room, doctor = seed
        admission = await service.admit_patient(
            db, visit_id=visit.id, ward_id=ward.id, bed_id=bed.id, created_by=doctor.id,
        )
        to_ward = await seed_ward(db, facility_id=visit.facility_id, name="Ward 2")
        to_bed = await seed_bed(db, ward_id=to_ward.id, bed_number="1")

        class _FakeOrig(Exception):
            sqlstate = "23505"

        async def _fake_flush_raises_unique_violation():
            raise _IntegrityError("duplicate key value violates unique constraint", None, _FakeOrig())

        monkeypatch.setattr(db, "flush", _fake_flush_raises_unique_violation)

        with pytest.raises(service.BedNotAvailable):
            await service.transfer_patient(
                db, admission=admission, to_ward_id=to_ward.id, to_bed_id=to_bed.id, moved_by=doctor.id,
            )

    async def test_transfer_reraises_non_unique_integrity_errors(self, db, seed, visit, ward, bed, monkeypatch):
        from sqlalchemy.exc import IntegrityError as _IntegrityError

        _dept, _room, doctor = seed
        admission = await service.admit_patient(
            db, visit_id=visit.id, ward_id=ward.id, bed_id=bed.id, created_by=doctor.id,
        )
        to_ward = await seed_ward(db, facility_id=visit.facility_id, name="Ward 2")
        to_bed = await seed_bed(db, ward_id=to_ward.id, bed_number="1")

        class _FakeOrig(Exception):
            sqlstate = "23502"

        async def _fake_flush_raises_other_violation():
            raise _IntegrityError("null value in column violates not-null constraint", None, _FakeOrig())

        monkeypatch.setattr(db, "flush", _fake_flush_raises_other_violation)

        with pytest.raises(_IntegrityError):
            await service.transfer_patient(
                db, admission=admission, to_ward_id=to_ward.id, to_bed_id=to_bed.id, moved_by=doctor.id,
            )
