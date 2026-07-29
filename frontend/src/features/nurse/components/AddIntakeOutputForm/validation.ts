import { z } from "zod";

// Per HealthDoc_Database_Schema_v3_5.docx — `intake_output_records` (migration 0023).
// admission_id required, recorded_at is a timestamp, entry_type is exactly one of
// the five listed values, volume_ml must be > 0, notes is optional.
export const addIntakeOutputSchema = z.object({
  admission_id: z.string().min(1),

  recorded_at: z.string().min(1),

  entry_type: z.enum([
    "intake_oral",
    "intake_iv",
    "output_urine",
    "output_drain",
    "output_other",
  ]),

  volume_ml: z.number().positive("Volume must be greater than 0"),

  notes: z.string().max(500).optional(),
});

export type AddIntakeOutputSchema = z.infer<typeof addIntakeOutputSchema>;