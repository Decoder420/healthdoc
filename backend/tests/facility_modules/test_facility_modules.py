"""facility_modules (0027) — the table that gates five whole modules.

`require_module()` reads this to decide whether pharmacy, lab, radiology, OT and
blood bank answer at all. Before this there was no ORM model, no read beyond a
{code: bool} summary, and **no write path** — enabling or disabling a module for
a hospital was possible only by direct SQL against production.

Shares this package's PostgreSQL fixture: `config` is JSONB, and the
module_code CHECK constraint does not exist in the ORM-built SQLite schema.

The default-on rule is the thing most worth protecting here. app/common/modules.py:
"No facility_modules row => module ENABLED". A write path that assumed a row
existed, or a list that showed only stored rows, would each quietly misrepresent
a brand-new facility as having everything switched off.
"""
from __future__ import annotations

import uuid

import pytest
import sqlalchemy as sa
from fastapi import HTTPException

from app.common import facility_modules as fm
from app.common.enums import ModuleCode
from app.common.modules import get_capabilities

pytestmark = pytest.mark.asyncio


class _Admin:
    def __init__(self, facility_id: uuid.UUID) -> None:
        self.facility_id = facility_id
        self.id = uuid.uuid4()
        self.roles = ["admin"]


async def _facility(db) -> uuid.UUID:
    fid = uuid.uuid4()
    await db.execute(
        sa.text(
            "INSERT INTO facilities (id, code, name, state_code) "
            "VALUES (:id, :code, 'Module Test Facility', 'TS')"
        ),
        {"id": fid, "code": f"M{uuid.uuid4().hex[:5].upper()}"},
    )
    await db.flush()
    return fid


async def test_a_facility_with_no_rows_lists_everything_enabled(db):
    """Default-on. A new facility has no rows at all, and an admin screen must
    show five enabled modules rather than an empty list."""
    fid = await _facility(db)

    result = await fm.list_facility_modules(_Admin(fid), db=db)

    assert {i.module_code for i in result.items} == ModuleCode.values()
    assert all(i.is_enabled for i in result.items)
    assert all(i.id is None for i in result.items), (
        "synthesised defaults carry id=None — that is how a caller tells a "
        "default from a stored decision"
    )


async def test_disabling_creates_the_row_that_did_not_exist(db):
    """Upsert, not update: the first disable has nothing to update."""
    fid = await _facility(db)

    row = await fm.update_facility_module(
        "pharmacy",
        fm.FacilityModuleUpdate(is_enabled=False, disabled_reason="No licensed pharmacist on site"),
        _Admin(fid),
        db=db,
    )

    assert row.is_enabled is False
    assert row.id is not None, "a real row now exists"
    assert row.disabled_reason == "No licensed pharmacist on site"
    assert row.disabled_at is not None


async def test_disabling_actually_gates_the_module(db):
    """The point of the table. get_capabilities is what require_module and
    GET /facility/capabilities both read."""
    fid = await _facility(db)

    before = await get_capabilities(db, fid)
    assert before["lab"] is True

    await fm.update_facility_module(
        "lab",
        fm.FacilityModuleUpdate(is_enabled=False, disabled_reason="Lab under renovation"),
        _Admin(fid),
        db=db,
    )

    after = await get_capabilities(db, fid)
    assert after["lab"] is False
    assert after["pharmacy"] is True, "disabling one module must not touch another"


async def test_disabling_without_a_reason_is_refused(db):
    """Switching a module off makes every endpoint in it answer 409 for the
    whole hospital. The next administrator needs to know it was deliberate."""
    fid = await _facility(db)

    for reason in (None, "", "   "):
        with pytest.raises(HTTPException) as caught:
            await fm.update_facility_module(
                "ot",
                fm.FacilityModuleUpdate(is_enabled=False, disabled_reason=reason),
                _Admin(fid),
                db=db,
            )
        assert caught.value.status_code == 422
        assert caught.value.detail["code"] == "disabled_reason_required"


async def test_re_enabling_clears_the_stale_reason(db):
    """A module that is on must not still carry "under renovation" — the next
    person reading the row would think it is off."""
    fid = await _facility(db)
    admin = _Admin(fid)

    await fm.update_facility_module(
        "radiology",
        fm.FacilityModuleUpdate(is_enabled=False, disabled_reason="Scanner out of service"),
        admin, db=db,
    )
    row = await fm.update_facility_module(
        "radiology", fm.FacilityModuleUpdate(is_enabled=True), admin, db=db,
    )

    assert row.is_enabled is True
    assert row.disabled_reason is None
    assert row.enabled_at is not None


async def test_a_core_module_cannot_be_switched_off(db):
    """Only five modules are toggleable. Billing, patients, orders and the rest
    are core — app/common/modules.py raises if you try to gate one, and this
    endpoint refuses before it can create a row the CHECK constraint would
    reject anyway."""
    fid = await _facility(db)

    with pytest.raises(HTTPException) as caught:
        await fm.update_facility_module(
            "billing",
            fm.FacilityModuleUpdate(is_enabled=False, disabled_reason="nope"),
            _Admin(fid),
            db=db,
        )

    assert caught.value.status_code == 400
    assert caught.value.detail["code"] == "not_a_toggleable_module"


async def test_one_facilitys_toggle_does_not_affect_another(db):
    ours, theirs = await _facility(db), await _facility(db)

    await fm.update_facility_module(
        "blood_bank",
        fm.FacilityModuleUpdate(is_enabled=False, disabled_reason="No blood bank licence"),
        _Admin(ours), db=db,
    )

    assert (await get_capabilities(db, ours))["blood_bank"] is False
    assert (await get_capabilities(db, theirs))["blood_bank"] is True


async def test_the_list_mixes_stored_rows_and_defaults(db):
    """After one toggle, four modules are still defaults and one is a decision.
    Both have to appear, and be distinguishable."""
    fid = await _facility(db)
    admin = _Admin(fid)

    await fm.update_facility_module(
        "ot", fm.FacilityModuleUpdate(is_enabled=False, disabled_reason="No OT at this site"),
        admin, db=db,
    )

    items = {i.module_code: i for i in (await fm.list_facility_modules(admin, db=db)).items}

    assert items["ot"].is_enabled is False
    assert items["ot"].id is not None, "a stored decision"
    assert items["lab"].is_enabled is True
    assert items["lab"].id is None, "still a default"
