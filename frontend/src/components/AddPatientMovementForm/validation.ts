import { z } from "zod";

export const addPatientMovementSchema = z.object({
  admission_id: z.string().min(1),
  to_ward_id: z.string().min(1, "Select a destination ward"),
  to_bed_id: z.string().min(1, "Select a destination bed"),
  reason: z.string().optional(),
});

export type AddPatientMovementSchema = z.infer<typeof addPatientMovementSchema>;
