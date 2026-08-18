import { z } from "zod";

export const addHandoverSchema = z.object({
  admission_id: z.uuid(),

  shift: z.enum(["morning", "evening", "night"]),

  situation: z.string().min(5),

  background: z.string().min(5),

  assessment: z.string().min(5),

  recommendation: z.string().min(5),

  handed_over_to: z.uuid(),
});

export type AddHandoverSchema = z.infer<typeof addHandoverSchema>;