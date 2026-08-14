import type { AdmissionStatus } from "@/features/ipd/services/ipd.service";

export type { AdmissionStatus };

export interface AdmissionStatusRecord {
  admission_id: string;
  status: AdmissionStatus;
  updated_at?: string;
}

export interface AdmissionStatusProps {
  admissionId: string | null;
  record: AdmissionStatusRecord | null;
}