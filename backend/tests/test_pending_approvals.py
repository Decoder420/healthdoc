"""Tests for the HOD dashboard's pending approvals (indents). Tested
directly against the service layer, no HTTP/JWT needed.
"""
import uuid
from datetime import datetime, timezone
from decimal import Decimal

import pytest

from app.departments.models import Department
from app.inventory.models import InventoryItem
from app.pharmacy.models import Indent, IndentItem
from app.queue import service
from app.users.models import Facility

pytestmark = pytest.mark.asyncio


async def _make_facility_and_department(db):
    facility_id = uuid.uuid4()
    department_id = uuid.uuid4()
    db.add(Facility(id=facility_id, code=f"F{uuid.uuid4().hex[:4]}", name="Test Facility", state_code="TS"))
    db.add(Department(id=department_id, code=f"D{uuid.uuid4().hex[:4]}", name="Test Dept", facility_id=facility_id))
    await db.flush()
    return facility_id, department_id


async def _make_inventory_item(db, name="Surgical Gloves"):
    item_id = uuid.uuid4()
    db.add(InventoryItem(id=item_id, name=name))
    await db.flush()
    return item_id


async def test_pending_approvals_returns_requested_indent_with_items(db):
    facility_id, department_id = await _make_facility_and_department(db)
    item_id = await _make_inventory_item(db)

    indent_id = uuid.uuid4()
    db.add(Indent(
        id=indent_id, facility_id=facility_id, department_id=department_id,
        status="requested", created_by=uuid.uuid4(),
    ))
    db.add(IndentItem(
        id=uuid.uuid4(), indent_id=indent_id, item_id=item_id, quantity_requested=Decimal("5"),
    ))
    await db.flush()

    approvals = await service.get_pending_approvals(db, department_id, facility_id)

    assert len(approvals) == 1
    assert approvals[0]["indent_id"] == indent_id
    assert len(approvals[0]["items"]) == 1
    assert approvals[0]["items"][0]["item_name"] == "Surgical Gloves"
    assert approvals[0]["items"][0]["quantity_requested"] == Decimal("5")


async def test_pending_approvals_excludes_already_decided_indents(db):
    facility_id, department_id = await _make_facility_and_department(db)

    for status in ("approved", "rejected", "issued"):
        db.add(Indent(
            id=uuid.uuid4(), facility_id=facility_id, department_id=department_id,
            status=status, created_by=uuid.uuid4(),
        ))
    await db.flush()

    approvals = await service.get_pending_approvals(db, department_id, facility_id)
    assert approvals == []


async def test_pending_approvals_scoped_by_department(db):
    facility_id, dept_a = await _make_facility_and_department(db)
    _facility_id_b, dept_b = await _make_facility_and_department(db)

    db.add(Indent(id=uuid.uuid4(), facility_id=facility_id, department_id=dept_a, status="requested", created_by=uuid.uuid4()))
    db.add(Indent(id=uuid.uuid4(), facility_id=facility_id, department_id=dept_b, status="requested", created_by=uuid.uuid4()))
    await db.flush()

    approvals = await service.get_pending_approvals(db, dept_a, facility_id)
    assert len(approvals) == 1
    assert approvals[0]["department_id"] == dept_a


async def test_pending_approvals_empty_when_nothing_pending(db):
    facility_id, department_id = await _make_facility_and_department(db)
    approvals = await service.get_pending_approvals(db, department_id, facility_id)
    assert approvals == []


async def test_pending_approvals_rejects_wrong_facility(db):
    facility_id, department_id = await _make_facility_and_department(db)
    other_facility_id = uuid.uuid4()

    with pytest.raises(Exception) as exc_info:
        await service.get_pending_approvals(db, department_id, other_facility_id)
    assert "404" in str(exc_info.value) or "not found" in str(exc_info.value).lower()
