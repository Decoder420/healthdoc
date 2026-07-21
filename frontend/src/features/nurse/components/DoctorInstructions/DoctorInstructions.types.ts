import { Patient } from "../PatientDetails/PatientDetails.types";

export interface DoctorInstruction {
  id: string;
  patientUhid: string;
  doctorName: string;
  orderedAt: string;
  instruction: string;
  status: "Pending" | "Completed";
}

export interface DoctorInstructionsProps {
  patient: Patient | null;
  instructions: DoctorInstruction[];
}