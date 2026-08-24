#!/usr/bin/env python3
"""Fail closed unless a ZAP JSON report contains zero High/Critical alerts."""

from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path
from typing import Any


class InvalidZapReport(ValueError):
    """The input is not a populated ZAP JSON report."""


def summarize(report: dict[str, Any]) -> tuple[Counter[str], list[dict[str, Any]]]:
    sites = report.get("site")
    if not isinstance(sites, list) or not sites:
        raise InvalidZapReport("report has no scanned sites; refusing a false green")

    severities: Counter[str] = Counter()
    blockers: list[dict[str, Any]] = []
    for site in sites:
        alerts = site.get("alerts", []) if isinstance(site, dict) else []
        if not isinstance(alerts, list):
            raise InvalidZapReport("site.alerts is not a list")
        for alert in alerts:
            if not isinstance(alert, dict):
                raise InvalidZapReport("alert is not an object")
            risk = str(alert.get("riskdesc", "Unknown")).split()[0]
            severities[risk] += 1
            try:
                risk_code = int(str(alert.get("riskcode", "0")))
            except ValueError as exc:
                raise InvalidZapReport("alert riskcode is not an integer") from exc
            if risk_code >= 3:  # ZAP: 3=High; retain >=4 for future Critical levels.
                blockers.append(alert)
    return severities, blockers


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("report", type=Path)
    args = parser.parse_args()

    try:
        report = json.loads(args.report.read_text(encoding="utf-8"))
        severities, blockers = summarize(report)
    except (OSError, json.JSONDecodeError, InvalidZapReport) as exc:
        print(f"ZAP REPORT INVALID: {exc}")
        return 2

    ordered = ", ".join(f"{name}={severities[name]}" for name in sorted(severities))
    print(f"ZAP alerts: {ordered or 'none'}")
    if blockers:
        for alert in blockers:
            print(f"BLOCKER: {alert.get('riskdesc')} — {alert.get('name')} — {alert.get('url')}")
        print(f"ZAP GATE FAILED: {len(blockers)} High/Critical alert(s)")
        return 1
    print("ZAP GATE PASSED: 0 High/Critical alerts")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
