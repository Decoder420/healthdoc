export type Gender = "Male" | "Female" | "Other";

export type VisitType =
  | "OPD"
  | "IPD"
  | "Emergency";

export type SampleStatus =
  | "Pending"
  | "Collected"
  | "Received"
  | "Processing"
  | "Completed"
  | "Rejected";

export type Priority =
  | "Routine"
  | "Urgent"
  | "STAT";

export interface Patient {
  patientId: string;
  uhid: string;
  name: string;
  age: number;
  gender: Gender;
  mobile: string;
}

export interface Doctor {
  doctorId: string;
  name: string;
  department: string;
}

export interface Visit {
  visitId: string;
  visitType: VisitType;
  visitDate: string;
}

export interface Sample {
  sampleId: string;
  barcode: string;
  accessionNo: string;
  sampleType: string;
  container: string;
  priority: Priority;
  collectedAt: string;
  collectedBy: string;
  receivedAt: string;
  receivedBy: string;
  status: SampleStatus;
}

export interface LabTest {
  id: string;
  testName: string;
  category: string;
  result: string;
  unit: string;
  referenceRange: string;
  flag: "Normal" | "High" | "Low" | "-";
  remarks: string;
  status: "Pending" | "Completed";
}

export interface ReportInfo {
  interpretation: string;
  remarks: string;
  recommendation: string;
  verifiedBy: string;
  verifiedAt: string;
}

export interface ResultEntryData {
  patient: Patient;
  doctor: Doctor;
  visit: Visit;
  sample: Sample;
  tests: LabTest[];

  reportStatus: ReportStatus;

  report: ReportInfo;
}
export interface PatientSearchOption {
  patientId: string;
  name: string;
  uhid: string;
  barcode: string;
}
export type ReportStatus =
  | "Draft"
  | "Verified"
  | "Completed";