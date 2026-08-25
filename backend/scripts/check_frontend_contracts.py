"""Compare every frontend ``api()`` call with FastAPI's generated OpenAPI.

This is intentionally source-based: a call removed or added in a feature
service changes the matrix in the same PR, and CI fails before an invalid path
can reach a browser. Template parameters are compared structurally, so
``${admissionId}`` matches ``{admission_id}`` without pretending their names are
runtime validation.
"""
from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path

from app.main import app

API_CALL = re.compile(r"\bapi(?:<[^;\n]*?>)?\(")
STRING_ARG = re.compile(r"\s*([\"'`])(.+?)\1", re.DOTALL)
METHOD = re.compile(r"\bmethod\s*:\s*[\"']([A-Za-z]+)[\"']")
TEMPLATE_PARAM = re.compile(r"\$\{[^}]+\}")
PATH_PARAM = re.compile(r"\{[^}]+\}")


@dataclass(frozen=True)
class FrontendCall:
    method: str
    path: str
    source: str
    line: int


def _call_body(source: str, opening_paren: int) -> str:
    """The text between an `api(` and its matching `)`.

    Skips comments as well as strings. It used to skip only strings, which made
    an ordinary English apostrophe inside a `//` comment fatal:

        return api<T>("/patients/search", {
          // Aadhaar is never sent from this UI. Also PR #412's call.
          //                                                  ^ opens a quote
        });

    The scan entered quote mode at that apostrophe, never found a closing one,
    ran off the end of the file and raised "unterminated api() call" — naming a
    call that was perfectly well-formed, several hundred lines from the real
    cause. Any comment containing "doesn't", "patient's" or similar would do the
    same, so this was a trap sitting in front of everyone.

    Regex literals are still not tracked. None in the codebase contain an
    unbalanced parenthesis or a stray quote, and distinguishing `/` as division
    from `/` as a regex opener needs more context than this scanner has. If a
    regex ever does break it, that is the place to look.
    """
    depth = 1
    index = opening_paren + 1
    quote: str | None = None
    escaped = False
    comment: str | None = None  # "line" or "block"

    while index < len(source):
        char = source[index]
        nxt = source[index + 1] if index + 1 < len(source) else ""

        if comment == "line":
            if char == "\n":
                comment = None
        elif comment == "block":
            if char == "*" and nxt == "/":
                comment = None
                index += 1
        elif quote is not None:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
        elif char == "/" and nxt == "/":
            comment = "line"
            index += 1
        elif char == "/" and nxt == "*":
            comment = "block"
            index += 1
        elif char in {"'", '"', "`"}:
            quote = char
        elif char == "(":
            depth += 1
        elif char == ")":
            depth -= 1
            if depth == 0:
                return source[opening_paren + 1 : index]
        index += 1

    raise ValueError("unterminated api() call")


def frontend_calls(frontend_root: Path) -> list[FrontendCall]:
    calls: list[FrontendCall] = []
    for file in sorted((*frontend_root.rglob("*.ts"), *frontend_root.rglob("*.tsx"))):
        source = file.read_text(encoding="utf-8-sig")
        for match in API_CALL.finditer(source):
            body = _call_body(source, match.end() - 1)
            path_match = STRING_ARG.match(body)
            if path_match is None:
                continue
            path = TEMPLATE_PARAM.sub("{param}", path_match.group(2)).split("?", 1)[0]
            method_match = METHOD.search(body)
            method = method_match.group(1).upper() if method_match else "GET"
            calls.append(
                FrontendCall(
                    method=method,
                    path=path,
                    source=str(file.relative_to(frontend_root.parent.parent)),
                    line=source.count("\n", 0, match.start()) + 1,
                )
            )
    return calls


def structural_path(path: str) -> str:
    path = path.removeprefix("/api/v1")
    return PATH_PARAM.sub("{}", path)


def backend_routes() -> dict[tuple[str, str], str]:
    routes: dict[tuple[str, str], str] = {}
    for path, operations in app.openapi()["paths"].items():
        for method in operations:
            routes[(method.upper(), structural_path(path))] = path.removeprefix("/api/v1")
    return routes


REMEDIATIONS = (
    ("POST /vitals", "Fixed", "POST /nursing/vitals"),
    ("POST /nursing/handover-notes", "Disabled", "No published write contract"),
    ("POST /nursing/movement", "Fixed", "POST /admissions/{admission_id}/transfer"),
    ("POST /procedures", "Fixed", "Facility-scoped, idempotent procedure record contract added"),
    ("POST /nursing/notes", "Disabled", "No published write contract"),
    ("POST /discharges", "Fixed", "POST /admissions/{admission_id}/discharge"),
    ("GET /wards", "Fixed", "Facility-scoped backend list added"),
    ("GET /beds", "Fixed", "GET /wards/{ward_id}/beds"),
    ("GET /admissions?status=admitted", "Fixed", "Facility-scoped backend list added"),
    ("GET /discharges", "Fixed", "GET /admissions/discharges"),
)


def render_matrix(calls: list[FrontendCall], routes: dict[tuple[str, str], str]) -> str:
    lines = [
        "# Frontend/backend API contract matrix",
        "",
        "Generated by `python -m scripts.check_frontend_contracts`. Do not edit by hand.",
        "",
        "| Frontend call | Backend route | Source | Status |",
        "|---|---|---|---|",
    ]
    for call in calls:
        backend_path = routes.get((call.method, structural_path(call.path)))
        status = "valid" if backend_path else "INVALID"
        backend = f"{call.method} {backend_path}" if backend_path else "—"
        lines.append(
            f"| `{call.method} {call.path}` | `{backend}` | "
            f"`{call.source}:{call.line}` | {status} |"
        )

    lines.extend(
        [
            "",
            "## Ten invalid calls found during the release audit",
            "",
            "| Previous call | Resolution | Current contract |",
            "|---|---|---|",
        ]
    )
    lines.extend(
        f"| `{previous}` | {resolution} | {current} |"
        for previous, resolution, current in REMEDIATIONS
    )
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--frontend", type=Path, default=Path("../frontend/src"))
    parser.add_argument("--write", type=Path)
    args = parser.parse_args()

    calls = frontend_calls(args.frontend)
    routes = backend_routes()
    matrix = render_matrix(calls, routes)
    invalid = [
        call
        for call in calls
        if (call.method, structural_path(call.path)) not in routes
    ]

    if args.write:
        args.write.parent.mkdir(parents=True, exist_ok=True)
        args.write.write_text(matrix, encoding="utf-8")
    else:
        print(matrix, end="")

    if invalid:
        print(f"Contract check failed: {len(invalid)} invalid frontend API call(s)")
        return 1
    print(f"Contract check passed: {len(calls)} frontend API call(s) match OpenAPI")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
