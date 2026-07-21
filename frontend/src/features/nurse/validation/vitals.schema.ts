import { z } from "zod";

export const addVitalsSchema = z.object({
  patientId: z
    .string()
    .trim()
    .min(1, "Patient is required"),

  temperature: z
    .number()
    .min(30, "Temperature must be at least 30°C")
    .max(45, "Temperature cannot exceed 45°C"),

  pulse: z
    .number()
    .min(30, "Pulse must be at least 30 bpm")
    .max(220, "Pulse cannot exceed 220 bpm"),

  respiratoryRate: z
    .number()
    .min(5, "Respiratory rate must be at least 5")
    .max(60, "Respiratory rate cannot exceed 60"),

  systolicBloodPressure: z
    .number()
    .min(50, "Systolic BP must be at least 50")
    .max(250, "Systolic BP cannot exceed 250"),

  diastolicBloodPressure: z
    .number()
    .min(30, "Diastolic BP must be at least 30")
    .max(150, "Diastolic BP cannot exceed 150"),

  oxygenSaturation: z
    .number()
    .min(50, "SpO₂ must be at least 50%")
    .max(100, "SpO₂ cannot exceed 100%"),

  weight: z
    .number()
    .positive("Weight must be greater than 0")
    .optional(),

  height: z
    .number()
    .positive("Height must be greater than 0")
    .optional(),

  painScore: z
    .number()
    .min(0, "Pain score must be between 0 and 10")
    .max(10, "Pain score must be between 0 and 10")
    .optional(),

  remarks: z
    .string()
    .trim()
    .max(500, "Remarks cannot exceed 500 characters")
    .optional(),
});

export type AddVitalsSchema = z.infer<typeof addVitalsSchema>;