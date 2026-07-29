// One submit = one row. Each record is either an intake OR an output, never both
// — the old "intakeType + intakeAmount + outputType + outputAmount" shape produced
// a form that could imply two rows worth of data from a single submit. Per the
// schema doc (`intake_output_records`), there is exactly one entry_type and one
// volume_ml per row.
//
// entry_type must be exactly one of these five lowercase snake_case values —
// nothing else. The old "Blood", "Tube Feed", "Stool", "Vomit" labels are NOT in
// this enum and have been removed; each maps to the closest allowed value below.
export const ENTRY_TYPES = [
  { label: "Oral Intake", value: "intake_oral" },
  { label: "IV Intake (includes blood/fluids given via IV)", value: "intake_iv" },
  { label: "Urine Output", value: "output_urine" },
  { label: "Drain Output (includes tube/vomit-type drainage)", value: "output_drain" },
  { label: "Other Output (e.g. stool)", value: "output_other" },
] as const;

export const DEFAULT_VALUES = {
  admission_id: "",
  entry_type: "intake_oral",
  recorded_at: "",
  volume_ml: undefined,
  notes: "",
} as const;