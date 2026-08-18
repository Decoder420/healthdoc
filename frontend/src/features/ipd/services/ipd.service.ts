import { api } from "@/lib/api"; // same helper pattern as nurse.service.ts — confirm this alias resolves in your app

import type { AddAdmissionSchema } from "@/features/ipd/AdmissionForm/validation";
import type { AddDischargeSchema } from "@/features/ipd/DischargeForm/validation";
import type { Ward } from "@/features/nurse/components/WardSelector/WardSelector.types";
import type { Bed } from "@/components/BedGrid/BedGrid.types";

export type AdmissionStatus =
  | "admitted"
  | "transferred"
  | "discharged"
  | "dama"
  | "deceased"
  | "absconded";

export interface Admission {
  id: string;
  visit_id: string;
  patient_id: string;
  ward_id: string;
  bed_id: string;
  admitted_at: string;
  reason?: string | null;
  status: AdmissionStatus;
}

export interface Discharge {
  id: string;
  admission_id: string;
  discharged_at: string;
  discharge_type: "discharged" | "dama" | "deceased" | "absconded" | "transferred";
  discharge_summary: string;
  follow_up_date?: string | null;
}

export async function admitPatient(data: AddAdmissionSchema) {
  return api<Admission>("/admissions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function dischargePatient(data: AddDischargeSchema) {
  return api<Discharge>("/discharges", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getWards() {
  return api<Ward[]>("/wards", { method: "GET" });
}

export async function getBeds() {
  return api<Bed[]>("/beds", { method: "GET" });
}

export async function getActiveAdmissions() {
  return api<Admission[]>("/admissions?status=admitted", { method: "GET" });
}

export async function getDischarges() {
  return api<Discharge[]>("/discharges", { method: "GET" });
}