import { z } from "zod";

export const addHandoverSchema =
  z.object({
    patientId: z.string().min(1),

    fromShift: z.string(),

    toShift: z.string(),

    outgoingNurse: z.string().min(2),

    incomingNurse: z.string().min(2),

    handedOverAt: z.string().min(1),

    summary: z.string().min(10),

    pendingTasks: z.string().max(500),

    specialInstructions: z.string().max(500),
  });

export type AddHandoverSchema =
  z.infer<
    typeof addHandoverSchema
  >;