import { z } from "zod";

export const addIntakeOutputSchema = z.object({
  patientId: z
    .string()
    .trim()
    .min(1, "Patient is required"),

  intakeType: z
    .string()
    .trim()
    .min(1, "Intake type is required"),

  intakeAmount: z
    .number()
    .positive("Amount must be greater than 0"),

  outputType: z
    .string()
    .trim()
    .min(1, "Output type is required"),

  outputAmount: z
    .number()
    .positive("Amount must be greater than 0"),

  recordedTime: z
    .string()
    .min(1, "Recorded time is required"),

  remarks: z
    .string()
    .max(500, "Remarks cannot exceed 500 characters")
    .optional(),
});

export type AddIntakeOutputSchema = z.infer<
  typeof addIntakeOutputSchema
>;