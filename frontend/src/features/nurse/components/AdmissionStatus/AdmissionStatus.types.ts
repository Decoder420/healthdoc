import type { AdmissionStatus } from "@/features/ipd/api/ipd";

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