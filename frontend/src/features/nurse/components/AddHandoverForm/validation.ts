import { z } from "zod";
 
// NOTE (handed_over_to): this should be a real user UUID (users.id) of the nurse
// taking over — not a free-text name. Using z.string().uuid() here; if the actual
// picker is a dropdown of nurse users, this validation stays the same, only the
// form field (TextField -> SelectField) changes once a nurse-list source exists.
export const addHandoverSchema = z.object({
  admission_id: z.string().min(1),
 
  shift: z.enum(["morning", "evening", "night"]),
 
  situation: z.string().min(5),
 
  background: z.string().min(5),
 
  assessment: z.string().min(5),
 
  recommendation: z.string().min(5),
 
  handed_over_to: z.string().uuid(),
});
 
export type AddHandoverSchema = z.infer<typeof addHandoverSchema>;
 
