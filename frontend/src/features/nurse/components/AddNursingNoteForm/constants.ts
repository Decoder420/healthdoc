import type { AddNursingNoteSchema } from "./validation";

export const DEFAULT_VALUES: AddNursingNoteSchema = {
  encounter_id: "",
  patient_id: "",
  category: "General",
  priority: "Normal",
  note: "",
};

export const NOTE_CATEGORIES = [
  "General",
  "Medication",
  "Vitals",
  "Procedure",
  "Observation",
];

export const PRIORITIES = ["Low", "Normal", "High", "Critical"] as const;
