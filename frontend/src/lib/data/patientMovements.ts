import { PatientMovementRecord } from "@/features/nurse/components/PatientMovement/PatientMovement.types";

// admission_id values match lib/data/admissionsByBed.ts ("adm-1", "adm-2") so
// selecting bed "1" or "3" on the dashboard shows this data.
export const PATIENT_MOVEMENTS: PatientMovementRecord[] = [
  {
    id: "1",
    admission_id: "adm-1",
    from_ward_id: null, // first assignment at admission — no prior ward
    from_bed_id: null,
    to_ward_id: "general",
    to_bed_id: "1",
    moved_at: "2026-07-16T08:00:00Z",
    reason: "Initial ward assignment at admission",
    moved_by: "b3f1a2c4-1111-4a5b-9c1d-000000000001",
  },
  {
    id: "2",
    admission_id: "adm-2",
    from_ward_id: "general",
    from_bed_id: "2",
    to_ward_id: "icu",
    to_bed_id: "3",
    moved_at: "2026-07-16T10:00:00Z",
    reason: "Transferred to ICU for closer monitoring",
    moved_by: "c4d5e6f7-2222-4a5b-9c1d-000000000003",
  },
];