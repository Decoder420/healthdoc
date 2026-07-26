"""Shared test fixtures for the pharmacy module.

TEMPORARY AUTH + AUDIT STUBS
------------------------------
app/auth/deps.py and app/audit/service.py don't exist in the repo yet.
These blocks register fake modules directly in sys.modules ONLY for the
test process — never written to disk, so they can never collide with the
real files when B1/B7 land them.
"""
from __future__ import annotations

import sys
import types
import uuid
from dataclasses import dataclass, field
from decimal import Decimal

import pytest

if "app.auth" not in sys.modules:
    sys.modules["app.auth"] = types.ModuleType("app.auth")

if "app.auth.deps" not in sys.modules:
    _fake_deps = types.ModuleType("app.auth.deps")

    from typing import Annotated

    from fastapi import Depends

    @dataclass
    class _User:
        id: uuid.UUID
        facility_id: uuid.UUID
        sub: str
        roles: list[str] = field(default_factory=list)

    async def _get_current_user_stub() -> _User:
        return _User(id=uuid.uuid4(), facility_id=uuid.uuid4(), sub="stub-sub", roles=[])

    CurrentUser = Annotated[_User, Depends(_get_current_user_stub)]

    def require_roles(*roles: str):
        async def _dep(user: CurrentUser) -> _User:
            return user
        return _dep

    _fake_deps.CurrentUser = CurrentUser
    _fake_deps.User = _User
    _fake_deps.require_roles = require_roles
    _fake_deps._get_current_user_stub = _get_current_user_stub
    sys.modules["app.auth.deps"] = _fake_deps


from app.auth.deps import CurrentUser  # noqa: E402

if "app.audit" not in sys.modules:
    sys.modules["app.audit"] = types.ModuleType("app.audit")

if "app.audit.service" not in sys.modules:
    _fake_audit = types.ModuleType("app.audit.service")

    class _RecordingWriteAuditLog:
        def __init__(self):
            self.calls: list[dict] = []

        async def __call__(self, db, **kwargs):
            self.calls.append(kwargs)

    _fake_audit.write_audit_log = _RecordingWriteAuditLog()
    sys.modules["app.audit.service"] = _fake_audit

from app.audit.service import write_audit_log as _write_audit_log_stub  # noqa: E402


@pytest.fixture
def audit_log():
    _write_audit_log_stub.calls.clear()
    return _write_audit_log_stub


class FakeResult:
    def __init__(self, rows=None, scalar=None):
        self._rows = rows or []
        self._scalar = scalar

    def scalar_one(self):
        return self._scalar

    def scalar_one_or_none(self):
        return self._scalar

    def mappings(self):
        return self

    def all(self):
        return self._rows

    def first(self):
        return self._rows[0] if self._rows else None


class FakeSession:
    def __init__(self):
        self.calls: list[tuple[str, dict]] = []
        self._scripted: dict[str, list[FakeResult]] = {}
        self.db = {
            "prescriptions": {},
            "inventory_batches": {},
            "pharmacy_dispenses": [],
            "pharmacy_dispense_items": [],
            "stock_ledger": [],
        }

    def expect(self, substring: str, result: FakeResult):
        self._scripted.setdefault(substring, []).append(result)
        return self

    async def execute(self, stmt, params: dict | None = None):
        sql = getattr(stmt, "text", str(stmt))
        params = params or {}
        self.calls.append((sql, params))

        for substring, results in self._scripted.items():
            if substring in sql and results:
                return results.pop(0)

        return self._handle_builtin(sql, params)

    def _handle_builtin(self, sql: str, params: dict) -> FakeResult:
        if "SELECT id, patient_id, encounter_id FROM prescriptions" in sql:
            row = self.db["prescriptions"].get(params["id"])
            return FakeResult(rows=[row] if row else [])

        if "SELECT id, quantity FROM inventory_batches" in sql and "FOR UPDATE" in sql:
            row = self.db["inventory_batches"].get(params["id"])
            return FakeResult(rows=[row] if row else [])

        if "SELECT COALESCE(MAX(version), 0) + 1" in sql:
            existing = [
                d for d in self.db["pharmacy_dispenses"]
                if d["prescription_id"] == params["id"]
            ]
            return FakeResult(scalar=(max((d["version"] for d in existing), default=0) + 1))

        if sql.startswith("UPDATE pharmacy_dispenses SET is_current = false"):
            for d in self.db["pharmacy_dispenses"]:
                if d["prescription_id"] == params["id"]:
                    d["is_current"] = False
            return FakeResult()

        if sql.strip().startswith("INSERT INTO pharmacy_dispenses"):
            self.db["pharmacy_dispenses"].append({
                "id": params["id"],
                "prescription_id": params["prescription_id"],
                "status": params["status"],
                "dispensed_by": params["dispensed_by"],
                "version": params["version"],
                "is_current": True,
                "created_at": "2026-07-26T00:00:00Z",
            })
            return FakeResult()

        if sql.strip().startswith("INSERT INTO pharmacy_dispense_items"):
            self.db["pharmacy_dispense_items"].append(dict(params))
            return FakeResult()

        if sql.strip().startswith("UPDATE inventory_batches SET quantity"):
            batch = self.db["inventory_batches"][params["id"]]
            batch["quantity"] -= Decimal(params["qty"])
            return FakeResult()

        if sql.strip().startswith("INSERT INTO stock_ledger"):
            batch = self.db["inventory_batches"][params["batch_id"]]
            self.db["stock_ledger"].append({
                "item_id": batch["item_id"],
                "batch_id": params["batch_id"],
                "quantity": Decimal(params["neg_qty"]),
                "reference_id": params["dispense_id"],
                "performed_by": params["performed_by"],
            })
            return FakeResult()

        if sql.strip() == "SELECT created_at FROM pharmacy_dispenses WHERE id = :id":
            d = next(d for d in self.db["pharmacy_dispenses"] if d["id"] == params["id"])
            return FakeResult(scalar=d["created_at"])

        raise AssertionError(f"FakeSession: no handler for SQL:\n{sql}\nparams={params}")


@pytest.fixture
def fake_session() -> FakeSession:
    return FakeSession()


@pytest.fixture
def current_user():
    from app.auth.deps import User
    return User(id=uuid.uuid4(), facility_id=uuid.uuid4(), sub="pharmacist-1", roles=["pharmacist"])

from fastapi.testclient import TestClient

from app.main import app as _fastapi_app


@pytest.fixture
def client():
    return TestClient(_fastapi_app)
