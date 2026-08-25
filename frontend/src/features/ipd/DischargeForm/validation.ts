import { z } from "zod";

export const DISCHARGE_TYPES = [
  "discharged",
  "dama",
  "deceased",
  "absconded",
  "transferred",
] as const;

export const addDischargeSchema = z.object({
  admission_id: z.string().uuid("Admission ID must be a UUID"),
  discharged_at: z.string().min(1),
  discharge_type: z.enum(DISCHARGE_TYPES),
  discharge_summary: z.string().min(1, "Discharge summary is required"),
  follow_up_date: z.string().optional(),
});

export type AddDischargeSchema = z.infer<typeof addDischargeSchema>;
export type DischargeType = (typeof DISCHARGE_TYPES)[number];