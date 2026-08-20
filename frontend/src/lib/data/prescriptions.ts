import { ENCOUNTER_1_ID, PATIENT_1_ID, PRESCRIPTION_1_ID } from "./mockIds";

export interface Prescription {
  id: string;
  encounter_id: string;
  patient_id: string;
}

export const PRESCRIPTIONS: Prescription[] = [
  { id: PRESCRIPTION_1_ID, encounter_id: ENCOUNTER_1_ID, patient_id: PATIENT_1_ID },
];
