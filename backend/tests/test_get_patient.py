"""GET /patients/{patient_id} — the record read that did not exist.

A patient could be created, searched, updated, and have their history,
consents, ABHA and access-history read. The record itself could not be fetched
by id. Every clinical screen opens by loading a patient, and PATCH implies an
edit form that populates from somewhere; the frontend's `getPatient` mock was
standing in for the gap.

The merge cases below are the ones worth reading. §3 0006's repointing rule
says every patient read resolves the merge pointer — a caller holding a
pre-merge id must land on the surviving record, not a tombstone, or they will
chart against a patient that no longer accumulates data.
"""
from __future__ import annotations

import uuid

import pytest
from fastapi import HTTPException

from app.patients import router as patients_router
from app.patients.models import Patient
from app.users.models import Facility

pytestmark = pytest.mark.asyncio


class _Caller:
    def __init__(self, facility_id: uuid.UUID, roles: list[str] | None = None) -> None:
        self.facility_id = facility_id
        self.id = uuid.uuid4()
        self.roles = roles or ["doctor"]


async def _facility(db) -> Facility:
    facility = Facility(
        id=uuid.uuid4(), code=f"P{uuid.uuid4().hex[:4].upper()}",
        name="Facility", state_code="TS",
    )
    db.add(facility)
    await db.flush()
    return facility


async def _patient(db, facility_id, **overrides) -> Patient:
    fields = dict(
        id=uuid.uuid4(), uhid=f"UH{uuid.uuid4().hex[:8]}", full_name="Asha Menon",
        sex="female", age_years=31, identity_path="demographics_only",
        identity_status="verified", facility_id=facility_id, created_by=uuid.uuid4(),
    )
    fields.update(overrides)
    patient = Patient(**fields)
    db.add(patient)
    await db.flush()
    return patient


async def test_a_patient_can_be_read_by_id(db):
    facility = await _facility(db)
    patient = await _patient(db, facility.id)

    result = await patients_router.get_patient_endpoint(
        patient.id, _Caller(facility.id), db=db,
    )

    assert result.id == patient.id
    assert result.full_name == "Asha Menon"
    assert result.uhid == patient.uhid
    assert result.merged_from_patient_id is None


async def test_row_version_is_returned(db):
    """PATCH increments it for optimistic concurrency (0035) and the If-Match
    check is staged. Without a GET there was no way to have read the value."""
    facility = await _facility(db)
    patient = await _patient(db, facility.id)

    result = await patients_router.get_patient_endpoint(
        patient.id, _Caller(facility.id), db=db,
    )

    assert result.row_version == patient.row_version


async def test_another_facilitys_patient_is_not_readable(db):
    ours, theirs = await _facility(db), await _facility(db)
    stranger = await _patient(db, theirs.id)

    with pytest.raises(HTTPException) as caught:
        await patients_router.get_patient_endpoint(
            stranger.id, _Caller(ours.id), db=db,
        )

    assert caught.value.status_code == 404


async def test_a_merged_id_resolves_to_the_surviving_record(db):
    """§3 0006. The caller asked for the merged-away id; they get the record
    that is actually accumulating data, and merged_from_patient_id tells them
    the id they asked for is no longer the live one."""
    facility = await _facility(db)
    survivor = await _patient(db, facility.id, full_name="Asha Menon (canonical)")
    merged_away = await _patient(
        db, facility.id, full_name="Asha Menon (duplicate)",
        status="merged", merged_into_patient_id=survivor.id,
    )

    result = await patients_router.get_patient_endpoint(
        merged_away.id, _Caller(facility.id), db=db,
    )

    assert result.id == survivor.id, "the body must describe the surviving record"
    assert result.full_name == "Asha Menon (canonical)"
    assert result.merged_from_patient_id == merged_away.id, (
        "the requested id must be reported, or the screen silently shows a "
        "different patient than the one asked for"
    )


async def test_a_merge_pointer_into_another_facility_is_not_followed(db):
    """The pointer is not a licence to cross the facility boundary."""
    ours, theirs = await _facility(db), await _facility(db)
    their_survivor = await _patient(db, theirs.id)
    ours_merged_away = await _patient(
        db, ours.id, status="merged", merged_into_patient_id=their_survivor.id,
    )

    with pytest.raises(HTTPException) as caught:
        await patients_router.get_patient_endpoint(
            ours_merged_away.id, _Caller(ours.id), db=db,
        )

    assert caught.value.status_code == 404


async def test_a_soft_deleted_patient_is_not_readable(db):
    from datetime import datetime, timezone

    facility = await _facility(db)
    patient = await _patient(
        db, facility.id, deleted_at=datetime.now(timezone.utc),
    )

    with pytest.raises(HTTPException) as caught:
        await patients_router.get_patient_endpoint(
            patient.id, _Caller(facility.id), db=db,
        )

    assert caught.value.status_code == 404


async def test_the_route_is_role_gated_and_access_logged():
    """Both dependencies are declared, not just the role one. A patient read
    that is not logged is a DPDP gap, and this route reads the demographic
    record for every clinical screen in the product."""
    route = next(
        r for r in patients_router.router.routes
        if getattr(r, "path", None) == "/patients/{patient_id}"
        and "GET" in getattr(r, "methods", set())
    )
    names = {d.call.__qualname__ for d in route.dependant.dependencies}
    assert any("log_patient_data_access" in n for n in names), (
        f"patient reads must be access-logged (DPDP); got {names}"
    )
    assert any("require_roles" in n for n in names), (
        f"expected an explicit role gate; got {names}"
    )


async def test_the_literal_get_routes_still_win_over_the_id_route():
    """Ordering only matters within a method.

    /patients/search and /patients/merge are POST and cannot be captured by a
    GET route no matter where they sit — an earlier version of this test
    asserted on them and went red for that reason rather than a real one.
    The single genuine collision is GET /patients/ping against
    GET /patients/{patient_id}: same method, and "ping" would be parsed as a
    UUID if the id route were registered first.
    """
    gets = [
        r.path for r in patients_router.router.routes
        if "GET" in getattr(r, "methods", set()) and getattr(r, "path", None)
    ]

    assert gets.index("/patients/ping") < gets.index("/patients/{patient_id}"), (
        "GET /patients/ping must be registered before GET /patients/{patient_id}"
    )
