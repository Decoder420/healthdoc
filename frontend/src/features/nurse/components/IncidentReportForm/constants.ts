import { IncidentType, IncidentSeverity } from "./IncidentReportForm.types";

export const INCIDENT_TYPES: { value: IncidentType; label: string }[] = [
  { value: "medication_error", label: "Medication Error" },
  { value: "patient_fall", label: "Patient Fall" },
  { value: "pressure_injury", label: "Pressure Injury" },
  { value: "wrong_patient", label: "Wrong Patient" },
  { value: "wrong_site", label: "Wrong Site" },
  { value: "equipment_failure", label: "Equipment Failure" },
  { value: "needlestick", label: "Needlestick" },
  { value: "transfusion_reaction", label: "Transfusion Reaction" },
  { value: "hospital_acquired_infection", label: "Hospital-Acquired Infection" },
  { value: "near_miss", label: "Near Miss (did not reach patient)" },
  { value: "other", label: "Other" },
];

// Harm that actually REACHED the patient. near_miss is NOT a severity —
// it's a type (above), for events that never reached the patient.
export const SEVERITIES: { value: IncidentSeverity; label: string }[] = [
  { value: "no_harm", label: "No Harm" },
  { value: "minor", label: "Minor" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
  { value: "death", label: "Death" },
];
