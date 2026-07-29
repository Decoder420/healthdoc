// admissionsByBed.ts — TEMPORARY mock lookup only.
// Real admission_id per bed should come from a joined bed+admission endpoint
// (same gap flagged for patient_name on beds). Until that endpoint exists, this
// maps bed.id -> admission_id so Handover/Intake-Output can be demoed with a
// real admission_id instead of a patient uhid.
//
// Only occupied/reserved beds have an admission — vacant beds are intentionally
// left unmapped, since there's no patient to have handover/IO records for.
export const admissionsByBedId: Record<string, string> = {
  "1": "adm-1", // B-101, general ward, occupied
  "3": "adm-2", // C-301, icu, reserved
  "5": "adm-3", // ccu bed, occupied
};