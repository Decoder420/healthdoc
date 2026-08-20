import { z } from "zod";

export const addAdmissionSchema = z.object({
  visit_id: z.string().uuid("Visit ID must be a UUID"),
  patient_id: z.string().uuid("Patient ID must be a UUID"),
  ward_id: z.string().uuid("Select a ward"),
  bed_id: z.string().uuid("Select a bed"),
  admitted_at: z.string().min(1),
  reason: z.string().optional(),
});

export type AddAdmissionSchema = z.infer<typeof addAdmissionSchema>;