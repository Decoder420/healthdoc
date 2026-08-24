"""Safety and determinism contracts for the #251 demo seed."""

from types import SimpleNamespace

import pytest

from scripts import seed_demo_251


@pytest.mark.parametrize("environment", ["dev", "demo", "local", "test"])
def test_demo_seed_accepts_only_explicit_demo_environments(monkeypatch, environment: str) -> None:
    monkeypatch.setattr(
        "app.common.config.get_settings",
        lambda: SimpleNamespace(environment=environment),
    )
    seed_demo_251._refuse_outside_demo()


def test_demo_seed_refuses_production(monkeypatch) -> None:
    monkeypatch.setattr(
        "app.common.config.get_settings",
        lambda: SimpleNamespace(environment="production"),
    )
    with pytest.raises(SystemExit, match="Refusing to seed fabricated clinical data"):
        seed_demo_251._refuse_outside_demo()


def test_demo_seed_ids_are_stable_and_unique() -> None:
    ids = {
        value
        for name, value in vars(seed_demo_251).items()
        if name.endswith("_ID") and name != "FACILITY_ID"
    }
    assert len(ids) == 13
