import type { Discharge } from "@/features/ipd/services/ipd.service";

// TEMPORARY — mock discharges for local testing of the "Discharges Today"
// KPI. Table confirmed (discharges, migration 0015). Remove once
// getDischarges() is wired to the real backend.
export const MOCK_DISCHARGES: Discharge[] = [
  {
    id: "dis-1",
    admission_id: "adm-old-1",
    discharged_at: new Date().toISOString(), // today — shows up in "Discharges Today"
    discharge_type: "discharged",
    discharge_summary: "Routine discharge, condition stable.",
    follow_up_date: null,
  },
  {
    id: "dis-2",
    admission_id: "adm-old-2",
    discharged_at: "2026-08-05T11:00:00Z", // not today
    discharge_type: "discharged",
    discharge_summary: "Recovered, follow-up advised.",
    follow_up_date: "2026-08-20",
  },
];
