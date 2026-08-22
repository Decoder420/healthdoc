import { api, newIdempotencyKey } from "@/lib/api";

export interface EmergencyPatientInput {
  full_name?: string;
  sex: "male" | "female" | "other" | "unknown";
  age_years: number;
  mobile?: string;
}

export interface EmergencyPatient {
  id: string;
  thid: string | null;
  uhid: string | null;
  full_name: string;
  sex: string;
  age_years: number | null;
  identity_path: string;
  identity_status: string;
  facility_id: string;
}

export function registerEmergencyPatient(
  payload: EmergencyPatientInput,
): Promise<EmergencyPatient> {
  return api<EmergencyPatient>("/emergency/patients", {
    method: "POST",
    idempotencyKey: newIdempotencyKey(),
    body: JSON.stringify(payload),
  });
}
