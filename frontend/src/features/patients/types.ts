/** Mirrors backend `PatientSearchRequest` / `PatientSearchResult` (POST /patients/search). */

export type PatientSearchField = "uhid" | "mobile" | "full_name" | "abha_number";

export type PatientMatchOn = "aadhaar" | "abha" | "uhid" | "mobile" | "name_dob";

export interface PatientSearchQuery {
  field: PatientSearchField;
  value: string;
  page?: number;
  pageSize?: number;
}

export interface PatientSearchResult {
  id: string;
  uhid: string | null;
  full_name: string;
  sex: string;
  age_years: number | null;
  mobile_masked: string | null;
  match_score: number;
  matched_on: PatientMatchOn | string;
}

export interface PatientSearchResponse {
  items: PatientSearchResult[];
  page: number;
  page_size: number;
  total: number;
}
