import { z } from "zod";

export const addNursingNoteSchema = z.object({
  encounter_id: z.string().min(1),
  patient_id: z.string().min(1),

  category: z.string().min(1),

  priority: z.string().min(1),

  note: z
    .string()
    .min(10, "Note must contain at least 10 characters")
    .max(1000),
});

export type AddNursingNoteSchema = z.infer<typeof addNursingNoteSchema>;
