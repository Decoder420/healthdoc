export interface ReportData {
  status: "DRAFT" | "IN_PROGRESS" | "VERIFIED" | "FINAL";

  laboratory: {
    id: string;
    name: string;
    logo: string;
    nablNumber: string;
    address: string;
    phone: string;
    phoneSecondary?: string;
    email: string;
    website: string;
    tagline?: string;
  };

  patient: {
    patientId: string;
    uhid: string;
    name: string;
    age: number;
    gender: string;
    dob: string;
    mobile: string;
  };

  visit: {
    visitId: string;
    visitType: string;
    encounterNumber: string;
  };

  doctor: {
    doctorId: string;
    name: string;
    qualification: string;
    department: string;
    registrationNumber: string;
    hospital: string;
  };

  order: {
    orderId: string;
    priority: "Routine" | "Urgent" | "Stat";
    orderedAt: string;
  };

  sample: {
    accessionNumber: string;
    sampleId: string;
    barcode: string;
    sampleType: string;
    container: string;
    collectedAt: string;
    collectedAtLocation?: string;
    receivedAt: string;
    processedAt: string;
  };

  reportInfo: {
    reportId: string;
    reportNumber: string;
    title: string;
    category: string;
    method: string;
    instruments?: string;
    reportedAt: string;
    verifiedAt: string;
  };

  testGroups: {
    groupId: string;
    groupName: string;
    results: {
      code: string;
      name: string;
      note?: string;
      result: string;
      unit: string;
      referenceRange: string;
      flag: "NORMAL" | "HIGH" | "LOW" | "BORDERLINE" | "CRITICAL" | "PANIC" | string;
      displayOrder: number;
    }[];
  }[];

  remarks: {
    interpretation: string;
    comments: string;
    advice: string;
  };

  verification: {
    verifiedBy: string;
    qualification: string;
    designation: string;
    registrationNumber: string;
    verifiedAt: string;
    digitalSignature: string;
    digitallySigned: boolean;
  };

  signatories?: {
    name: string;
    qualification: string;
    designation: string;
    signature: string;
  }[];

  footer: {
    disclaimer: string;
    generatedAt: string;
    generatedBy: string;
    version: number;
    printedAt: string;
    whatsapp?: string;
  };

  qrCode: {
    value: string;
  };
}
