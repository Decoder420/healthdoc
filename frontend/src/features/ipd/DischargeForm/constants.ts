import { DischargeType } from "./validation";

export const DISCHARGE_TYPE_LABELS: Record<DischargeType, string> = {
  discharged: "Discharged (Routine)",
  dama: "DAMA (Discharge Against Medical Advice)",
  deceased: "Deceased",
  absconded: "Absconded",
  transferred: "Transferred to Another Facility",
};

export const MODULE_LABELS: Record<string, string> = {
  pharmacy: "Pharmacy",
  billing: "Billing",
  nursing: "Nursing",
  lab: "Lab",
  radiology: "Radiology",
  patient: "Patient",
};

export const DEFAULT_VALUES = {
  admission_id: "",
  discharged_at: "",
  discharge_type: "discharged" as const,
  discharge_summary: "",
  follow_up_date: "",
  destination_facility_id: "",
  destination_facility_name: "",
};