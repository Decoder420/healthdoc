"""The ZAP release gate must fail closed, not turn a missing scan green."""

from __future__ import annotations

import importlib.util
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parents[2] / "scripts" / "security" / "check_zap_report.py"
SPEC = importlib.util.spec_from_file_location("check_zap_report", SCRIPT)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def test_medium_and_low_alerts_do_not_block_release():
    severities, blockers = MODULE.summarize(
        {
            "site": [
                {
                    "alerts": [
                        {"riskcode": "2", "riskdesc": "Medium (Medium)", "name": "CSP"},
                        {"riskcode": "1", "riskdesc": "Low (Medium)", "name": "Timestamp"},
                    ]
                }
            ]
        }
    )
    assert severities == {"Medium": 1, "Low": 1}
    assert blockers == []


@pytest.mark.parametrize("riskcode", ["3", "4"])
def test_high_and_future_critical_alerts_block_release(riskcode):
    _, blockers = MODULE.summarize(
        {"site": [{"alerts": [{"riskcode": riskcode, "riskdesc": "High (High)"}]}]}
    )
    assert len(blockers) == 1


@pytest.mark.parametrize(
    "report",
    [
        {},
        {"site": []},
        {"site": [{"alerts": {}}]},
        {"site": [{"alerts": [{"riskdesc": "High"}]}]},
        {"site": [{"alerts": [{"riskcode": "9", "riskdesc": "Unknown"}]}]},
    ],
)
def test_missing_or_malformed_scan_evidence_cannot_pass(report):
    with pytest.raises(MODULE.InvalidZapReport):
        MODULE.summarize(report)
