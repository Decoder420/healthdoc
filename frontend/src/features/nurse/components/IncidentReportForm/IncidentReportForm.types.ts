export type IncidentType =
  | "medication_error"
  | "patient_fall"
  | "pressure_injury"
  | "wrong_patient"
  | "wrong_site"
  | "equipment_failure"
  | "needlestick"
  | "transfusion_reaction"
  | "hospital_acquired_infection"
  | "near_miss"
  | "other";

export type IncidentSeverity = "no_harm" | "minor" | "moderate" | "severe" | "death";

export type IncidentReportFormProps = {
  patientId?: string;
  admissionId?: string;
  departmentId?: string;
  wardId?: string;
  onSuccess?: () => void;
};
