export type AdmissionStatus =
  | "admitted"
  | "transferred"
  | "discharged"
  | "dama"
  | "deceased"
  | "absconded";

export interface AdmissionStatusRecord {
  id: string;
  admission_id: string;
  status: AdmissionStatus;
  updated_at?: string;
}

export interface AdmissionStatusProps {
  admissionId: string | null;
  records: AdmissionStatusRecord[];
}