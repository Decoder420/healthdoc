# healthdoc — Hospital Information Management System (Frontend)

Next.js App Router frontend for **healthdoc**, a Hospital Information Management System (HMIS) for reception, OPD, IPD, clinical workflows, and operational reporting.

Path alias: `@/*` → `src/*` (see `tsconfig.json`).

---

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| UI components | MUI v6 + Emotion |
| Utility CSS | Tailwind CSS v4 |
| Charts | Recharts |
| Webcam | react-webcam |
| Export | xlsx (Excel), CSV helpers |
| Auth (current) | Cookie-based dev login (`auth-token`, `auth-role`, `auth-user`) |
| Auth (planned) | Keycloak JS |
| Desktop (optional) | Electron stub under `electron/` |
| Data (current) | In-memory mocks + `sessionStorage` (no live backend wired) |

---

## Quick start

```bash
npm install
npm run dev          # Starts Next.js with LAN banner (see below)
npm run build        # Production build
npm run start        # Serve production build on 0.0.0.0:3000
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run electron:dev # Electron shell (requires `electron` installed separately)
```

### Dev server URLs

`npm run dev` runs `scripts/print-lan-ip.mjs`, which:

- Binds Next.js to **`0.0.0.0:3000`** (localhost + LAN)
- Prints **localhost** and **Wi‑Fi IP** URLs
- Enables **HTTPS by default** (`--experimental-https`) so the **camera works on LAN devices**

| URL | Use |
| --- | --- |
| `https://localhost:3000` | This PC — camera works |
| `https://<your-wifi-ip>:3000` | Phones/tablets on same Wi‑Fi — accept cert warning once |

Disable HTTPS: `HEALTHDOC_HTTPS=0 npm run dev` (camera over LAN IP will not work).

Windows LAN firewall helper: `scripts/fix-lan.ps1` (run as Administrator).

---

## Architecture principles

Code is organized by **product role / domain**, not only by technical layer.

| Rule | Guideline |
| --- | --- |
| Routes stay thin | `src/app/**/page.tsx` imports a feature screen and renders it |
| Features own screens | Business UI lives in `src/features/<module>/` |
| Shared UI is reusable | Anything used by 2+ modules goes in `src/components/` |
| Design tokens | Use Meridian theme / CSS variables — avoid one-off colors |

```
Browser request
    → src/app/          (route → thin page)
    → src/features/     (domain screen + local logic)
    → src/components/   (shared widgets)
    → src/features/*/api (mock data / future API)
```

---

## Complete folder structure

```
hmsfrontend/
├── AGENTS.md                    # Agent rules (points to Next.js docs in node_modules)
├── README.md                    # This file
├── package.json
├── tsconfig.json
├── next.config.ts               # LAN dev origins, CORS headers
├── postcss.config.mjs           # Tailwind v4 PostCSS plugin
├── eslint.config.mjs
│
├── certificates/                # Auto-generated dev HTTPS certs (when mkcert succeeds)
│
├── electron/                    # Optional desktop shell
│   ├── main.ts                  # Opens HEALTHDOC_URL or http://localhost:3000
│   └── tsconfig.json
│
├── scripts/
│   ├── print-lan-ip.mjs         # Default `npm run dev` launcher
│   └── fix-lan.ps1              # Windows: Private Wi‑Fi + firewall port 3000
│
├── public/                      # Static assets (SVG icons, etc.)
│
└── src/
    ├── proxy.ts                 # Auth guard + CORS (Next.js proxy / middleware)
    │
    ├── app/                     # Next.js App Router — URLs only
    │   ├── layout.tsx           # Root layout: fonts, Providers, global CSS
    │   ├── page.tsx             # Redirect → /login
    │   ├── globals.css          # Re-exports @/styles/globals.css
    │   ├── api/health/route.ts  # GET { status: "ok" }
    │   │
    │   ├── (auth)/              # Unauthenticated layout (centered card)
    │   │   ├── layout.tsx
    │   │   ├── login/           # Dev role picker login
    │   │   ├── register/        # Placeholder
    │   │   ├── forgot-password/
    │   │   ├── reset-password/
    │   │   └── verify-otp/
    │   │
    │   ├── (dashboard)/         # Authenticated staff shell (sidebar + navbar)
    │   │   ├── layout.tsx
    │   │   ├── dashboard/       # Role-based home dashboard
    │   │   │
    │   │   ├── receptionist/    # Registration, queue, patient search
    │   │   ├── doctor/          # Dashboard, consultation, orders, prescriptions
    │   │   ├── nurse/           # Ward dashboard, eMAR
    │   │   ├── pharmacy/        # Prescription queue, dispense
    │   │   ├── admin/           # Users, departments, ABDM sync
    │   │   │
    │   │   ├── ipd/             # Inpatient operations
    │   │   ├── lab/             # Laboratory (stub)
    │   │   ├── radiology/       # Radiology (stub)
    │   │   ├── emergency/       # Emergency (stub)
    │   │   ├── inventory/       # Inventory (stub)
    │   │   ├── billing/         # Shared UI component gallery
    │   │   ├── reports/         # Analytics + export
    │   │   ├── consent/         # Consent (stub)
    │   │   ├── audit-viewer/    # Audit trail (stub)
    │   │   │
    │   │   ├── doctors/         # Doctor registry (admin + receptionist)
    │   │   ├── appointments/    # Appointment booking & management
    │   │   ├── profile/         # Staff profile
    │   │   │
    │   │   ├── opd/             # Redirect → /receptionist/registration
    │   │   ├── patients/        # Redirect → /receptionist/patient-search
    │   │   ├── laboratory/      # Redirect → /lab
    │   │   │
    │   │   └── [legacy HR/ops placeholders]
    │   │       settings/, assets/, attendance/, leave/, payroll/,
    │   │       insurance/, operation-theatre/, ambulance/, blood-bank/, nurses/
    │   │
    │   ├── queue-display/       # Public OPD queue TV (no auth)
    │   └── patient-portal/      # Patient portal (stub, no auth)
    │
    ├── features/                # Domain modules (screens + data layer)
    │   ├── _shared/             # FeatureStub placeholder component
    │   ├── login/               # LoginScreen
    │   ├── receptionist/        # Registration, queue, patient search screens
    │   ├── doctor/              # Doctor role screens
    │   ├── nurse/               # Nurse ward + eMAR screens
    │   ├── pharmacy/            # Pharmacy screens (stubs)
    │   ├── admin/               # Admin screens (stubs)
    │   ├── opd/                 # OPD engine: service, queue context, types
    │   ├── patients/            # Patient types, validation, API re-exports
    │   ├── doctors/             # Doctor mock API + types
    │   ├── appointments/        # Appointment mock API + types
    │   ├── ipd/                 # IPD mock API + IpdScreen
    │   ├── reports/             # Reports analytics API + ReportsScreen
    │   ├── profile/             # Staff profile API
    │   ├── dashboard/           # Dashboard widget mock data
    │   ├── billing/             # SharedUiPreview gallery
    │   ├── queue-display/       # Public queue screen
    │   └── [scaffold modules]   # api/hooks/schemas stubs for future work:
    │       auth, lab, radiology, emergency, inventory, consent,
    │       audit-viewer, patient-portal, ambulance, assets, attendance,
    │       blood-bank, insurance, laboratory, leave, nurses, payroll,
    │       operation-theatre, settings, pharmacy (api layer)
    │
    ├── components/              # Shared, reusable UI
    │   ├── ui/                  # Primitives: Button, MUI fields, MetricCard,
    │   │                        # ChartWrapper, ExportButton, Badge, StatusChip,
    │   │                        # Modal, toast, Toaster
    │   ├── tables/              # DataTable, EMARTable
    │   ├── BedGrid/             # Ward bed occupancy cards
    │   ├── VitalsTimeline/      # Clinical vitals table
    │   ├── providers.tsx        # MUI Emotion cache + CssBaseline + Toaster
    │   ├── layout/              # Sidebar, Navbar, ThemeToggle
    │   ├── shared/              # ModulePage generic placeholder
    │   ├── dashboard/           # Per-role dashboard widgets
    │   ├── receptionist/
    │   │   └── opd-workflow/    # Full OPD registration wizard + queue panel
    │   ├── patients/            # Patient directory module UI
    │   ├── doctors/             # Doctor directory module UI
    │   ├── appointments/        # Appointments module UI
    │   ├── ipd/                 # IPD module UI (tabs, inbox, beds, nurses)
    │   ├── reports/             # Reports module UI (filters, charts, export)
    │   ├── profile/             # Staff profile module UI
    │   ├── forms/               # Reserved (.gitkeep)
    │   ├── dashboards/          # Reserved (.gitkeep)
    │   └── fhir/                # Reserved (.gitkeep)
    │
    ├── config/
    │   ├── navigation.ts        # Sidebar items + role filtering
    │   ├── roles.ts             # Role constants (7 roles)
    │   └── constants.ts         # APP_NAME, API_BASE_URL
    │
    ├── lib/
    │   ├── api/client.ts        # Fetch wrapper (ready for backend; unused)
    │   ├── auth/                # Cookie session + default routes per role
    │   ├── mui/theme.ts         # Deprecated re-export → @/styles/theme
    │   └── utils/               # cn, file, camera (HTTPS/LAN helpers)
    │
    ├── providers/
    │   ├── index.tsx            # Theme + MUI + Auth + OPD queue providers
    │   ├── auth-provider.tsx    # Reads cookie session
    │   ├── theme-provider.tsx   # Light/dark via localStorage `hms-theme`
    │   ├── mui-provider.tsx     # Legacy (superseded by components/providers)
    │   └── query-provider.tsx   # React Query stub (passthrough)
    │
    ├── styles/
    │   ├── fonts.ts             # IBM Plex Sans + Mono (next/font)
    │   ├── globals.css          # Tailwind v4, CSS variables, component classes
    │   └── theme/
    │       ├── meridian.ts        # Color/token source of truth
    │       ├── mui-theme.ts       # createTheme wired to Meridian
    │       └── index.ts
    │
    ├── hooks/use-debounce.ts    # Stub (returns value immediately)
    ├── store/index.ts           # Placeholder for future global state
    ├── schemas/index.ts         # Placeholder for shared Zod schemas
    └── types/index.ts           # Shared API response types
```

---

## Roles & access

Defined in `src/config/roles.ts`:

| Role | Default landing route | Primary modules |
| --- | --- | --- |
| **Receptionist** | `/dashboard` | OPD registration, queue, patients, appointments, doctors (view), reports, IPD desk |
| **Doctor** | `/doctor/dashboard` | Dashboard, consultation queue, IPD requests, appointments, doctors list |
| **Nurse** | `/nurse/ward-dashboard` | Ward dashboard, eMAR, IPD assignments |
| **Admin** | `/admin/users` | All nav items; doctor CRUD; settings placeholders |
| **Pharmacist** | `/pharmacy/prescription-queue` | Pharmacy screens (stubs) |
| **Lab technician** | `/lab` | Lab / radiology screens (stubs) |
| **Accountant** | `/reports` | Reports & export |

Sidebar navigation is filtered per role in `src/config/navigation.ts` via `getNavigationForRole()`.

---

## Routes reference

### Authentication

| Route | Status | Description |
| --- | --- | --- |
| `/login` | **Functional** | Dev login — pick role, sets cookie session, honors `?redirect=` |
| `/register` | Placeholder | Static placeholder page |
| `/forgot-password` | Placeholder | Static placeholder page |
| `/reset-password` | Placeholder | Static placeholder page |
| `/verify-otp` | Placeholder | Static placeholder page |

### Reception & OPD

| Route | Status | Description |
| --- | --- | --- |
| `/dashboard` | **Functional** | Role-specific home (receptionist: stats, quick actions, live queue) |
| `/receptionist/registration` | **Functional** | 6-step OPD wizard + live doctor queue panel |
| `/receptionist/queue` | **Functional** | Live OPD waiting queue |
| `/receptionist/patient-search` | **Functional** | Patient search, view/edit, register, ABHA mock |
| `/opd` | Redirect | → `/receptionist/registration` |
| `/patients` | Redirect | → `/receptionist/patient-search` (keeps query params) |
| `/queue-display` | **Functional** | Public full-screen queue (no login) |

### Clinical — Doctor

| Route | Status | Description |
| --- | --- | --- |
| `/doctor/dashboard` | **Functional** | Doctor home dashboard |
| `/doctor/consultation` | Partial | Live queue panel + consultation stub |
| `/doctor/orders` | Stub | Lab/radiology orders placeholder |
| `/doctor/prescriptions` | Stub | E-prescribing placeholder |

### Clinical — Nurse

| Route | Status | Description |
| --- | --- | --- |
| `/nurse/ward-dashboard` | **Functional** | Nurse ward overview dashboard |
| `/nurse/emar` | Partial | eMAR table UI with sample medication rows |

### Inpatient (IPD)

| Route | Status | Description |
| --- | --- | --- |
| `/ipd` | **Functional** | Doctor requests → assign bed + nurse; resource board |

### Appointments & doctors

| Route | Status | Description |
| --- | --- | --- |
| `/appointments` | **Functional** | Book, filter, status workflow; `?action=book` opens booking |
| `/doctors` | **Functional** | Admin: add/edit doctors; Receptionist: view-only |

### Pharmacy, lab, radiology

| Route | Status | Description |
| --- | --- | --- |
| `/pharmacy/prescription-queue` | Stub | Incoming prescriptions placeholder |
| `/pharmacy/dispense` | Stub | Dispensing workflow placeholder |
| `/pharmacy` | Redirect | → `/pharmacy/prescription-queue` |
| `/lab` | Stub | Laboratory placeholder |
| `/laboratory` | Redirect | → `/lab` |
| `/radiology` | Stub | Imaging placeholder |

### Operations & admin

| Route | Status | Description |
| --- | --- | --- |
| `/reports` | **Functional** | KPIs, charts, period filters, CSV + Excel export |
| `/billing` | Gallery | Temporary showcase of shared UI components |
| `/inventory` | Stub | Stock management placeholder |
| `/emergency` | Stub | Emergency/triage placeholder |
| `/consent` | Stub | Consent management placeholder |
| `/audit-viewer` | Stub | Audit trail placeholder |
| `/admin/users` | Stub | User administration placeholder |
| `/admin/departments` | Stub | Departments placeholder |
| `/admin/abdm-sync` | Stub | ABDM integration placeholder |
| `/profile` | **Functional** | Staff profile: overview, edit, photo, password, preferences |
| `/patient-portal` | Stub | Public patient portal placeholder |

### Legacy placeholders (sidebar remnants)

| Route | Status |
| --- | --- |
| `/settings`, `/assets`, `/attendance`, `/leave`, `/payroll`, `/insurance`, `/operation-theatre`, `/ambulance`, `/blood-bank`, `/nurses` | Generic `ModulePage` placeholder |

---

## Features in detail

### 1. Dev authentication

- **Login** (`features/login/LoginScreen.tsx`): select role → writes cookies → redirects to role default route or `?redirect=` URL.
- **Session** (`lib/auth/index.ts`): `auth-token`, `auth-role`, `auth-user` cookies (24h).
- **Guard** (`src/proxy.ts`): redirects unauthenticated users to `/login`; public routes: auth pages, `/queue-display`, `/patient-portal`.

### 2. OPD registration workflow (core)

**Route:** `/receptionist/registration`  
**UI:** `components/receptionist/opd-workflow/`  
**Engine:** `features/opd/services/opd-service.ts`

Six-step wizard:

1. **Search** — UHID, Aadhaar, ABHA, or mobile
2. **Patient** — register new or confirm existing; webcam photo; ABHA creation mock
3. **Doctor** — department + doctor selection
4. **Token & fee** — OPD ID, token number, payment method (cash/card/UPI)
5. **Receipt** — printable fee receipt
6. **Queue** — add patient to live OPD queue

Data persists in `sessionStorage` (`hms-patient-registry`, etc.).

### 3. OPD queue (live, shared)

**Context:** `features/opd/context/opd-queue-context.tsx`

Shared in-memory queue used by:

- Registration screen (add after check-in)
- `/receptionist/queue`
- Receptionist dashboard (waiting count + list)
- `/doctor/consultation` (doctor queue panel)
- `/queue-display` (public TV view)

### 4. Patient management

**Route:** `/receptionist/patient-search`  
**UI:** `components/patients/`  
**API:** `features/patients/api` → wraps `opd-service`

- Search/filter by name, UHID, phone, Aadhaar, ABHA, gender
- View and edit patient profile
- Register new patient (`?action=register` from dashboard quick action)
- Patient stats cards
- ABHA panel (mock creation flow)

### 5. Appointments

**Route:** `/appointments`  
**UI:** `components/appointments/`  
**API:** `features/appointments/api`

- List with date, doctor, department, status filters
- Book appointment flow (`?action=book`)
- Status workflow: scheduled → checked-in → in-progress → completed / cancelled
- Today's appointments on receptionist dashboard

### 6. Doctors registry

**Route:** `/doctors`  
**UI:** `components/doctors/`  
**API:** `features/doctors/api`

- **Admin:** add, edit, filter by department/status
- **Receptionist:** view-only (no add/edit)
- Webcam photo on doctor profile form
- Used by OPD doctor selection step

### 7. IPD (inpatient)

**Route:** `/ipd`  
**UI:** `components/ipd/`  
**API:** `features/ipd/api`

Role-specific tabs:

| Role | Tabs |
| --- | --- |
| Receptionist / Admin | Doctor requests inbox, raise request, beds & nurses board |
| Doctor | Raise request, my requests |
| Nurse | My assignments, beds & nurses |

Workflow: doctor raises IPD request → desk assigns bed + nurse → nurse sees assignments.

### 8. Reports & analytics

**Route:** `/reports`  
**UI:** `components/reports/`  
**API:** `features/reports/api`

- Period filters: 7d / 30d / 90d / YTD
- Tabs: Overview, Patients, Appointments, Doctors, IPD, Revenue
- KPI cards, bar charts (Recharts), breakdown tables
- **Export:** CSV and Excel (`.xlsx` via dynamic `xlsx` import)
- Roles: Admin, Receptionist, Accountant

### 9. Staff profile

**Route:** `/profile`  
**UI:** `components/profile/`  
**API:** `features/profile/api`

Tabs: Overview, Edit details, Photo (webcam), Password, Preferences.

### 10. Role dashboards

**Route:** `/dashboard`  
**Map:** `components/dashboard/index.ts` → `dashboardByRole`

| Role | Dashboard highlights |
| --- | --- |
| Receptionist | Live stats, quick actions, today's appointments, recent registrations, **live OPD queue** |
| Doctor | Consultation overview widgets |
| Nurse | Ward summary widgets |
| Admin | Hospital ops overview |
| Pharmacist / Lab tech / Accountant | Role-specific summary cards |

### 11. Shared UI kit

**Route:** `/billing` (temporary gallery)  
**File:** `features/billing/SharedUiPreview.tsx`

Demonstrates: `MetricCard`, `ChartWrapper`, `ExportButton`, `DataTable`, `BedGrid`, `VitalsTimeline`, `EMARTable`, `Modal`, toasts, `StatusChip`.

### 12. eMAR (nurse)

**Route:** `/nurse/emar`  
Shows medication administration table with sample rows (medication, dose, route, schedule, status).

### 13. Camera / webcam

**Component:** `components/receptionist/opd-workflow/webcam-capture.tsx`  
**Utils:** `lib/utils/camera.ts`

Used in OPD registration, patient/doctor forms, profile photo.

**Important:** Browsers require **HTTPS** (or `localhost`) for camera access. Dev server enables HTTPS by default for LAN use.

---

## Design system (Meridian)

| Location | Purpose |
| --- | --- |
| `styles/theme/meridian.ts` | Navy HMIS palette (`#001f54` primary), semantic colors |
| `styles/theme/mui-theme.ts` | MUI `createTheme` (light + dark) |
| `styles/globals.css` | Tailwind v4, CSS variables, `.surface-card`, `.btn-*`, `.brand-gradient` |
| `styles/fonts.ts` | IBM Plex Sans + IBM Plex Mono |

Tailwind + MUI layer order in `globals.css`:

```css
@layer theme, base, mui, components, utilities;
```

Root `<html>` uses `data-scroll-behavior="smooth"` for Next.js route scroll compatibility.

---

## Data layer

| Module | Storage | Status |
| --- | --- | --- |
| OPD / Patients | `sessionStorage` + mocks | **Functional** |
| Appointments | In-memory mock | **Functional** |
| Doctors | In-memory mock | **Functional** |
| IPD | In-memory mock + bed/nurse data | **Functional** |
| Reports | Computed from mocks | **Functional** |
| Profile | In-memory per user | **Functional** |
| OPD queue | React context (in-memory) | **Functional** |
| Backend API | `lib/api/client.ts` | Defined, **not wired** |

Future backend: set `NEXT_PUBLIC_API_URL` (default `http://localhost:8000/api`).

---

## Import conventions

```ts
// Shared UI primitives
import { MetricCard, ChartWrapper, ExportButton, toast } from "@/components/ui";
import { DataTable } from "@/components/tables/DataTable";
import BedGrid from "@/components/BedGrid";

// Theme
import { meridian, muiTheme } from "@/styles/theme";

// Feature screens (thin pages import these)
import { ReceptionistRegistrationScreen } from "@/features/receptionist/ReceptionistRegistrationScreen";

// Auth
import { getDefaultRouteForRole } from "@/lib/auth/routes";
```

---

## How to add a new screen

1. **Route** — create `src/app/<module>/.../page.tsx`:

```tsx
import { MyScreen } from "@/features/my-module/MyScreen";

export default function Page() {
  return <MyScreen />;
}
```

2. **Feature** — implement `src/features/my-module/MyScreen.tsx`.
3. **Shared UI** — if reused across modules, add to `src/components/`.
4. **Navigation** — add entry in `src/config/navigation.ts` with `roles` if restricted.
5. **Tokens** — use Meridian / CSS variables for colors.

---

## Temporary / remove later

| Item | Note |
| --- | --- |
| `features/billing/SharedUiPreview.tsx` | Shared component gallery for review |
| `app/(dashboard)/billing/page.tsx` | Remove when gallery is no longer needed |
| Legacy routes `/opd`, `/patients`, `/laboratory` | Redirects only — safe to remove once all links updated |

---

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | Dev/production port |
| `HEALTHDOC_HTTPS` | enabled | Set to `0` to disable HTTPS in dev |
| `HEALTHDOC_URL` | `http://localhost:3000` | Electron shell target URL |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api` | Future backend base URL |

---

## Related documentation

- Next.js project rules: `AGENTS.md`
- Next.js 16 breaking changes: `node_modules/next/dist/docs/` (read before changing App Router code)

---

*healthdoc frontend — HMIS UI for hospital reception, clinical workflows, and operational reporting.*
