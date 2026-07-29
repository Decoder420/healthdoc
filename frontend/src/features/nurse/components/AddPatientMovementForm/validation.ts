import { z } from "zod";

// Per HealthDoc_Database_Schema_v3_5.docx — `patient_movement_log` (migration 0023).
// from_ward_id/from_bed_id are nullable (patient's current location), to_ward_id/
// to_bed_id are required (destination), moved_by is a required UUID (this table
// has no [Blame] audit mixin, so it must be submitted explicitly, unlike
// handed_over_to's created_by counterpart in nursing_handover_notes).
export const addPatientMovementSchema = z.object({
  admission_id: z.string().min(1),

  from_ward_id: z.string().nullable(),
  from_bed_id: z.string().nullable(),

  to_ward_id: z.string().min(1, "Select a destination ward"),
  to_bed_id: z.string().min(1, "Select a destination bed"),

  moved_at: z.string().min(1),

  reason: z.string().min(5),

  // Should ideally come from the logged-in nurse's session, not typed manually.
  moved_by: z.string().uuid(),
});

export type AddPatientMovementSchema = z.infer<typeof addPatientMovementSchema>;