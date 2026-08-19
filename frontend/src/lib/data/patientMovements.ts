import { PatientMovementRecord } from "@/features/nurse/components/PatientMovement/PatientMovement.types";
import {
  ADMISSION_1_ID,
  ADMISSION_2_ID,
  BED_B101_ID,
  BED_B102_ID,
  BED_I201_ID,
  GENERAL_WARD_ID,
  ICU_WARD_ID,
  NURSE_ANITA_ID,
  NURSE_KIRAN_ID,
} from "./mockIds";

export const PATIENT_MOVEMENTS: PatientMovementRecord[] = [
  {
    id: "ad000001-0000-4000-8000-000000000001",
    admission_id: ADMISSION_1_ID,
    from_ward_id: null,
    from_bed_id: null,
    to_ward_id: GENERAL_WARD_ID,
    to_bed_id: BED_B101_ID,
    moved_at: "2026-07-16T08:00:00Z",
    reason: "Initial ward assignment at admission",
    moved_by: NURSE_ANITA_ID,
  },
  {
    id: "ad000001-0000-4000-8000-000000000002",
    admission_id: ADMISSION_2_ID,
    from_ward_id: GENERAL_WARD_ID,
    from_bed_id: BED_B102_ID,
    to_ward_id: ICU_WARD_ID,
    to_bed_id: BED_I201_ID,
    moved_at: "2026-07-16T10:00:00Z",
    reason: "Moved to ICU for closer monitoring",
    moved_by: NURSE_KIRAN_ID,
  },
];
