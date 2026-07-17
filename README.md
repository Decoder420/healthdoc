# HealthDoc HMIS

Hospital Information Management System for India's public health network.  
**ABDM V3-ready · DPDP-compliant · Offline-resilient hybrid edge-cloud.**

This monorepo contains the API, web/desktop UI, infrastructure, docs, and CI for HealthDoc.

---

## Tech stack

### Frontend (`frontend/`)

| Layer | Technology | Version / notes |
|---|---|---|
| Framework | **Next.js** (App Router) | `^16.2.10` |
| UI library | **React** + **React DOM** | `^19.0.0` |
| Language | **TypeScript** | `^5.7.0` |
| Component library | **MUI (Material UI)** | `@mui/material` `^6.5.0`, `@mui/icons-material`, `@mui/material-nextjs`, `@mui/x-date-pickers` |
| Styling (CSS-in-JS) | **Emotion** | `@emotion/react`, `@emotion/styled`, `@emotion/cache` |
| Utility CSS | **Tailwind CSS v4** | `tailwindcss` `^4.0.0` via `@tailwindcss/postcss` |
| Legacy / layout CSS | **Bootstrap** | `^5.3.8` (used by Navbar / lab layout classes) |
| Charts | **Chart.js** + **react-chartjs-2**, **Recharts** | KPI / dashboard charts |
| Dates | **Day.js** | With MUI date pickers |
| Auth (client) | **Keycloak JS** | `keycloak-js` `^25.0.0` |
| Barcodes | **react-barcode** | Specimen / report barcodes |
| PDF / headless | **Puppeteer** | Lab report PDF generation |
| Desktop shell | **Electron** | `electron/` + `npm run electron:dev` |
| Linting | **ESLint** + `eslint-config-next` | `eslint.config.mjs` |
| Path alias | `@/*` → `./src/*` | `tsconfig.json` |

**Frontend run targets**

- Web: `npm run dev` → `http://localhost:3000`
- Production: `npm run build` / `npm run start`
- Typecheck: `npm run typecheck`
- Electron: `npm run electron:dev`

### Backend (`backend/`)

| Layer | Technology | Version / notes |
|---|---|---|
| Runtime | **Python** | `3.12` |
| API framework | **FastAPI** | `0.115.*` |
| ASGI server | **Uvicorn** | `0.30.*` (with `--reload` in Docker) |
| Validation / settings | **Pydantic v2** + **pydantic-settings** | Config in `app/common/config.py` |
| ORM | **SQLAlchemy 2.0** (asyncio) | `asyncpg` driver |
| Migrations | **Alembic** | `backend/migrations/` |
| Document DB client | **Motor** (async MongoDB) | `motor` `3.5.*` |
| Cache / queues | **Redis** (Python client) | `redis` `5.*` |
| HTTP client | **httpx** | External integrations |
| Auth / JWT | **python-jose** + **cryptography** | Keycloak / OIDC |
| Object storage client | **MinIO SDK** | `minio` `7.2.*` |
| Testing | **pytest** + **pytest-asyncio** | `backend/tests/` |
| Linting | **Ruff** | `pyproject.toml` |

**API shape**

- Entry: `backend/app/main.py`
- Prefix: `/api/v1` (see `.env` / settings)
- Health: `/api/v1/health`, `/api/v1/health/deep`
- Modules auto-mounted from `app/<module>/router.py`
- Responses wrapped by `EnvelopeMiddleware`

### Data & infrastructure (`infra/`)

| Service | Image / tool | Role |
|---|---|---|
| **PostgreSQL** | `postgres:16-alpine` | Primary relational store |
| **MongoDB** | `mongo:7` | Document / flexible clinical payloads |
| **Redis** | `redis:7-alpine` | Cache / ephemeral state (AOF enabled) |
| **Keycloak** | `quay.io/keycloak/keycloak:25.0` | IdP / OIDC (realm import) |
| **MinIO** | `minio/minio` + `minio/mc` | S3-compatible files & reports |
| **Orthanc** | `orthancteam/orthanc` | PACS / DICOM |
| **Nginx** | `nginx:1.27-alpine` | Reverse proxy + TLS termination |
| Orchestration | **Docker Compose** | `infra/docker-compose.yml` |

### Integrations (planned / scaffolded)

Under `backend/app/integrations/`:

- **ABDM V3** — consent, FHIR, HIP, HIU, identity, NHCX
- **HFR** — Health Facility Registry
- **HPR** — Health Professional Registry
- **PACS** — Orthanc bridge

### DevOps & tooling

| Area | Tool |
|---|---|
| CI | GitHub Actions (`.github/workflows/ci.yml`) — Python 3.12 + Node 20 |
| Make targets | `Makefile` — `setup`, `up`, `down`, `migrate`, `test`, `lint`, … |
| Containers | Dockerfiles in `backend/` and `frontend/` |
| Branch model | `main` ← `staging` ← `feat/*` / `fix/*` |
| Ownership | `.github/CODEOWNERS` |
| Issue bootstrap | `scripts/setup_github.sh` + `.github/issues/*` |

---

## Repository layout (exact current structure)

Generated from the live workspace (generated / vendor dirs like `node_modules`, `.next`, `.git` omitted).

```text
healthdoc/
├── .env.example
├── .gitignore
├── Makefile
├── README.md
├── assignees.json
├── .github/
│   ├── CODEOWNERS
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug.md
│   │   └── task.md
│   ├── issues/
│   │   ├── assignees.json
│   │   ├── issues.json
│   │   └── milestones.json
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── Dockerfile
│   ├── alembic.ini
│   ├── pyproject.toml
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── .dockerignore
│   ├── app/
│   │   ├── main.py
│   │   ├── __init__.py
│   │   ├── audit/
│   │   ├── auth/
│   │   ├── billing/
│   │   ├── blood_bank/
│   │   ├── common/                 # config, db, mongo, redis, security, envelope
│   │   ├── consent/
│   │   ├── departments/
│   │   ├── emergency/
│   │   ├── encounters/
│   │   ├── files/
│   │   ├── integrations/
│   │   │   ├── abdm/               # consent, fhir, hip, hiu, identity, nhcx
│   │   │   ├── hfr/
│   │   │   ├── hpr/
│   │   │   └── pacs/
│   │   ├── inventory/
│   │   ├── ipd/
│   │   ├── notifications/
│   │   ├── nursing/
│   │   ├── opd/
│   │   ├── orders/
│   │   ├── ot/
│   │   ├── outbox/
│   │   ├── pathology/
│   │   ├── patients/
│   │   ├── pharmacy/
│   │   ├── queue/
│   │   ├── radiology/
│   │   ├── registration/
│   │   ├── reports/
│   │   ├── security_audit/
│   │   ├── users/
│   │   └── wards/
│   ├── migrations/
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   │       └── 0001_extensions.py
│   ├── scripts/
│   └── tests/
│       ├── conftest.py
│       ├── test_health.py
│       └── test_security.py
├── docs/
│   ├── README.md
│   ├── dev-setup.md
│   ├── adr/
│   └── api-contracts/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── yarn.lock
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Readme.md
│   ├── certificates/
│   ├── electron/
│   │   ├── main.ts
│   │   └── tsconfig.json
│   ├── lib/                        # top-level helpers (api.ts, auth.ts)
│   ├── public/
│   └── src/
│       ├── app/                    # Next.js App Router (role-based routes)
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── login/
│       │   ├── admin/
│       │   │   ├── abdm-sync/
│       │   │   ├── departments/
│       │   │   └── users/
│       │   ├── audit-viewer/
│       │   ├── billing/
│       │   ├── consent/
│       │   ├── doctor/
│       │   │   ├── consultation/
│       │   │   ├── dashboard/
│       │   │   ├── orders/
│       │   │   └── prescriptions/
│       │   ├── emergency/
│       │   ├── inventory/
│       │   ├── ipd/
│       │   ├── lab/
│       │   │   ├── page.tsx
│       │   │   ├── dashboard/
│       │   │   ├── test_queue/
│       │   │   ├── patient/[patientId]/
│       │   │   ├── reports/[reportId]/
│       │   │   ├── api/reports/[reportId]/pdf/
│       │   │   └── pathology/
│       │   │       ├── barcode/
│       │   │       ├── lab_results/
│       │   │       ├── sample/
│       │   │       ├── settings/
│       │   │       ├── test_queue/
│       │   │       └── verification/
│       │   ├── nurse/
│       │   │   ├── emar/
│       │   │   └── ward-dashboard/
│       │   ├── patient-portal/
│       │   ├── pharmacy/
│       │   │   ├── dispense/
│       │   │   └── prescription-queue/
│       │   ├── queue-display/
│       │   ├── radiology/
│       │   ├── receptionist/
│       │   │   ├── patient-search/
│       │   │   ├── queue/
│       │   │   └── registration/
│       │   └── reports/
│       ├── components/
│       │   ├── providers.tsx       # MUI ThemeProvider + CssBaseline
│       │   ├── dashboards/         # Lab dashboard composition
│       │   ├── fhir/
│       │   ├── forms/
│       │   ├── opd/
│       │   ├── shared/
│       │   │   ├── Navbar.tsx
│       │   │   ├── BarcodeDisplay.tsx
│       │   │   ├── StatusStepper/
│       │   │   └── labreportviewer/
│       │   ├── tables/
│       │   └── ui/                 # charts, KPIs, lab queue widgets
│       ├── features/               # feature modules (scaffolded per role)
│       │   ├── admin/
│       │   ├── audit-viewer/
│       │   ├── billing/
│       │   ├── consent/
│       │   ├── doctor/
│       │   ├── emergency/
│       │   ├── inventory/
│       │   ├── ipd/
│       │   ├── lab/
│       │   ├── login/
│       │   ├── nurse/
│       │   ├── patient-portal/
│       │   ├── pharmacy/
│       │   ├── queue-display/
│       │   ├── radiology/
│       │   ├── receptionist/
│       │   └── reports/
│       ├── lib/
│       │   ├── index.ts
│       │   ├── lab_pdf.ts
│       │   └── mock/               # lab mock data / notifications
│       └── styles/
│           ├── fonts.ts            # next/font (IBM Plex Sans / Mono)
│           ├── globals.css         # Tailwind v4 + design tokens
│           └── theme/              # MUI + Meridian theme
├── infra/
│   ├── docker-compose.yml
│   ├── keycloak/
│   │   └── realm-healthdoc.json
│   ├── minio/
│   │   └── init-buckets.sh
│   ├── nginx/
│   │   ├── nginx.conf
│   │   ├── generate-dev-certs.sh
│   │   ├── certs/
│   │   └── conf.d/
│   │       └── healthdoc.conf
│   └── orthanc/
│       └── orthanc.json
└── scripts/
    ├── dev_setup.sh
    └── setup_github.sh
```

---

## Architecture conventions

### Backend module pattern

Each clinical / platform domain lives under `backend/app/<module>/`:

| File | Purpose |
|---|---|
| `router.py` | FastAPI routes (auto-included in `main.py`) |
| `models.py` | SQLAlchemy models (add when implementing) |
| `schemas.py` | Pydantic request/response schemas |
| `service.py` | Business logic |

Shared infrastructure: `backend/app/common/` (`config`, `db`, `mongo`, `redis`, `security`, `envelope`).  
Auth helpers: `backend/app/auth/deps.py`.

### Frontend structure pattern

| Path | Purpose |
|---|---|
| `src/app/<role>/...` | Next.js routes by hospital role / workflow |
| `src/components/` | Shared UI building blocks |
| `src/features/<domain>/` | Domain feature code (scaffolded) |
| `src/lib/` | App utilities + mock data |
| `src/styles/` | Global CSS, fonts, MUI theme |
| `frontend/lib/` | API client + auth helpers (envelope-aware) |
| `electron/` | Desktop main process |

### Compose stack ports (defaults)

| Service | Host port |
|---|---|
| App via Nginx | `80` / `443` |
| Frontend (direct) | `3000` |
| Backend API | `8000` |
| Keycloak | `8081` |
| Postgres | `5432` |
| MongoDB | `27017` |
| Redis | `6379` |
| MinIO API / Console | `9000` / `9001` |
| Orthanc HTTP / DICOM | `8042` / `4242` |

---

## Local development

Prerequisites: Docker Desktop (or Docker + Compose v2), `openssl`, `make`, Git.  
Node 20 and Python 3.12 are only required if you run services outside Docker.

```bash
# First time
make setup          # .env + dev certs + build + start + migrate

# Day to day
make up             # start stack
make down           # stop (volumes kept)
make logs           # tail logs
make migrate        # alembic upgrade head
make revision m="add foo table"
make test           # backend pytest
make lint           # ruff + next lint
```

Full guide: [docs/dev-setup.md](docs/dev-setup.md)

| Service | URL |
|---|---|
| App (nginx) | https://localhost |
| API docs | https://localhost/api/v1/docs |
| API health | https://localhost/api/v1/health |
| Keycloak admin | http://localhost:8081/auth |
| MinIO console | http://localhost:9001 |
| Orthanc (PACS) | http://localhost:8042 |

Dev users (realm `healthdoc`, password `devpass`): `dev.receptionist`, `dev.doctor`, `dev.admin`.

### Frontend-only (without full Compose)

```bash
cd frontend
npm install
npm run dev
```

---

## Branching

- `main` — production-ready only; PRs from `staging` with Tech Lead approval
- `staging` — integration branch
- `feat/<dev>-<module>-<desc>` — feature work (e.g. `feat/b2-patients-search`)
- `fix/<dev>-<issue#>` — bug fixes

Max **400 lines** per PR. No self-merges. Migration PRs reviewed by Tech Lead.

---

## One-time GitHub setup (Tech Lead)

1. Push the repo and create `main` + `staging`.
2. Edit `.github/issues/assignees.json` and `.github/CODEOWNERS` with real usernames.
3. Enable branch protection on `main` and `staging` (require PR + CODEOWNERS + CI).
4. Bootstrap labels / milestones / issues:

```bash
gh auth login
./scripts/setup_github.sh YOUR_ORG/healthdoc
```

Module ownership is enforced via `.github/CODEOWNERS`.  
See `docs/` for ADRs, API contracts, and the team task plan.
