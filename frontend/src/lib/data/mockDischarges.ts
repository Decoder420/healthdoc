import type { Discharge } from "@/features/ipd/services/ipd.service";
import {
  ADMISSION_OLD_1_ID,
  ADMISSION_OLD_2_ID,
  DISCHARGE_1_ID,
  DISCHARGE_2_ID,
} from "./mockIds";

export const MOCK_DISCHARGES: Discharge[] = [
  {
    id: DISCHARGE_1_ID,
    admission_id: ADMISSION_OLD_1_ID,
    discharged_at: new Date().toISOString(),
    discharge_type: "discharged",
    discharge_summary: "Routine discharge, condition stable.",
    follow_up_date: null,
  },
  {
    id: DISCHARGE_2_ID,
    admission_id: ADMISSION_OLD_2_ID,
    discharged_at: "2026-08-05T11:00:00Z",
    discharge_type: "discharged",
    discharge_summary: "Recovered, follow-up advised.",
    follow_up_date: "2026-08-20",
  },
];
