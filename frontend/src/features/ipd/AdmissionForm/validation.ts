import { z } from "zod";

export const addAdmissionSchema = z.object({
  visit_id: z.string().min(1),
  patient_id: z.string().min(1),
  ward_id: z.string().min(1, "Select a ward"),
  bed_id: z.string().min(1, "Select a bed"),
  admitted_at: z.string().min(1),
  reason: z.string().optional(), 
});

export type AddAdmissionSchema = z.infer<typeof addAdmissionSchema>;