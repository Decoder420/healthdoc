export type PatientGender = "male" | "female" | "other";

export type GuardianRelation =
  | "father"
  | "mother"
  | "spouse"
  | "sibling"
  | "guardian"
  | "other";

export type GuardianDetails = {
  name: string;
  relation: GuardianRelation;
  phone: string;
  address: string;
};

export type IdentityDocumentType =
  | "aadhaar"
  | "pan"
  | "passport"
  | "voter_id"
  | "driving_license"
  | "other";

export type IdentityDocument = {
  type: IdentityDocumentType;
  documentNumber: string;
  fileName: string;
  fileData: string;
};

export type Patient = {
  uhid: string;
  name: string;
  age: number;
  gender: PatientGender;
  phone: string;
  alternateMobile: string;
  email: string;
  address: string;
  photo: string;
  aadhaar: string;
  abha: string;
  guardian: GuardianDetails;
  identityDocument: IdentityDocument;
  registeredAt: string;
};

export type NewPatientInput = Omit<Patient, "uhid" | "registeredAt">;

export const emptyGuardianDetails: GuardianDetails = {
  name: "",
  relation: "father",
  phone: "",
  address: "",
};

export const emptyIdentityDocument: IdentityDocument = {
  type: "aadhaar",
  documentNumber: "",
  fileName: "",
  fileData: "",
};

export const emptyPatientForm: NewPatientInput = {
  name: "",
  age: 0,
  gender: "male",
  phone: "",
  alternateMobile: "",
  email: "",
  address: "",
  photo: "",
  aadhaar: "",
  abha: "",
  guardian: { ...emptyGuardianDetails },
  identityDocument: { ...emptyIdentityDocument },
};
