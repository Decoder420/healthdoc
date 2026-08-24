"""Production Keycloak realm rendering contracts for issue #250."""

import importlib.util
import json
from pathlib import Path

import pytest

MODULE = Path(__file__).parents[2] / "scripts" / "deploy" / "render_keycloak_realm.py"
SPEC = importlib.util.spec_from_file_location("render_keycloak_realm", MODULE)
assert SPEC and SPEC.loader
renderer = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(renderer)


def _source(tmp_path: Path) -> Path:
    source = tmp_path / "realm.json"
    source.write_text(
        json.dumps(
            {
                "clients": [
                    {
                        "clientId": "healthdoc-frontend",
                        "redirectUris": ["https://localhost/*"],
                        "webOrigins": ["https://localhost"],
                    }
                ]
            }
        ),
        encoding="utf-8",
    )
    return source


def test_render_replaces_every_frontend_origin(tmp_path: Path) -> None:
    destination = tmp_path / "rendered" / "realm.json"
    renderer.render(_source(tmp_path), destination, "https://healthdoc.example.org/")

    client = json.loads(destination.read_text(encoding="utf-8"))["clients"][0]
    assert client["redirectUris"] == ["https://healthdoc.example.org/*"]
    assert client["webOrigins"] == ["https://healthdoc.example.org"]


@pytest.mark.parametrize(
    "origin",
    ["http://healthdoc.example.org", "https://healthdoc.example.org/path"],
)
def test_render_rejects_non_https_origin_or_path(tmp_path: Path, origin: str) -> None:
    with pytest.raises(ValueError, match="HTTPS origin"):
        renderer.render(_source(tmp_path), tmp_path / "out.json", origin)
