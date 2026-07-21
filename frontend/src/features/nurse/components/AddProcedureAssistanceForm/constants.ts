export const DEFAULT_VALUES = {
  patientId: "",

  procedureName: "",

  procedureCategory: "General",

  doctorName: "",

  assistingNurse: "",

  procedureTime: "",

  status: "Completed",

  equipmentUsed: "",

  consentTaken: "Yes",

  notes: "",

  complications: "",
};

export const PROCEDURE_CATEGORIES = [
  "General",
  "Dressing",
  "Catheterization",
  "Blood Transfusion",
  "ECG",
  "NG Tube",
  "Central Line",
  "Wound Care",
];

export const PROCEDURE_STATUS = [
  "Scheduled",
  "In Progress",
  "Completed",
  "Cancelled",
];

export const CONSENT_OPTIONS = [
  "Yes",
  "No",
];