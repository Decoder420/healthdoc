import type { AddNursingNoteSchema } from "@/features/nurse/validation/nursingNote.schema";

export const DEFAULT_VALUES: AddNursingNoteSchema = {
  patientId: "",
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

export const PRIORITIES = [
  "Low",
  "Normal",
  "High",
  "Critical",
] as const;