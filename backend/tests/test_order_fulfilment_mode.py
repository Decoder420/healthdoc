"""§2 v3.3 rule 1 — ordering never disappears, and never lies about who will do it.

THE DOCUMENTED RULE, WHICH WAS NOT IMPLEMENTED

  "Ordering never disappears. A doctor can always record what the patient needs
   — clinical completeness is not conditional on the hospital owning the
   equipment. The order is created with fulfilment_mode='external_referral'
   instead of being refused."

Half of that held by accident. POST /orders is not module-gated, so the order
WAS created. But `orders.fulfilment_mode` — a column since migration 0027 — was
never mapped in the ORM, so no code path could set it and every order defaulted
to 'internal'.

The consequence at a facility with lab switched off: a doctor orders a lab test,
the order is created, and it records that this hospital will run the test
in-house. The lab module is off, so nothing picks it up and no accession is ever
generated. The order sits as 'placed' forever. Silently mislabelling a clinical
instruction is worse than refusing it, because a refusal is visible.

Found by auditing columns the schema declares and no code touches — the same
shape as kpi_snapshots before the reports module was built, except this one had
a documented behaviour attached to it.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

import pytest
from sqlalchemy import func, select

from app.common.facility_modules import FacilityModule
from app.opd.models import Visit
from app.orders import service
from app.orders.schemas import OrderCreate
from app.patients.models import Patient


@pytest.fixture
async def encounter(db, seed):
    """A visit + encounter at the seeded facility, ready to order against."""
    dept, _room, doctor = seed
    patient = Patient(
        id=uuid.uuid4(), uhid=f"UH{uuid.uuid4().hex[:8]}", facility_id=dept.facility_id,
        full_name="Fulfilment Test", sex="female", age_years=44,
        identity_path="demographics_only", created_by=doctor.id,
    )
    db.add(patient)
    await db.flush()
    visit = Visit(
        id=uuid.uuid4(), visit_number=f"V{uuid.uuid4().hex[:8]}", patient_id=patient.id,
        facility_id=dept.facility_id, department_id=dept.id, visit_type="opd",
        visit_date=datetime.now(timezone.utc), created_by=doctor.id,
    )
    db.add(visit)
    await db.flush()

    from app.encounters import service as enc_service
    from app.encounters.schemas import EncounterCreate

    enc = await enc_service.create_encounter(
        db,
        EncounterCreate(visit_id=visit.id, provider_user_id=doctor.id),
        actor_id=doctor.id,
        facility_id=dept.facility_id,
    )
    return enc, patient, doctor, dept.facility_id


async def _disable(db, facility_id, module_code: str) -> None:
    """Switch a module off via the mapped model, not raw SQL.

    A bare `:param` in text() carries no type information, so a UUID reaches
    the driver untouched — fine on asyncpg, "type 'UUID' is not supported" on
    sqlite3. This fixture runs on the shared SQLite `db`.
    """
    db.add(
        FacilityModule(
            id=uuid.uuid4(),
            facility_id=facility_id,
            module_code=module_code,
            is_enabled=False,
        )
    )
    await db.flush()


async def _place(db, encounter, patient, doctor, order_type: str):
    return await service.create_order(
        db,
        OrderCreate(
            encounter_id=encounter.id,
            patient_id=patient.id,
            order_type=order_type,
            priority="routine",
        ),
    )


async def test_an_order_is_internal_when_the_module_is_on(db, encounter):
    """The ordinary case. Asserted explicitly rather than assumed from the
    column default — a default that happens to be right is not the same as a
    code path that decides."""
    enc, patient, doctor, _facility_id = encounter

    order = await _place(db, enc, patient, doctor, "lab")

    assert order.fulfilment_mode == "internal"


async def test_a_disabled_module_makes_the_order_an_external_referral(db, encounter):
    """The rule that was documented and never implemented.

    Before this, the order was created saying 'internal' — the hospital
    recording that it would run a test its own configuration says it cannot.
    """
    enc, patient, doctor, facility_id = encounter
    await _disable(db, facility_id, "lab")

    order = await _place(db, enc, patient, doctor, "lab")

    assert order.fulfilment_mode == "external_referral"


async def test_the_order_is_still_created_rather_than_refused(db, encounter):
    """The other half of rule 1, pinned so a later change cannot 'fix' this by
    gating POST /orders with require_module. That would refuse the order, which
    is exactly what the rule forbids: clinical completeness must not depend on
    the hospital owning the equipment."""
    enc, patient, doctor, facility_id = encounter
    await _disable(db, facility_id, "radiology")

    order = await _place(db, enc, patient, doctor, "radiology")

    assert order.id is not None
    assert order.status == "placed"
    assert order.order_number, "a referred order still gets a real order number"


async def test_disabling_one_module_does_not_affect_another(db, encounter):
    """The lookup is per module_code. A single is_enabled=false row must not
    make every order type external."""
    enc, patient, doctor, facility_id = encounter
    await _disable(db, facility_id, "lab")

    radiology = await _place(db, enc, patient, doctor, "radiology")
    lab = await _place(db, enc, patient, doctor, "lab")

    assert radiology.fulfilment_mode == "internal"
    assert lab.fulfilment_mode == "external_referral"


async def test_blood_orders_map_to_the_blood_bank_module(db, encounter):
    """order_type and module_code differ here — 'blood' vs 'blood_bank'. The one
    pair in the mapping where a naive `order_type == module_code` would silently
    never match, leaving blood orders permanently internal at a facility with no
    blood bank."""
    enc, patient, doctor, facility_id = encounter
    await _disable(db, facility_id, "blood_bank")

    order = await _place(db, enc, patient, doctor, "blood")

    assert order.fulfilment_mode == "external_referral"


async def test_a_procedure_order_is_never_externalised(db, encounter):
    """`procedure` is deliberately absent from the mapping.

    ProcedureSetting is decoupled from the OT module precisely so a minor
    procedure is recordable at a facility with no theatre. Mapping procedure to
    'ot' would turn every OPD dressing into an external referral at such a
    facility — the opposite of what the decoupling exists for.
    """
    enc, patient, doctor, facility_id = encounter
    await _disable(db, facility_id, "ot")

    order = await _place(db, enc, patient, doctor, "procedure")

    assert order.fulfilment_mode == "internal"


async def test_no_row_means_enabled(db, encounter):
    """facility_modules is sparse: a facility that has never toggled anything
    has no rows at all, and modules are on by default.

    This matches require_module()'s convention exactly. If the two ever
    disagreed, an order could be marked internal by one rule while the endpoint
    that fulfils it returns 409 by the other.
    """
    enc, patient, doctor, facility_id = encounter
    rows = (await db.execute(
        select(func.count())
        .select_from(FacilityModule)
        .where(FacilityModule.facility_id == facility_id)
    )).scalar_one()
    assert rows == 0, "precondition: this facility has toggled nothing"

    order = await _place(db, enc, patient, doctor, "pharmacy")

    assert order.fulfilment_mode == "internal"
