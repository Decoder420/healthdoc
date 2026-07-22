"use client";

import { AuditTrailDashboard } from "@/features/audit-viewer";

export default function Page() {
  return (
    <main style={{ padding: "2rem", maxWidth: 1280, margin: "0 auto" }}>
      <AuditTrailDashboard />
    </main>
  );
}
