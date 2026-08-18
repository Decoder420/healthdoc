export const DEFAULT_VALUES = {
  patientId: "",

  medicationName: "",

  dosage: "",

  route: "Oral",

  frequency: "Once Daily",

  scheduledTime: "",

  administeredTime: "",

  status: "Administered",

  remarks: "",
};

export const ROUTES = [
  "Oral",
  "IV",
  "IM",
  "SC",
  "Topical",
];

export const FREQUENCIES = [
  "Once Daily",
  "Twice Daily",
  "Three Times Daily",
  "Every 6 Hours",
  "Every 8 Hours",
  "SOS",
];

export const STATUS_OPTIONS = [
  "Administered",
  "Held",
  "Missed",
];