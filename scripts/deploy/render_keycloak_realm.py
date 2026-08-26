#!/usr/bin/env python3
"""Render the production Keycloak realm from the versioned dev realm.

Two jobs: substitute the public origin, and apply the hardening that CANNOT be
switched on in the dev realm without breaking development.

WHY MFA IS FORCED HERE AND NOT IN THE SOURCE REALM

WASA requires MFA for clinical and admin users. The obvious change — set
CONFIGURE_TOTP as a default required action in infra/keycloak/realm-healthdoc.json
— sends all thirteen dev identities and the Puppeteer smoke suite to an OTP
enrolment screen on first login, so the dev stack stops working the moment
anyone re-imports the realm.

The dev realm therefore DEFINES the OTP policy and enables the action without
forcing it; this renderer forces it. That keeps one source of truth for realm
shape while letting the two environments differ where they must — and, unlike a
runbook step, it cannot be forgotten, because production realms are only ever
produced by this script.
"""

import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit

#: Forced on every production user. Keycloak has no per-role required action,
#: so this applies realm-wide rather than to clinical roles alone — which is
#: stricter than WASA asks and simpler to evidence to an auditor.
_FORCED_REQUIRED_ACTIONS = ("CONFIGURE_TOTP",)


def _harden(realm: dict) -> None:
    """Production-only settings. Every one of these breaks or annoys dev."""
    # MFA. The realm already defines the TOTP policy; this makes it mandatory.
    forced = set(_FORCED_REQUIRED_ACTIONS)
    seen = set()
    for action in realm.setdefault("requiredActions", []):
        alias = action.get("alias")
        if alias in forced:
            action["enabled"] = True
            action["defaultAction"] = True
            seen.add(alias)
    missing = forced - seen
    if missing:
        # Fail rather than silently ship a realm without MFA. A rendered realm
        # that quietly lacks the control is worse than no rendered realm.
        raise ValueError(
            f"source realm has no required action(s) {sorted(missing)} to force; "
            "add them to infra/keycloak/realm-healthdoc.json"
        )

    # Refuse to emit a production realm that lost its brute-force settings.
    if not realm.get("bruteForceProtected"):
        raise ValueError("source realm must set bruteForceProtected")
    if not realm.get("passwordPolicy"):
        raise ValueError("source realm must set a passwordPolicy")
    if not realm.get("otpPolicyType"):
        raise ValueError("source realm must define an otpPolicyType for MFA")

    # HTTPS everywhere, not just for external addresses. Production terminates
    # TLS at nginx and Keycloak sits behind it, so "external" would let a
    # request that reached the container over plain HTTP through.
    realm["sslRequired"] = "all"


def render(source: Path, destination: Path, public_base_url: str) -> None:
    base = public_base_url.rstrip("/")
    parsed = urlsplit(base)
    if parsed.scheme != "https" or not parsed.netloc or parsed.path or parsed.query:
        raise ValueError("PUBLIC_BASE_URL must be an HTTPS origin without a path or query")
    realm = json.loads(source.read_text(encoding="utf-8"))
    clients = [item for item in realm["clients"] if item.get("clientId") == "healthdoc-frontend"]
    if len(clients) != 1:
        raise ValueError("realm must contain exactly one healthdoc-frontend client")
    clients[0]["redirectUris"] = [f"{base}/*"]
    clients[0]["webOrigins"] = [base]
    _harden(realm)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(realm, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--public-base-url", required=True)
    args = parser.parse_args()
    render(args.source, args.destination, args.public_base_url)
