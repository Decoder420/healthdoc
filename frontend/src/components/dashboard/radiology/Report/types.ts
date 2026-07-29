
export interface RadiologyReport {
  id: string;

  hospital: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
  };

  report: {
    reportNo: string;
    accessionNo: string;
    status: string;
    studyDate: string;
    reportDate: string;
  };

  patient: {
    uhid: string;
    name: string;
    age: number;
    gender: string;
    dob?: string;
    mobile?: string;
    address?: string;
  };

  doctor: {
    name: string;
    department?: string;
  };

  visit?: {
    type?: string;
    visitNo?: string;
  };

  study: {
    accessionNo: string;
    studyId: string;
    studyName: string;
    modality:
      | "X-Ray"
      | "CT"
      | "MRI"
      | "Ultrasound"
      | "Mammography"
      | "PET-CT";
    bodyPart: string;
    studyDate: string;
    studyTime: string;
    priority: "Routine" | "Urgent" | "Stat";
    technician: string;
    machine: string;
    contrast?: string;
  };

  clinicalHistory: string;

  images: {
    id: string;
    url: string;
    title?: string;
  }[];

  findings: string;

  impression: string;

  radiologist: {
    name: string;
    qualification: string;
    designation: string;
    registrationNo: string;
    signature?: string;
    verifiedOn: string;
  };

  generatedOn: string;
}