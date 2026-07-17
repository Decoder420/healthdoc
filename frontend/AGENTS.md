# Agent rules

When working in this frontend package:

1. Prefer the **existing folder layout** (App Router under `src/app`, domain screens under `src/features`, shared UI under `src/components`).
2. Follow Next.js App Router conventions (see `node_modules/next/dist/docs` when available).
3. Use design tokens from `src/styles/globals.css` and `src/styles/theme/` — support **light and dark** via `.dark`.
4. Lab role work lives under:
   - Routes: `src/app/(dashboard)/lab/`
   - Screens: `src/features/lab/`
   - Widgets: `src/components/dashboard/lab/`
5. Do not invent parallel folder trees. Keep `app/` for URLs only; put business UI in `features/` + `components/`.
6. Auth is stubbed in `src/providers/auth-provider.tsx` until Keycloak (F1-W1-03).
