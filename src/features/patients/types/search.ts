export type PatientSearchType = "uhid" | "aadhaar" | "abha" | "mobile";

export const PATIENT_SEARCH_OPTIONS: {
  value: PatientSearchType;
  label: string;
  placeholder: string;
  helper: string;
}[] = [
  {
    value: "uhid",
    label: "UHID",
    placeholder: "e.g. UHID202500142 or 202500142",
    helper: "Search by hospital Unique Health ID",
  },
  {
    value: "aadhaar",
    label: "Aadhaar Number",
    placeholder: "XXXX XXXX XXXX",
    helper: "Enter 12-digit Aadhaar number",
  },
  {
    value: "abha",
    label: "ABHA Number",
    placeholder: "XX-XXXX-XXXX-XXXX",
    helper: "Enter 14-digit ABHA ID",
  },
  {
    value: "mobile",
    label: "Mobile Number",
    placeholder: "+91 XXXXX XXXXX",
    helper: "Enter 10-digit mobile number",
  },
];
