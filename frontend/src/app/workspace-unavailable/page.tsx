"use client";

import { useAuth } from "@/providers/auth-provider";

/**
 * Fail-closed landing for recognised roles whose product surface is not built.
 *
 * Superadmin is cloud-only and explicitly barred from facility/clinical data.
 * Sending it to /admin made a missing platform workspace look like permission
 * to enter facility administration. This page is deliberately data-free until
 * the platform APIs and their cross-facility policy exist.
 */
export default function Page() {
  const { logout } = useAuth();

  return (
    <section className="mx-auto max-w-2xl p-6">
      <div className="surface-card space-y-4 p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          Platform administration
        </p>
        <h1 className="text-3xl font-semibold">Workspace not available</h1>
        <p className="text-sm text-muted-foreground">
          This account is recognised as a platform superadmin, but HealthDoc does not yet have a
          platform-management workspace. No facility or clinical data has been requested.
        </p>
        <button type="button" className="underline" onClick={() => void logout()}>
          Sign out
        </button>
      </div>
    </section>
  );
}
