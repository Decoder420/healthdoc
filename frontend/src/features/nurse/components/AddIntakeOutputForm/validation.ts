import { z } from "zod";

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