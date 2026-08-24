"""Structural guard for the three N+1 reads removed in #241."""
from __future__ import annotations

import ast
import inspect
import textwrap

from app.integrations.abdm.fhir.service import build_encounter_close_bundles
from app.queue.service import get_emergency_escalations, get_pending_approvals


def _database_awaits_inside_loops(function) -> list[str]:
    tree = ast.parse(textwrap.dedent(inspect.getsource(function)))
    violations: list[str] = []

    for loop in (node for node in ast.walk(tree) if isinstance(node, ast.For | ast.AsyncFor)):
        for node in ast.walk(loop):
            if not isinstance(node, ast.Await) or not isinstance(node.value, ast.Call):
                continue
            target = node.value.func
            if (
                isinstance(target, ast.Attribute)
                and isinstance(target.value, ast.Name)
                and target.value.id == "db"
                and target.attr in {"execute", "get", "scalar"}
            ):
                violations.append(f"line {node.lineno}: await db.{target.attr}(...) inside loop")
    return violations


def test_reviewed_hot_paths_do_not_query_the_database_inside_result_loops() -> None:
    for function in (
        build_encounter_close_bundles,
        get_emergency_escalations,
        get_pending_approvals,
    ):
        assert _database_awaits_inside_loops(function) == [], function.__name__
