export const DEFAULT_VALUES = {
  admission_id: "",
  shift: "morning",
  situation: "",
  background: "",
  assessment: "",
  recommendation: "",
  handed_over_to: "",
} as const;

export const SHIFTS = ["morning", "evening", "night"] as const;