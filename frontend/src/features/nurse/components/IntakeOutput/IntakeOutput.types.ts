import { Patient } from "../PatientDetails/PatientDetails.types";

export interface IntakeOutputRecord {
  id: string;
  patientUhid: string;
  recordedAt: string;
  intake: number;
  output: number;
  balance: number;
  recordedBy: string;
}

export interface IntakeOutputProps {
  patient: Patient | null;
  records: IntakeOutputRecord[];
}