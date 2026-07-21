import { z } from "zod";

export const addPatientMovementSchema =
  z.object({
    patientId: z.string().min(1),

    fromWard: z.string().min(1),

    toWard: z.string().min(1),

    fromBed: z.string().min(1),

    toBed: z.string().min(1),

    movementType: z.string(),

    movementTime: z.string().min(1),

    reason: z.string().min(5),

    approvedBy: z.string().min(2),

    remarks: z.string().max(500),
  });

export type AddPatientMovementSchema =
  z.infer<typeof addPatientMovementSchema>;