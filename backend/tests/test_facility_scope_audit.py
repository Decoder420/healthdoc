"""A structural guard against the defect class that keeps recurring.

Three times this release the same bug shipped in a different module:

  POST /orders          took `created_by` from the request body
  POST /encounters      took `current_db_user` AS A PARAMETER AND NEVER USED IT —
                        authorship, attending clinician and the facility the row
                        lands in all came from the body, so an encounter could be
                        written into another hospital's records
  radiology handlers    reached radiology_order_items with no facility predicate,
                        because that table has no facility_id and the scope has to
                        come through a join

Each was found by reading one module carefully. That does not scale, and the
P0.4 audit — which read every module — still missed create_encounter, because it
checked READ paths and a create has no row yet to scope.

So this asserts the SHAPE instead of the instances. It walks the AST of every
router and fails on two patterns:

  1. a handler that accepts an authenticated actor and never reads it — exactly
     what create_encounter did, and invisible in review because the parameter is
     right there in the signature;
  2. a handler that takes a resource id and mentions neither the actor nor a
     facility — nothing to scope with.

Both have real, reasoned exceptions. Those are listed below WITH the reason,
not silenced, so adding one is a deliberate act a reviewer can see in the diff.

This does not prove any particular endpoint is correctly scoped. It proves no
endpoint has thrown away the means to be.
"""
from __future__ import annotations

import ast
import pathlib

import pytest

_APP = pathlib.Path(__file__).resolve().parents[1] / "app"

_ACTOR_PARAMS = {"current_user", "current_db_user", "user"}


# --- verified exceptions ----------------------------------------------------
#
# Each was read and confirmed at the time of writing. Cite the reason; a bare
# name here would just be a silenced failure.

ACTOR_UNUSED_OK = {
    # consent_purposes is GLOBAL reference data — the table has no facility_id
    # at all (purpose_code, description, default_expiry_days, ...). The
    # CurrentUser dependency IS the check; there is nothing further to scope by.
    "list_consent_purposes",
}

NO_SCOPE_OK = {
    # The OPD waiting-room wall screen. Deliberately unauthenticated — a dumb TV
    # browser has no login — and the published payload was verified PII-free at
    # queue/service.py's _advance_queue(): department_id, queue_id, doctor_name,
    # room_number, token_display. No patient name, no UHID.
    "queue_display_stream",
    # A stub that echoes the ids it was given and touches no data
    # (service.check_pmjay_eligibility takes no db session). It leaks nothing
    # today. See the accompanying test, which pins the "touches no data" part —
    # the moment it grows a real beneficiary lookup, it needs scoping.
    "get_pmjay_eligibility",
}


def _route_handlers() -> list[tuple[pathlib.Path, ast.AsyncFunctionDef | ast.FunctionDef]]:
    found = []
    for path in sorted(_APP.rglob("*.py")):
        src = path.read_text()
        try:
            tree = ast.parse(src)
        except SyntaxError:  # pragma: no cover
            continue
        for node in ast.walk(tree):
            if not isinstance(node, (ast.AsyncFunctionDef, ast.FunctionDef)):
                continue
            if not any("router" in ast.dump(d) for d in node.decorator_list):
                continue
            found.append((path, node))
    return found


def test_the_audit_actually_finds_handlers():
    """A guard on the guard.

    If the decorator heuristic ever stops matching — a rename, a different
    router idiom — every assertion below passes over an empty list and reports
    green while checking nothing. That is the vacuous-test failure mode, and it
    has already bitten this suite twice.
    """
    handlers = _route_handlers()
    assert len(handlers) > 80, f"expected the full route surface, found {len(handlers)}"


def test_no_handler_accepts_an_authenticated_actor_and_ignores_it():
    """The create_encounter shape.

    `async def create_encounter(payload, current_db_user, db)` — the parameter
    was present, so the signature looked scoped, and the body passed the payload
    straight through. Authorship and facility both came from the request.
    """
    offenders = []
    for path, node in _route_handlers():
        args = [a.arg for a in node.args.args + node.args.kwonlyargs]
        actor = next((a for a in args if a in _ACTOR_PARAMS), None)
        if actor is None or node.name in ACTOR_UNUSED_OK:
            continue
        reads = sum(
            1
            for n in ast.walk(node)
            if isinstance(n, ast.Name) and n.id == actor and isinstance(n.ctx, ast.Load)
        )
        if reads == 0:
            offenders.append(f"{path.name}:{node.lineno} {node.name}() ignores `{actor}`")

    assert offenders == [], (
        "these handlers accept the authenticated caller and never read it, which is "
        "how POST /encounters let a request body choose the facility a clinical "
        "record was written into:\n  " + "\n  ".join(offenders)
    )


def test_every_handler_taking_a_resource_id_has_something_to_scope_by():
    """A handler addressing a row by id must know who is asking.

    Not proof of correct scoping — a handler can hold `current_db_user` and
    still forget the predicate, which is what the radiology handlers did. But a
    handler with no actor and no facility cannot be scoped at all, so this is
    the floor.
    """
    offenders = []
    for path, node in _route_handlers():
        if node.name in NO_SCOPE_OK:
            continue
        args = [a.arg for a in node.args.args + node.args.kwonlyargs]
        id_args = [a for a in args if a.endswith("_id") and a != "facility_id"]
        if not id_args:
            continue
        body = ast.dump(node)
        if "facility_id" in body or any(a in _ACTOR_PARAMS for a in args):
            continue
        offenders.append(f"{path.name}:{node.lineno} {node.name}({', '.join(id_args)})")

    assert offenders == [], (
        "these handlers address a row by id with no caller and no facility in "
        "scope:\n  " + "\n  ".join(offenders)
    )


def test_the_pmjay_stub_still_touches_no_data():
    """The exception above is only safe while the stub stays a stub.

    check_pmjay_eligibility takes no AsyncSession, so it cannot read anything.
    The day someone wires in a real beneficiary lookup, this fails and the
    handler has to grow the facility scope its allowlist entry assumes it does
    not need.
    """
    import inspect

    from app.billing import service

    params = inspect.signature(service.check_pmjay_eligibility).parameters
    assert "db" not in params and "session" not in params, (
        "check_pmjay_eligibility now takes a database session, so it is no longer "
        "an inert stub. Remove get_pmjay_eligibility from NO_SCOPE_OK and scope it "
        "to the caller's facility."
    )


@pytest.mark.parametrize("name", sorted(ACTOR_UNUSED_OK | NO_SCOPE_OK))
def test_every_allowlisted_exception_still_exists(name):
    """An allowlist entry for a handler that has been renamed or deleted is a
    silent hole: it stops matching, so it stops excusing anything, but it also
    stops anyone noticing the entry is stale. Fail when it rots."""
    assert any(node.name == name for _, node in _route_handlers()), (
        f"'{name}' is allowlisted in this file but no longer exists as a route "
        "handler. Remove the entry."
    )
