"""Unit checks for the authenticated #244 load-test gate."""

import importlib.util
from pathlib import Path

import pytest

MODULE_PATH = Path(__file__).parents[1] / "scripts" / "load-test" / "load_test.py"
SPEC = importlib.util.spec_from_file_location("healthdoc_load_test", MODULE_PATH)
assert SPEC and SPEC.loader
load_test = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(load_test)


def test_load_token_bundle_accepts_browser_capture(tmp_path: Path) -> None:
    token_file = tmp_path / "doctor.json"
    token_file.write_text(
        '{"access_token":"signed","refresh_token":"refresh","expires_in":60,"obtained_at":1}',
        encoding="utf-8",
    )

    assert load_test.load_token_bundle(tmp_path, token_file.name)["access_token"] == "signed"


@pytest.mark.parametrize(
    "content",
    [
        "",
        "not-json",
        '{"access_token":"signed"}',
        '{"access_token":"","refresh_token":"refresh","expires_in":60,"obtained_at":1}',
    ],
)
def test_load_token_bundle_rejects_invalid_capture(tmp_path: Path, content: str) -> None:
    token_file = tmp_path / "doctor.json"
    token_file.write_text(content, encoding="utf-8")

    with pytest.raises(ValueError):
        load_test.load_token_bundle(tmp_path, token_file.name)


def test_prepare_actors_requires_exact_concurrency(tmp_path: Path) -> None:
    (tmp_path / "doctor.json").write_text(
        '{"access_token":"signed","refresh_token":"refresh","expires_in":60,"obtained_at":1}',
        encoding="utf-8",
    )
    config = {
        "base_url": "https://localhost",
        "token_path": "/token",
        "client_id": "healthdoc-frontend",
        "actors": [
            {
                "name": "doctor",
                "users": 10,
                "token_file": "doctor.json",
                "scenarios": [{"name": "worklist", "path": "/api/v1/queue/worklist"}],
            }
        ]
    }

    with pytest.raises(ValueError, match="assigns 10 users"):
        load_test.prepare_actors(config, tmp_path, expected_users=50)
