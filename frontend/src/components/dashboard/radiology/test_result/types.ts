export type RadiologyStatus =
  | "Queue"
  | "Processing"
  | "No Show"
  | "Removed"
  | "Verified";


export interface PatientSearchOption {
  id: string;

  patientName: string;

  uhid: string;

  accessionNumber: string;

  orderId: string;

  status: RadiologyStatus;
}


export interface PatientDetails {
  patientName: string;

  uhid: string;

  patientId: string;

  visitId: string;

  token: string;

  age: number;

  gender: "Male" | "Female";

  priority: "Routine" | "Urgent" | "Emergency";
}


export interface StudyDetails {
  modality:
    | "CT"
    | "MRI"
    | "X-Ray"
    | "USG"
    | "Mammography"
    | "ECG";


  procedure: string;


  radiologist: string;


  referringDoctor: string;


  accessionNumber: string;


  orderId: string;


  appointmentDate: string;


  appointmentTime: string;


  studyStatus: RadiologyStatus;
}


export interface RadiologyImage {
  id: number;

  imageUrl: string;

  thumbnailUrl: string;
}


export interface ReportData {
  findings: string;

  impression: string;

  recommendation: string;
}


export interface RadiologyReportPatient {

  id: number;


  orderId: string;


  accessionNumber: string;


  patientId: string;


  visitId: string;


  token: string;


  patientName: string;


  uhid: string;


  age: number;


  gender: "Male" | "Female";


  modality:
    | "CT"
    | "MRI"
    | "X-Ray"
    | "USG"
    | "Mammography"
    | "ECG";


  procedure: string;


  radiologist: string;


  referringDoctor: string;


  appointmentDate: string;


  appointmentTime: string;


  priority:
    | "Routine"
    | "Urgent"
    | "Emergency";


  studyStatus: RadiologyStatus;


  images: RadiologyImage[];


  report: ReportData;
}