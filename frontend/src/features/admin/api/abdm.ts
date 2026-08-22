import { api } from "@/lib/api";

export interface AbhaLink {
  patient_id: string;
  abha_number: string | null;
}

export function getAbhaLink(patientId: string): Promise<AbhaLink> {
  return api<AbhaLink>(`/abdm/abha/patients/${patientId}/abha`);
}

export function unlinkAbha(patientId: string): Promise<AbhaLink> {
  return api<AbhaLink>(`/abdm/abha/patients/${patientId}/abha`, {
    method: "DELETE",
  });
}
