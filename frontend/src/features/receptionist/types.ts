/**
 * Mirrors the patients API. Field names are the wire's — no mapping layer.
 *
 * Contracts read from backend/app/patients/schemas.py rather than guessed; the
 * eMAR and bed-grid rework earlier in this project came from doing it the other
 * way round.
 */

/** POST /patients — `Idempotency-Key` header is mandatory. */
export interface PatientCreate {
  full_name: string;
  sex: string;
  /** Exactly one of dob / age_years is required by the server. */
  dob?: string | null;
  age_years?: number | null;
  mobile?: string | null;
  abha_number?: string | null;
  aadhaar_number?: string | null;
}

export interface Patient {
  id: string;
  uhid: string | null;
  thid: string | null;
  full_name: string;
  sex: string;
  dob: string | null;
  age_years: number | null;
  mobile: string | null;
  abha_number: string | null;
  identity_path: string;
  identity_status: string;
  photo_file_id: string | null;
  facility_id: string;
  created_at: string;
}

/** POST /patients/search — at least one criterion required. */
export interface PatientSearchRequest {
  full_name?: string;
  dob?: string;
  mobile?: string;
  uhid?: string;
  aadhaar_number?: string;
  abha_number?: string;
  page?: number;
  page_size?: number;
}

export interface PatientSearchResult {
  id: string;
  uhid: string | null;
  full_name: string;
  sex: string;
  age_years: number | null;
  /** The server masks it. Never ask for or display the full number in a list. */
  mobile_masked: string | null;
  match_score: number;
  /** "aadhaar" | "abha" | "uhid" | "mobile" | "name_dob" */
  matched_on: string;
}

export interface PatientSearchResponse {
  items: PatientSearchResult[];
  page: number;
  page_size: number;
  total: number;
}

/**
 * How confident a match is, in words.
 *
 * `matched_on` matters more than the score: an Aadhaar or UHID hit is an
 * identity match, while a name+DOB hit is a guess that happens to score well.
 * A receptionist choosing between two similar names needs to see which kind
 * they are looking at — this is the difference between attaching a visit to the
 * right chart and merging two people's histories.
 */
export const MATCH_LABELS: Record<string, string> = {
  aadhaar: "Aadhaar match",
  abha: "ABHA match",
  uhid: "UHID match",
  mobile: "Mobile match",
  name_dob: "Name + date of birth",
};

export function isIdentityMatch(matchedOn: string): boolean {
  return ["aadhaar", "abha", "uhid"].includes(matchedOn);
}
