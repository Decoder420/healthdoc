import { Patient } from "../PatientDetails/PatientDetails.types";

export interface HandoverNote {
  id: string;
  patientUhid: string;
  fromShift: "Morning" | "Evening" | "Night";
  toShift: "Morning" | "Evening" | "Night";
  outgoingNurse: string;
  incomingNurse: string;
  handedOverAt: string;
  summary: string;
}

export interface HandoverNotesProps {
  patient: Patient | null;
  notes: HandoverNote[];
}