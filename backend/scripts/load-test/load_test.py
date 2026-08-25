#!/usr/bin/env python3
"""Authenticated 50-user load gate for the five core clinical journeys.

Tokens are captured through the real Keycloak browser flow by
``capture_load_tokens.sh``. This runner deliberately does not enable the
resource-owner password grant or store credentials in its configuration.
"""

import argparse
import asyncio
import json
import random
import sys
import time
from dataclasses import dataclass, field
from pathlib import Path

import httpx


@dataclass
class ScenarioResult:
    name: str
    latencies_ms: list[float] = field(default_factory=list)
    errors: int = 0
    requests: int = 0
    statuses: dict[str, int] = field(default_factory=dict)


@dataclass
class TokenProvider:
    access_token: str
    refresh_token: str
    expires_at: float
    token_url: str
    client_id: str
    verify_tls: bool
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)

    async def headers(self) -> dict[str, str]:
        if time.time() >= self.expires_at - 10:
            async with self.lock:
                if time.time() >= self.expires_at - 10:
                    async with httpx.AsyncClient(verify=self.verify_tls) as client:
                        response = await client.post(
                            self.token_url,
                            data={
                                "grant_type": "refresh_token",
                                "client_id": self.client_id,
                                "refresh_token": self.refresh_token,
                            },
                            timeout=15.0,
                        )
                    response.raise_for_status()
                    body = response.json()
                    self.access_token = body["access_token"]
                    self.refresh_token = body.get("refresh_token", self.refresh_token)
                    self.expires_at = time.time() + body["expires_in"]
        return {"Authorization": f"Bearer {self.access_token}"}


@dataclass(frozen=True)
class Actor:
    name: str
    users: int
    tokens: TokenProvider
    scenarios: list[dict]


def load_token_bundle(token_dir: Path, filename: str) -> dict:
    """Read one browser-captured token bundle without allowing path traversal."""
    token_root = token_dir.resolve()
    path = (token_root / filename).resolve()
    if path.parent != token_root:
        raise ValueError(f"token file must be directly inside {token_root}")
    try:
        bundle = json.loads(path.read_text(encoding="utf-8"))
    except OSError as exc:
        raise ValueError(f"cannot read token file {path}: {exc}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"token file {path} is not valid JSON") from exc
    required = ("access_token", "refresh_token", "expires_in", "obtained_at")
    if not all(bundle.get(key) for key in required):
        raise ValueError(f"{path} is missing a required Keycloak token field")
    return bundle


def prepare_actors(config: dict, token_dir: Path, expected_users: int) -> list[Actor]:
    actor_configs = config.get("actors")
    if not isinstance(actor_configs, list) or not actor_configs:
        raise ValueError("config must define at least one authenticated actor")
    actors: list[Actor] = []
    names: set[str] = set()
    for item in actor_configs:
        name = item.get("name", "")
        users = item.get("users", 0)
        scenarios = item.get("scenarios")
        if not name or name in names:
            raise ValueError(f"actor names must be non-empty and unique: {name!r}")
        if not isinstance(users, int) or users < 1:
            raise ValueError(f"actor {name!r} must have at least one user")
        if not isinstance(scenarios, list) or not scenarios:
            raise ValueError(f"actor {name!r} must have at least one scenario")
        for scenario in scenarios:
            if not scenario.get("name") or not scenario.get("path"):
                raise ValueError(f"actor {name!r} has an invalid scenario")
            if scenario.get("weight", 1) <= 0:
                raise ValueError(f"actor {name!r} has a non-positive scenario weight")
        names.add(name)
        bundle = load_token_bundle(token_dir, item["token_file"])
        actors.append(
            Actor(
                name=name,
                users=users,
                tokens=TokenProvider(
                    access_token=bundle["access_token"],
                    refresh_token=bundle["refresh_token"],
                    expires_at=bundle["obtained_at"] + bundle["expires_in"],
                    token_url=config["base_url"] + config["token_path"],
                    client_id=config["client_id"],
                    verify_tls=config.get("verify_tls", True),
                ),
                scenarios=scenarios,
            )
        )
    configured_users = sum(actor.users for actor in actors)
    if configured_users != expected_users:
        raise ValueError(
            f"config assigns {configured_users} users but --users requires {expected_users}"
        )
    return actors


async def run_user(
    user_id: int,
    actor: Actor,
    base_url: str,
    verify_tls: bool,
    duration_s: int,
    think_time_s: float,
    results: dict[str, ScenarioResult],
) -> None:
    async with httpx.AsyncClient(
        base_url=base_url,
        timeout=httpx.Timeout(15.0),
        verify=verify_tls,
    ) as client:
        weights = [scenario.get("weight", 1) for scenario in actor.scenarios]
        end_time = time.monotonic() + duration_s
        while time.monotonic() < end_time:
            scenario = random.choices(actor.scenarios, weights=weights, k=1)[0]
            key = f"{actor.name}/{scenario['name']}"
            started = time.monotonic()
            try:
                response = await client.request(
                    scenario.get("method", "GET").upper(),
                    scenario["path"],
                    json=scenario.get("body"),
                    headers=await actor.tokens.headers(),
                )
                elapsed_ms = (time.monotonic() - started) * 1000
                result = results[key]
                result.requests += 1
                result.latencies_ms.append(elapsed_ms)
                status = str(response.status_code)
                result.statuses[status] = result.statuses.get(status, 0) + 1
                if response.status_code != scenario.get("expected_status", 200):
                    result.errors += 1
            except httpx.HTTPError as exc:
                elapsed_ms = (time.monotonic() - started) * 1000
                result = results[key]
                result.requests += 1
                result.errors += 1
                result.latencies_ms.append(elapsed_ms)
                result.statuses["transport"] = result.statuses.get("transport", 0) + 1
                print(f"[{actor.name} user {user_id}] request failed: {exc}", file=sys.stderr)
            await asyncio.sleep(random.uniform(0, think_time_s * 2))


def percentile(values: list[float], proportion: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    index = int(len(ordered) * proportion)
    return ordered[min(index, len(ordered) - 1)]


async def run(args: argparse.Namespace) -> int:
    config = json.loads(Path(args.config).read_text(encoding="utf-8"))
    actors = prepare_actors(config, Path(args.token_dir), args.users)
    results = {
        f"{actor.name}/{scenario['name']}": ScenarioResult(scenario["name"])
        for actor in actors
        for scenario in actor.scenarios
    }
    print(
        f"Starting authenticated load test: {args.users} users, {args.duration}s, "
        f"{len(actors)} role journeys, target {config['base_url']}"
    )
    started = time.monotonic()
    tasks = []
    user_id = 0
    for actor in actors:
        for _ in range(actor.users):
            tasks.append(
                asyncio.create_task(
                    run_user(
                        user_id,
                        actor,
                        config["base_url"],
                        config.get("verify_tls", True),
                        args.duration,
                        args.think_time,
                        results,
                    )
                )
            )
            user_id += 1
    await asyncio.gather(*tasks)
    wall_seconds = time.monotonic() - started

    passing = True
    total_requests = 0
    total_errors = 0
    print(f"\n=== Results (wall time {wall_seconds:.1f}s) ===")
    for key, result in results.items():
        total_requests += result.requests
        total_errors += result.errors
        error_rate = result.errors / result.requests if result.requests else 1.0
        p95 = percentile(result.latencies_ms, 0.95)
        status = "OK"
        if not result.requests or error_rate > args.error_threshold or p95 > args.p95_threshold_ms:
            status = "FAIL"
            passing = False
        print(
            f"  {key}: {result.requests} reqs, {error_rate * 100:.2f}% errors, "
            f"p50={percentile(result.latencies_ms, 0.50):.0f}ms "
            f"p95={p95:.0f}ms p99={percentile(result.latencies_ms, 0.99):.0f}ms "
            f"statuses={result.statuses} [{status}]"
        )
    print(
        f"\nTotal: {total_requests} requests, {total_errors} errors; "
        f"throughput {total_requests / wall_seconds:.1f} req/s"
    )
    print("\nPASS — all authenticated journeys are within thresholds." if passing else "\nFAIL")
    return 0 if passing else 1


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True)
    parser.add_argument("--token-dir", required=True)
    parser.add_argument("--users", type=int, default=50)
    parser.add_argument("--duration", type=int, default=120)
    parser.add_argument("--think-time", type=float, default=2.0)
    parser.add_argument("--error-threshold", type=float, default=0.01)
    parser.add_argument("--p95-threshold-ms", type=float, default=2000.0)
    args = parser.parse_args()
    try:
        raise SystemExit(asyncio.run(run(args)))
    except (KeyError, OSError, ValueError, json.JSONDecodeError) as exc:
        parser.error(str(exc))


if __name__ == "__main__":
    main()
