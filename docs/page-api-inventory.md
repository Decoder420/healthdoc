# Frontend page inventory — meeting prep (`kunalsharm`)

Cross-reference of dashboard modules vs backend routers registered in `backend/app/main.py`.
Use this to pick what to port onto #263 after rebase.

## Bring across first (HAS API)

| Frontend module | Routes (brief) | Backend |
|---|---|---|
| patients | `/patients` | `patients` |
| receptionist | registration, queue, patient-search | `registration`, `queue`, `patients` |
| opd | `/opd` | `opd`, `encounters`, `queue` |
| doctor | `/doctor/*` workspace | `orders`, `opd`, `patients`, `pharmacy` |
| doctors | `/doctors` staff directory (not a duplicate of workspace) | `users` |
| ipd | `/ipd` | `ipd`, `wards` |
| nurse | ward-dashboard, eMAR | `nursing`, `wards` |
| pharmacy | dispense, prescription-queue | `pharmacy` |
| lab | `/lab` (canonical); `/laboratory` redirects here | `pathology` |
| radiology | `/radiology` | `radiology` |
| operation-theatre | `/operation-theatre` | `ot` |
| blood-bank | `/blood-bank` | `blood_bank` |
| emergency | `/emergency` | `emergency` |
| billing | `/billing` | `billing` |
| inventory | `/inventory` | `inventory` |
| consent | `/consent` | `consent` |
| admin | users, departments, abdm-sync | `users`, `departments`, ABDM |
| reports | `/reports` | `reports` |
| audit-viewer | `/audit-viewer` | `audit`, `security_audit` |
| queue-display | `/queue-display` | `queue` |
| profile / settings | `/profile`, `/settings` | `users` |

## Park (NO API)

Do not expand these on this branch. Port only after a backend module exists.

| Frontend module | Route |
|---|---|
| ambulance | `/ambulance` |
| appointments | `/appointments` |
| assets | `/assets` |
| attendance | `/attendance` |
| insurance | `/insurance` |
| leave | `/leave` |
| payroll | `/payroll` |

## Route aliases (resolved)

| Alias | Canonical | Note |
|---|---|---|
| `/nurses` | `/nurse/ward-dashboard` | Redirect only — stub removed |
| `/laboratory` | `/lab` | Redirect only |
| `/doctor/*` vs `/doctors` | **Both kept** | Role workspace vs staff directory — different UIs |

## Partial / TBD

| Module | Note |
|---|---|
| patient-portal | Thin / no dedicated backend module |
| auth login UI | Must use Keycloak OIDC (staging / #263 contract), not cookie identity |
