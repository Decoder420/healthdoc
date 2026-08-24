#!/usr/bin/env python3
"""Render the public production origin into the versioned Keycloak realm."""

import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit


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
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(realm, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--public-base-url", required=True)
    args = parser.parse_args()
    render(args.source, args.destination, args.public_base_url)
