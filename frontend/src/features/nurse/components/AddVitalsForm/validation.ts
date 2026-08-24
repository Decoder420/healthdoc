import { z } from "zod";

export const addVitalsSchema = z
  .object({
    patient_id: z.string().trim().min(1, "Patient is required"),
    encounter_id: z.string().optional(),
    admission_id: z.string().optional(),

    measured_at: z.string().min(1),

    height_cm: z
      .number()
      .positive("Height must be greater than 0")
      .max(300, "Height cannot exceed 300 cm")
      .optional(),
    weight_kg: z
      .number()
      .positive("Weight must be greater than 0")
      .max(700, "Weight cannot exceed 700 kg")
      .optional(),
    waist_cm: z
      .number()
      .min(0, "Waist must be at least 0 cm")
      .max(300, "Waist cannot exceed 300 cm")
      .optional(),
    hip_cm: z
      .number()
      .min(0, "Hip must be at least 0 cm")
      .max(300, "Hip cannot exceed 300 cm")
      .optional(),

    temp_c: z
      .number()
      .min(20, "Temperature must be at least 20°C")
      .max(45, "Temperature cannot exceed 45°C")
      .optional(),

    pulse_bpm: z
      .number()
      .int()
      .min(0, "Pulse must be at least 0 bpm")
      .max(350, "Pulse cannot exceed 350 bpm")
      .optional(),

    resp_rate: z
      .number()
      .int()
      .min(0, "Respiratory rate must be at least 0")
      .max(120, "Respiratory rate cannot exceed 120")
      .optional(),

    bp_systolic: z
      .number()
      .int()
      .min(0, "Systolic BP must be at least 0")
      .max(350, "Systolic BP cannot exceed 350")
      .optional(),

    bp_diastolic: z
      .number()
      .int()
      .min(0, "Diastolic BP must be at least 0")
      .max(250, "Diastolic BP cannot exceed 250")
      .optional(),

    spo2_pct: z
      .number()
      .min(0, "SpO₂ must be at least 0%")
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
  })
  .refine(
    (data) =>
      data.bp_systolic == null ||
      data.bp_diastolic == null ||
      data.bp_diastolic < data.bp_systolic,
    {
      message: "Diastolic BP must be less than systolic BP",
      path: ["bp_diastolic"],
    }
  );

export type AddVitalsSchema = z.infer<typeof addVitalsSchema>;