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


REAL_REALM = Path(__file__).parents[2] / "infra" / "keycloak" / "realm-healthdoc.json"


def _realm_dict() -> dict:
    """A source realm that is actually VALID.

    This fixture used to carry only `clients`, because origin substitution was
    all the renderer did. The renderer now also refuses to emit a production
    realm that has lost its MFA, brute-force or password controls — and the old
    fixture, lacking all three, made that guard fire.

    That failure was the guard working. The fix is to describe a realistic
    realm here rather than to soften the check: a fixture thin enough to be
    invalid is a fixture that cannot tell you whether rendering is correct.
    """
    return {
        "clients": [
            {
                "clientId": "healthdoc-frontend",
                "redirectUris": ["https://localhost/*"],
                "webOrigins": ["https://localhost"],
            }
        ],
        "requiredActions": [
            {
                "alias": "CONFIGURE_TOTP",
                "name": "Configure OTP",
                "providerId": "CONFIGURE_TOTP",
                "enabled": True,
                "defaultAction": False,
                "priority": 10,
                "config": {},
            }
        ],
        "bruteForceProtected": True,
        "passwordPolicy": "length(12)",
        "otpPolicyType": "totp",
        "sslRequired": "external",
    }


def _source(tmp_path: Path, **overrides) -> Path:
    """Write a source realm. `overrides` set to None delete a key."""
    realm = _realm_dict()
    for key, value in overrides.items():
        if value is None:
            realm.pop(key, None)
        else:
            realm[key] = value
    source = tmp_path / "realm.json"
    source.write_text(json.dumps(realm), encoding="utf-8")
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


# --------------------------------------------------------------- MFA forcing

def test_production_render_forces_totp(tmp_path: Path) -> None:
    """The dev realm enables CONFIGURE_TOTP without forcing it — forcing there
    would send all thirteen dev identities to an OTP enrolment screen on first
    login. Production is where it becomes mandatory."""
    destination = tmp_path / "out.json"
    renderer.render(_source(tmp_path), destination, "https://healthdoc.example.org")

    rendered = json.loads(destination.read_text(encoding="utf-8"))
    totp = [a for a in rendered["requiredActions"] if a["alias"] == "CONFIGURE_TOTP"]
    assert totp and totp[0]["defaultAction"] is True, "production realm does not force MFA"
    assert totp[0]["enabled"] is True


def test_production_render_requires_ssl_everywhere(tmp_path: Path) -> None:
    """`external` lets a request that reached the container over plain HTTP
    through. Production terminates TLS at nginx with Keycloak behind it."""
    destination = tmp_path / "out.json"
    renderer.render(_source(tmp_path), destination, "https://healthdoc.example.org")
    assert json.loads(destination.read_text(encoding="utf-8"))["sslRequired"] == "all"


def test_the_dev_realm_is_not_mutated(tmp_path: Path) -> None:
    """Rendering reads the source; it must never write back to it."""
    source = _source(tmp_path)
    before = source.read_text(encoding="utf-8")
    renderer.render(source, tmp_path / "out.json", "https://healthdoc.example.org")
    assert source.read_text(encoding="utf-8") == before


# ------------------------------------------------- the guard must FAIL CLOSED
#
# Each of these removes one control and asserts the render is refused. A
# rendered production realm that quietly lost its MFA is worse than no rendered
# realm, because it looks like a deliverable.

@pytest.mark.parametrize(
    "missing, expected",
    [
        ("requiredActions", "CONFIGURE_TOTP"),
        ("bruteForceProtected", "bruteForceProtected"),
        ("passwordPolicy", "passwordPolicy"),
        ("otpPolicyType", "otpPolicyType"),
    ],
)
def test_render_refuses_a_realm_missing_a_security_control(
    tmp_path: Path, missing: str, expected: str
) -> None:
    source = _source(tmp_path, **{missing: None})
    with pytest.raises(ValueError, match=expected):
        renderer.render(source, tmp_path / "out.json", "https://healthdoc.example.org")


# ------------------------------------------------------------- drift catcher

def test_the_shipped_dev_realm_can_actually_be_rendered(tmp_path: Path) -> None:
    """The fixture above is a description of the real realm, and descriptions
    drift. This renders the file that actually ships, so deleting the OTP
    policy or the password policy from it fails here rather than at deploy."""
    destination = tmp_path / "out.json"
    renderer.render(REAL_REALM, destination, "https://healthdoc.example.org")

    rendered = json.loads(destination.read_text(encoding="utf-8"))
    totp = [a for a in rendered["requiredActions"] if a["alias"] == "CONFIGURE_TOTP"]
    assert totp and totp[0]["defaultAction"] is True
    assert rendered["sslRequired"] == "all"

    frontend = [c for c in rendered["clients"] if c["clientId"] == "healthdoc-frontend"][0]
    mappers = {m["name"] for m in frontend.get("protocolMappers", [])}
    assert "healthdoc-backend-audience" in mappers, (
        "the audience mapper is gone — JWT_AUDIENCE would lock every user out"
    )
