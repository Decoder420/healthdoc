import { Patient } from "../PatientDetails/PatientDetails.types";

export interface NursingNote {
  id: string;
  patientUhid: string;
  recordedAt: string;
  recordedBy: string;
  note: string;
}

export interface NursingNotesProps {
  patient: Patient | null;
  notes: NursingNote[];
}