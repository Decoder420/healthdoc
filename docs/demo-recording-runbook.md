# Staff demo recordings

This runbook produces synthetic, repeatable WebM demonstrations for the
receptionist, doctor, and nurse journeys required by issue #251. The recorder
also fails unless each journey observes its expected bearer-authenticated API
response with HTTP 200.

## Prepare

Start the local stack, migrate it, create the development identities, and seed
the deterministic demo rows:

```bash
make up
make migrate
./scripts/dev_setup.sh
docker compose -f infra/docker-compose.yml --env-file .env exec -T backend \
  python -m scripts.seed_demo_251
```

The seed refuses to run outside `dev`, `demo`, `local`, or `test`. It creates
only the synthetic `Demo Patient 251` record and is safe to rerun.

## Record and verify

```bash
cd frontend
npm ci
npm run demo:record
```

The default output directory is `/tmp/healthdoc-demo-recordings` and contains:

- `receptionist.webm`: Keycloak login and a live patient search.
- `doctor.webm`: Keycloak login and the live `DEMO-001` queue worklist.
- `nurse.webm`: Keycloak login, the occupied `D-01` bed, and live vitals.
- `manifest.json`: file sizes and the bearer-authenticated API proven per role.

Set `E2E_ARTIFACT_DIR` to keep the files elsewhere, or `DEMO_ROLE` to record
only `receptionist`, `doctor`, or `nurse`. Recordings are build artifacts and
must not be committed because future runs may use locally prepared data.
