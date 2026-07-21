import { z } from "zod";

export const addProcedureAssistanceSchema =
  z.object({
    patientId: z.string().min(1),

    procedureName: z.string().min(2),

    procedureCategory: z.string(),

    doctorName: z.string().min(2),

    assistingNurse: z.string().min(2),

    procedureTime: z.string().min(1),

    status: z.string(),

    equipmentUsed: z.string().min(2),

    consentTaken: z.string(),

    notes: z.string().max(1000),

    complications: z.string().max(1000),
  });

export type AddProcedureAssistanceSchema =
  z.infer<
    typeof addProcedureAssistanceSchema
  >;