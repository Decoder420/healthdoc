import { z } from "zod";

export const addVitalsSchema = z
  .object({
    patient_id: z.string().trim().min(1, "Patient is required"),
    encounter_id: z.string().optional(),
    admission_id: z.string().optional(),

    measured_at: z.string().min(1),

    height_cm: z.number().positive("Height must be greater than 0").optional(),
    weight_kg: z.number().positive("Weight must be greater than 0").optional(),
    waist_cm: z.number().positive().optional(),
    hip_cm: z.number().positive().optional(),

    temp_c: z
      .number()
      .min(30, "Temperature must be at least 30°C")
      .max(45, "Temperature cannot exceed 45°C")
      .optional(),

    pulse_bpm: z
      .number()
      .int()
      .min(30, "Pulse must be at least 30 bpm")
      .max(220, "Pulse cannot exceed 220 bpm")
      .optional(),

    resp_rate: z
      .number()
      .int()
      .min(5, "Respiratory rate must be at least 5")
      .max(60, "Respiratory rate cannot exceed 60")
      .optional(),

    bp_systolic: z
      .number()
      .int()
      .min(50, "Systolic BP must be at least 50")
      .max(250, "Systolic BP cannot exceed 250")
      .optional(),

    bp_diastolic: z
      .number()
      .int()
      .min(30, "Diastolic BP must be at least 30")
      .max(150, "Diastolic BP cannot exceed 150")
      .optional(),

    spo2_pct: z
      .number()
      .min(50, "SpO₂ must be at least 50%")
      .max(100, "SpO₂ cannot exceed 100%")
      .optional(),

    pain_score: z
      .number()
      .int()
      .min(0, "Pain score must be between 0 and 10")
      .max(10, "Pain score must be between 0 and 10")
      .optional(),
  })
  .refine((data) => !!data.encounter_id || !!data.admission_id, {
    message: "Vitals must be linked to either an encounter or an admission",
    path: ["admission_id"],
  });

export type AddVitalsSchema = z.infer<typeof addVitalsSchema>;
