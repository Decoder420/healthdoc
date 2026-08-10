import { z } from "zod";

export const addPatientMovementSchema = z.object({
  admission_id: z.string().min(1),

  from_ward_id: z.string().nullable(),
  from_bed_id: z.string().nullable(),

  to_ward_id: z.string().min(1, "Select a destination ward"),
  to_bed_id: z.string().min(1, "Select a destination bed"),

  moved_at: z.string().min(1),

  reason: z.string().optional(),

  moved_by: z.string().uuid(),
});

export type AddPatientMovementSchema = z.infer<typeof addPatientMovementSchema>;