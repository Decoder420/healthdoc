import { AdmissionStatusRecord } from "@/features/nurse/components/AdmissionStatus/AdmissionStatus.types";
import { ADMISSION_1_ID, ADMISSION_2_ID, ADMISSION_3_ID } from "./mockIds";

export const ADMISSION_STATUS: AdmissionStatusRecord[] = [
  {
    admission_id: ADMISSION_1_ID,
    status: "admitted",
    updated_at: "2026-07-12T10:00:00Z",
  },
  {
    admission_id: ADMISSION_2_ID,
    status: "admitted",
    updated_at: "2026-07-16T09:00:00Z",
  },
  {
    admission_id: ADMISSION_3_ID,
    status: "admitted",
    updated_at: "2026-08-01T14:30:00Z",
  },
];
