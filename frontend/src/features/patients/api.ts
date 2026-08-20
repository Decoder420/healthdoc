import { api } from "@/lib/api";
import type { PatientSearchQuery, PatientSearchResponse } from "./types";

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function normalizeUhid(value: string): string {
  return value.trim().toUpperCase().replace(/[\s\-_/]/g, "");
}

/** Build the POST /patients/search body. Never send Aadhaar from this UI. */
export function toSearchBody(query: PatientSearchQuery): Record<string, string | number> {
  const raw = query.value.trim();
  const page = query.page ?? 1;
  const page_size = query.pageSize ?? 20;

  switch (query.field) {
    case "uhid":
      return { uhid: normalizeUhid(raw), page, page_size };
    case "mobile":
      return { mobile: digitsOnly(raw), page, page_size };
    case "abha_number":
      return { abha_number: digitsOnly(raw), page, page_size };
    default:
      return { full_name: raw, page, page_size };
  }
}

export function searchPatients(query: PatientSearchQuery): Promise<PatientSearchResponse> {
  return api<PatientSearchResponse>("/patients/search", {
    method: "POST",
    body: JSON.stringify(toSearchBody(query)),
  });
}
