"use client";

import { ConsultationWorkspace } from "@/features/doctor";
import { mockEncounterContext } from "@/lib/mock";

export default function Page() {
  return (
    <main style={{ padding: "2rem", maxWidth: 1280, margin: "0 auto" }}>
      <ConsultationWorkspace context={mockEncounterContext} />
    </main>
  );
}
