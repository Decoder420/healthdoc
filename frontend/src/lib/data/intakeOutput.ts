import { IntakeOutputRecord } from "@/features/nurse/components/IntakeOutput/IntakeOutput.types";

// admission_id values match lib/data/admissionsByBed.ts ("adm-1", "adm-2").
// Each record is a single intake OR output entry — one row per submit, per
// the schema doc and TL feedback (no more combined intake+output rows).
export const INTAKE_OUTPUT: IntakeOutputRecord[] = [
  {
    id: "1",
    admission_id: "adm-1",
    recorded_at: "2026-07-16T08:00:00Z",
    entry_type: "intake_oral",
    volume_ml: 500,
    notes: null,
    created_by: "b3f1a2c4-1111-4a5b-9c1d-000000000001",
    created_at: "2026-07-16T08:00:00Z",
  },
  {
    id: "2",
    admission_id: "adm-1",
    recorded_at: "2026-07-16T08:30:00Z",
    entry_type: "output_urine",
    volume_ml: 250,
    notes: null,
    created_by: "b3f1a2c4-1111-4a5b-9c1d-000000000001",
    created_at: "2026-07-16T08:30:00Z",
  },
  {
    id: "3",
    admission_id: "adm-1",
    recorded_at: "2026-07-16T14:00:00Z",
    entry_type: "intake_iv",
    volume_ml: 700,
    notes: "IV fluids as per doctor's order",
    created_by: "b3f1a2c4-1111-4a5b-9c1d-000000000001",
    created_at: "2026-07-16T14:00:00Z",
  },
  {
    id: "4",
    admission_id: "adm-1",
    recorded_at: "2026-07-16T14:30:00Z",
    entry_type: "output_urine",
    volume_ml: 500,
    notes: null,
    created_by: "b3f1a2c4-1111-4a5b-9c1d-000000000001",
    created_at: "2026-07-16T14:30:00Z",
  },
  {
    id: "5",
    admission_id: "adm-2",
    recorded_at: "2026-07-16T10:30:00Z",
    entry_type: "intake_oral",
    volume_ml: 600,
    notes: null,
    created_by: "c4d5e6f7-2222-4a5b-9c1d-000000000003",
    created_at: "2026-07-16T10:30:00Z",
  },
  {
    id: "6",
    admission_id: "adm-2",
    recorded_at: "2026-07-16T11:00:00Z",
    entry_type: "output_drain",
    volume_ml: 450,
    notes: null,
    created_by: "c4d5e6f7-2222-4a5b-9c1d-000000000003",
    created_at: "2026-07-16T11:00:00Z",
  },
];