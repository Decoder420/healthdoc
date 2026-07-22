export type ReportStatus = "VERIFIED";

export interface Patient {
  patientId: string;
  uhid: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  mobile: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
}

export interface Sample {
  sampleId: string;
  barcode: string;
  specimen: string;
  collectedAt: string;
}

export interface Report {
  reportNo: string;
  testName: string;
  verifiedBy: string;
  verifiedDate: string;
  status: ReportStatus;
}

export interface VerifiedReportData {
  patient: {
    patientId: string;
    uhid: string;
    name: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    mobile: string;
  };

  doctor: {
    id: string;
    name: string;
    department: string;
  };

  sample: {
    sampleId: string;
    barcode: string;
    specimen: string;
    collectedAt: string;
  };

  report: {
    reportNo: string;
    testName: string;
    verifiedBy: string;
    verifiedDate: string;
    status: ReportStatus;
  };

  results: LabResult[];

  remarks: {
    interpretation: string;
    comments: string;
    advice: string;
  };
}

export interface LabResult {
  testName: string;
  result: string;
  unit: string;
  referenceRange: string;
  flag: "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
}