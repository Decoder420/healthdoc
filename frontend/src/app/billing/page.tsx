"use client";

import { SharedUiPreview } from "@/features/billing/SharedUiPreview";

export default function Page() {
  return (
    <main style={{ padding: "2rem", maxWidth: 1120, margin: "0 auto" }}>
      <h1 style={{ margin: 0 }}>Billing</h1>
      {/* TEMP: remove SharedUiPreview when gallery is no longer needed */}
      <SharedUiPreview />
    </main>
  );
}
