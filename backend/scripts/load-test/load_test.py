#!/usr/bin/env python3
"""
Load test — issue #244 (BB-W7-02): 50 concurrent users against core journeys.

I don't have access to your actual API routes/auth flow from the schema
doc alone, so this is a config-driven runner, not a guess at your
endpoints. Fill in scenarios.json with your real routes (registration,
order placement, pharmacy dispense, billing, etc. — the 5 core journeys
from #243) before this produces a meaningful result.

Usage:
    pip install aiohttp
    python3 scripts/load-test/load_test.py --config scripts/load-test/scenarios.json \
        --users 50 --duration 120

Each "user" is an asyncio task that logs in once (if auth configured),
then loops through the weighted scenario list with think-time between
requests until --duration elapses. Reports p50/p95/p99 latency and
error rate per scenario, and an overall pass/fail against thresholds.
"""
import argparse
import asyncio
import json
import random
import statistics
import sys
import time
from dataclasses import dataclass, field

import aiohttp


@dataclass
class ScenarioResult:
    name: str
    latencies_ms: list = field(default_factory=list)
    errors: int = 0
    requests: int = 0


async def login(session: aiohttp.ClientSession, auth_cfg: dict, base_url: str) -> dict:
    """Returns headers to attach to subsequent requests. No-op if auth_cfg absent."""
    if not auth_cfg:
        return {}
    url = base_url + auth_cfg["token_path"]
    async with session.post(url, data=auth_cfg["form"]) as resp:
        if resp.status != 200:
            raise RuntimeError(f"login failed: HTTP {resp.status}")
        body = await resp.json()
        token = body[auth_cfg.get("token_field", "access_token")]
        return {"Authorization": f"Bearer {token}"}


async def run_user(user_id: int, base_url: str, scenarios: list, auth_cfg: dict,
                    duration_s: int, think_time_s: float, results: dict, stop_event: asyncio.Event):
    async with aiohttp.ClientSession() as session:
        try:
            headers = await login(session, auth_cfg, base_url)
        except Exception as e:
            print(f"[user {user_id}] login error: {e}", file=sys.stderr)
            return

        weights = [s["weight"] for s in scenarios]
        end_time = time.monotonic() + duration_s
        while time.monotonic() < end_time and not stop_event.is_set():
            scenario = random.choices(scenarios, weights=weights, k=1)[0]
            method = scenario.get("method", "GET").upper()
            url = base_url + scenario["path"]
            payload = scenario.get("body")

            t0 = time.monotonic()
            try:
                async with session.request(method, url, json=payload, headers=headers,
                                            timeout=aiohttp.ClientTimeout(total=15)) as resp:
                    await resp.read()
                    elapsed_ms = (time.monotonic() - t0) * 1000
                    r = results[scenario["name"]]
                    r.requests += 1
                    r.latencies_ms.append(elapsed_ms)
                    if resp.status >= 400:
                        r.errors += 1
            except Exception:
                elapsed_ms = (time.monotonic() - t0) * 1000
                r = results[scenario["name"]]
                r.requests += 1
                r.errors += 1
                r.latencies_ms.append(elapsed_ms)

            await asyncio.sleep(random.uniform(0, think_time_s * 2))


def percentile(data: list, pct: float) -> float:
    if not data:
        return 0.0
    s = sorted(data)
    k = int(len(s) * pct)
    return s[min(k, len(s) - 1)]


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True, help="path to scenarios.json")
    ap.add_argument("--users", type=int, default=50)
    ap.add_argument("--duration", type=int, default=120, help="seconds")
    ap.add_argument("--think-time", type=float, default=1.0, help="avg seconds between requests per user")
    ap.add_argument("--error-threshold", type=float, default=0.01, help="max acceptable error rate, e.g. 0.01 = 1%%")
    ap.add_argument("--p95-threshold-ms", type=float, default=2000.0)
    args = ap.parse_args()

    with open(args.config) as f:
        cfg = json.load(f)

    base_url = cfg["base_url"]
    scenarios = cfg["scenarios"]
    auth_cfg = cfg.get("auth")

    results = {s["name"]: ScenarioResult(name=s["name"]) for s in scenarios}
    stop_event = asyncio.Event()

    print(f"Starting load test: {args.users} concurrent users, {args.duration}s, target {base_url}")
    start = time.monotonic()
    tasks = [
        asyncio.create_task(run_user(i, base_url, scenarios, auth_cfg, args.duration,
                                      args.think_time, results, stop_event))
        for i in range(args.users)
    ]
    await asyncio.gather(*tasks)
    wall_s = time.monotonic() - start

    print(f"\n=== Results (wall time {wall_s:.1f}s) ===")
    overall_pass = True
    total_requests = 0
    total_errors = 0
    for name, r in results.items():
        total_requests += r.requests
        total_errors += r.errors
        if r.requests == 0:
            print(f"  {name}: NO REQUESTS RECORDED")
            continue
        err_rate = r.errors / r.requests
        p50 = percentile(r.latencies_ms, 0.50)
        p95 = percentile(r.latencies_ms, 0.95)
        p99 = percentile(r.latencies_ms, 0.99)
        status = "OK"
        if err_rate > args.error_threshold or p95 > args.p95_threshold_ms:
            status = "FAIL"
            overall_pass = False
        print(f"  {name}: {r.requests} reqs, {err_rate*100:.2f}% errors, "
              f"p50={p50:.0f}ms p95={p95:.0f}ms p99={p99:.0f}ms  [{status}]")

    print(f"\nTotal: {total_requests} requests, {total_errors} errors "
          f"({(total_errors/total_requests*100) if total_requests else 0:.2f}%)")
    print(f"Throughput: {total_requests/wall_s:.1f} req/s")

    if overall_pass:
        print("\nPASS — all scenarios within thresholds.")
        sys.exit(0)
    else:
        print("\nFAIL — one or more scenarios exceeded error-rate or p95 latency threshold.", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())