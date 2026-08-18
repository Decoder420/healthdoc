export interface Prescription {
  id: string;
  encounter_id: string;
  patient_id: string;
}

// TEMPORARY mock — prescriptions [Blame] (encounter_id, patient_id).
// medications (prescription_items) don't carry patient_id directly; they
// link through prescription_id → prescriptions.patient_id. Extend this as
// more mock medications are added.
export const PRESCRIPTIONS: Prescription[] = [
  { id: "rx-1", encounter_id: "enc-1", patient_id: "p1" },
];
