"""GET /pharmacy/suppliers and GET /pharmacy/stock-locations.

Both tables have existed since migration 0012 with no endpoint over either.
That is why the GRN screen could not be built: a GRN carries a supplier_id and
verification carries a stock_location_id, so the receiving form had no pickers
and the workflow could not be started from the UI at all. The procurement
*workflow* was complete; its master-data reads were not.

Run against real PostgreSQL. `stock_locations.location_type` is a CHECK
constraint, and the facility scoping is the point of the tests — neither is
worth asserting against a schema built from ORM metadata.
"""
from __future__ import annotations

import uuid

from sqlalchemy import text

from app.pharmacy.service import (
    list_adjustments,
    list_indents,
    list_stock_locations,
    list_suppliers,
)


async def test_suppliers_are_scoped_to_the_callers_facility(db_session, inventory_seed, pharmacy_seed):
    """A supplier list is a purchasing relationship. Another hospital's vendors
    are not merely irrelevant, they are commercially sensitive."""
    other_facility = uuid.uuid4()
    await db_session.execute(text("""
        INSERT INTO facilities (id, code, name, state_code, timezone)
        VALUES (:id, :code, 'Other Facility', 'OT', 'Asia/Kolkata')
    """), {"id": other_facility, "code": f"OTH{uuid.uuid4().hex[:8]}"})
    await db_session.execute(text("""
        INSERT INTO suppliers (id, facility_id, name) VALUES (:id, :fid, 'Their Vendor')
    """), {"id": uuid.uuid4(), "fid": other_facility})
    await db_session.flush()

    result = await list_suppliers(db_session, facility_id=pharmacy_seed["facility_id"])
    names = [s.name for s in result.items]

    assert "Test Supplier" in names, "our own supplier is returned"
    assert "Their Vendor" not in names, "another facility's vendor must not appear"


async def test_inactive_suppliers_are_hidden_from_the_picker_by_default(
    db_session, inventory_seed, pharmacy_seed
):
    """Inactive suppliers are kept, not deleted, so historical GRNs still
    resolve a name. But offering one in a picker lets a clerk receive new stock
    against a supplier the hospital has stopped buying from."""
    await db_session.execute(text("""
        INSERT INTO suppliers (id, facility_id, name, is_active)
        VALUES (:id, :fid, 'Delisted Vendor', false)
    """), {"id": uuid.uuid4(), "fid": pharmacy_seed["facility_id"]})
    await db_session.flush()

    default = await list_suppliers(db_session, facility_id=pharmacy_seed["facility_id"])
    assert "Delisted Vendor" not in [s.name for s in default.items]

    everything = await list_suppliers(
        db_session, facility_id=pharmacy_seed["facility_id"], include_inactive=True
    )
    assert "Delisted Vendor" in [s.name for s in everything.items], (
        "still reachable when explicitly asked for — the row is retained on purpose"
    )


async def test_stock_locations_are_scoped_to_the_callers_facility(
    db_session, inventory_seed, pharmacy_seed
):
    """verify_grn already 404s a location from another facility. This stops the
    picker from offering one in the first place, so the clerk never selects a
    store that will be refused on submit."""
    other_facility = uuid.uuid4()
    await db_session.execute(text("""
        INSERT INTO facilities (id, code, name, state_code, timezone)
        VALUES (:id, :code, 'Other Facility 2', 'OT', 'Asia/Kolkata')
    """), {"id": other_facility, "code": f"OT2{uuid.uuid4().hex[:8]}"})
    await db_session.execute(text("""
        INSERT INTO stock_locations (id, name, location_type, facility_id)
        VALUES (:id, 'Their Store', 'central', :fid)
    """), {"id": uuid.uuid4(), "fid": other_facility})
    await db_session.flush()

    result = await list_stock_locations(db_session, facility_id=pharmacy_seed["facility_id"])
    names = [loc.name for loc in result.items]

    assert "Test GRN Store" in names
    assert "Their Store" not in names


async def test_a_facility_with_no_suppliers_gets_nothing_rather_than_everyone_elses(
    db_session, inventory_seed
):
    """The failure mode of a missing WHERE clause is not an error — it is a
    list that looks perfectly plausible.

    Asserted from a facility that owns no suppliers at all, while the seed has
    already created one elsewhere. An unscoped query returns that seeded
    supplier and this test fails; a scoped one returns nothing. A test that
    only checked "our own supplier is present" would pass either way.
    """
    empty_facility = uuid.uuid4()
    await db_session.execute(text("""
        INSERT INTO facilities (id, code, name, state_code, timezone)
        VALUES (:id, :code, 'Empty Facility', 'EM', 'Asia/Kolkata')
    """), {"id": empty_facility, "code": f"EMP{uuid.uuid4().hex[:8]}"})
    await db_session.flush()

    result = await list_suppliers(db_session, facility_id=empty_facility)

    assert result.items == [], (
        "a facility that has onboarded no suppliers sees an empty picker, not "
        "another hospital's vendor list"
    )


# -- the read side that did not exist ---------------------------------------
#
# GRN, indents and adjustments each had POST-to-create and POST-to-approve and
# no GET anywhere. Each endpoint worked perfectly alone, which is why it passed
# review; together they formed an approval workflow nobody could reach.

async def test_an_hod_can_find_a_requested_indent_to_approve(
    db_session, inventory_seed, pharmacy_seed
):
    """The defect, stated as the thing a person could not do.

    POST /indents/{id}/approve existed. Nothing in the product could tell an
    HOD which id to put in it.
    """
    indent_id = uuid.uuid4()
    await db_session.execute(text("""
        INSERT INTO indents (id, facility_id, department_id, status, created_by, updated_by)
        VALUES (:id, :fid, :dept, 'requested', :user, :user)
    """), {
        "id": indent_id, "fid": pharmacy_seed["facility_id"],
        "dept": pharmacy_seed["department_id"], "user": pharmacy_seed["pharmacist_id"],
    })
    await db_session.flush()

    # 'requested' is the initial state, not 'pending' — ck_indents_status allows
    # requested/approved/rejected/issued only. Adjustments use 'pending'; indents
    # do not, and assuming one workflow's vocabulary fits another is how this
    # test failed the first time.
    awaiting = await list_indents(
        db_session, facility_id=pharmacy_seed["facility_id"], status="requested"
    )

    found = next((i for i in awaiting.items if i.id == indent_id), None)
    assert found is not None, "a requested indent must be reachable by its approver"
    assert found.department_name, "the requesting department is named, not just its id"


async def test_indents_do_not_leak_across_facilities(db_session, inventory_seed, pharmacy_seed):
    """Asserted against a real indent belonging to another facility rather than
    an empty result — an unscoped query returns it and this fails."""
    other_facility = uuid.uuid4()
    other_dept = uuid.uuid4()
    other_user = uuid.uuid4()
    await db_session.execute(text("""
        INSERT INTO facilities (id, code, name, state_code, timezone)
        VALUES (:id, :code, 'Indent Other', 'OT', 'Asia/Kolkata')
    """), {"id": other_facility, "code": f"IND{uuid.uuid4().hex[:8]}"})
    await db_session.execute(text("""
        INSERT INTO departments (id, name, code, facility_id)
        VALUES (:id, 'Their Dept', :code, :fid)
    """), {"id": other_dept, "code": f"TD{uuid.uuid4().hex[:6]}", "fid": other_facility})
    await db_session.execute(text("""
        INSERT INTO users (id, keycloak_sub, username, full_name, facility_id)
        VALUES (:id, :sub, :u, 'Their Storekeeper', :fid)
    """), {"id": other_user, "sub": str(uuid.uuid4()), "u": f"su{uuid.uuid4().hex[:6]}",
           "fid": other_facility})
    theirs = uuid.uuid4()
    await db_session.execute(text("""
        INSERT INTO indents (id, facility_id, department_id, status, created_by, updated_by)
        VALUES (:id, :fid, :dept, 'requested', :user, :user)
    """), {"id": theirs, "fid": other_facility, "dept": other_dept, "user": other_user})
    await db_session.flush()

    ours = await list_indents(db_session, facility_id=pharmacy_seed["facility_id"])

    assert all(i.id != theirs for i in ours.items), (
        "another hospital's indent must not appear on this approver's worklist"
    )


async def test_an_adjustment_row_carries_what_a_reviewer_needs_to_judge_it(
    db_session, inventory_seed, pharmacy_seed
):
    """A second approver certifies that a discrepancy is real.

    "Adjust -40 of 3f2a…" cannot be certified by anyone. The row names the
    item, the batch and both people already in the chain, and carries the
    quantity currently on hand — writing off 40 from a batch of 45 is a very
    different claim from writing off 40 from a batch of 4,000.
    """
    adjustment_id = uuid.uuid4()
    await db_session.execute(text("""
        INSERT INTO adjustments
            (id, facility_id, item_id, batch_id, quantity_change, reason,
             first_approver_id, status, created_by, updated_by)
        VALUES (:id, :fid, :item, :batch, -40, 'Damaged in transit',
                :first, 'pending', :creator, :creator)
    """), {
        "id": adjustment_id, "fid": pharmacy_seed["facility_id"],
        "item": pharmacy_seed["medicine_id"], "batch": pharmacy_seed["early_batch_id"],
        "first": inventory_seed["second_pharmacist_id"],
        "creator": pharmacy_seed["pharmacist_id"],
    })
    await db_session.flush()

    pending = await list_adjustments(
        db_session, facility_id=pharmacy_seed["facility_id"], status="pending"
    )
    row = next(a for a in pending.items if a.id == adjustment_id)

    assert row.item_name, "the medicine is named"
    assert row.batch_number, "the batch is identified"
    assert row.created_by_name, "who proposed it"
    assert row.first_approver_name, "who has already signed"
    assert row.second_approver_name is None, "nobody has countersigned yet"
    assert row.quantity_change < 0, "a write-down — the direction that conceals loss"
    assert row.quantity_on_hand is not None, "what the batch holds now, for comparison"
