import { z } from "zod";

export const addNursingNoteSchema = z.object({
  patientId: z
    .string()
    .trim()
    .min(1, "Patient is required"),

  note: z
    .string()
    .trim()
    .min(5, "Note is required")
    .max(1000, "Note cannot exceed 1000 characters"),

  priority: z.enum([
    "Low",
    "Normal",
    "High",
    "Critical",
  ]),

  category: z
    .string()
    .trim()
    .min(1, "Category is required"),
});

export type AddNursingNoteSchema =
  z.infer<typeof addNursingNoteSchema>;