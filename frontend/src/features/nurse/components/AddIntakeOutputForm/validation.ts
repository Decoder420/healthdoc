import { z } from "zod";

export const addIntakeOutputSchema = z.object({
  patientId: z.string().min(1),

  intakeType: z.string(),

  intakeAmount: z
    .number()
    .positive("Amount must be greater than 0"),

  outputType: z.string(),

  outputAmount: z
    .number()
    .positive("Amount must be greater than 0"),

  recordedTime: z.string().min(1),

  remarks: z.string().max(500),
});

export type AddIntakeOutputSchema = z.infer<
  typeof addIntakeOutputSchema
>;