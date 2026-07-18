"use client";

import { EMARTable } from "@/components/tables/EMARTable";
import type { EmarRow } from "@/components/tables/EMARTable";

const MOCK_EMAR: EmarRow[] = [
  {
    id: "e1",
    medication: "Paracetamol",
    dose: "500mg",
    route: "PO",
    scheduledAt: "08:00",
    status: "given",
    nurse: "Anjali Rao",
  },
  {
    id: "e2",
    medication: "Amoxicillin",
    dose: "250mg",
    route: "PO",
    scheduledAt: "12:00",
    status: "due",
    nurse: "Anjali Rao",
  },
];

export function NurseEmarScreen() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">eMAR</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Electronic medication administration record.
        </p>
      </div>
      <EMARTable rows={MOCK_EMAR} />
    </div>
  );
}
