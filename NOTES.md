\# #244 (BB-W7-02) — final status



\## Done and verified

\- Backup script (`scripts/backup/backup\_postgres.sh`) — creates integrity-checked pg\_dump backups.

\- Restore script (`scripts/backup/restore\_postgres.sh`) — restores into a throwaway DB. Verified manually with a canary row (insert → backup → restore → row confirmed intact) and via automated pytest (2/2 passed).

\- NTP check (`scripts/verify/ntp\_tls\_verify.sh`) — genuinely verified: caught real clock desync during testing, correctly failed, then passed once resynced.

\- Load test (`scripts/load-test/load\_test.py`) — real 50-concurrent-user run completed: 3017 requests, 0 errors, p95 latency 16ms across all scenarios. Fixed a bug where a scenario with zero completed requests would silently report overall PASS.



\## Known limitations (deferred, not hidden)

\- \*\*Load test scope\*\*: only covers unauthenticated `/ping` and `/health` endpoints, not the 5 real clinical journeys. Keycloak's `healthdoc-frontend` client has `directAccessGrantsEnabled: false` and `healthdoc-backend` is `bearerOnly`, so the load test script cannot authenticate without a realm config change, which was out of scope for this branch. Follow-up: either temporarily enable direct access grants for a dedicated load-test user, or script a full PKCE flow.

\- \*\*TLS check\*\*: script logic verified correct via manual `openssl s\_client` testing (correctly detects both a live cert and connection-refused). Never got a live PASS locally because `nginx` depends on `frontend`, which crash-loops on a pre-existing, unrelated bug (`next.config.ts` not supported by the installed Next.js version). Needs that bug fixed separately, or a real staging TLS endpoint.

\- \*\*Backup mechanism\*\*: uses `pg\_dump`/`pg\_restore` (logical backup). Schema §4A.9 specifies PITR via WAL archiving (15-min RPO) as the actual target, plus a backup set covering Postgres + Mongo + MinIO + Keycloak realm/users + `.env`/secrets — this only covers Postgres via logical dump. Worth a follow-up ticket.

\- Also found and fixed along the way (not part of #244's own code, but blocking it): backend container was crash-looping on a missing `email-validator` dependency in a stale Docker image — fixed by rebuilding.



\## How to run

```

pytest tests/test\_backup\_restore.py -v

bash scripts/verify/ntp\_tls\_verify.sh

python scripts/load-test/load\_test.py --config scripts/load-test/scenarios.json --users 50 --duration 60

```

