import { z } from "zod";

export const addMedicationAdministrationSchema =
  z.object({
    patientId: z.string().min(1),

    medicationName: z.string().min(2),

    dosage: z.string().min(1),

    route: z.string(),

    frequency: z.string(),

    scheduledTime: z.string().min(1),

    administeredTime: z.string().min(1),

    status: z.string(),

    remarks: z.string().max(500),
  });

export type AddMedicationAdministrationSchema =
  z.infer<
    typeof addMedicationAdministrationSchema
  >;