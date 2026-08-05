// types.ts

export interface RadiologyReport {

  id: number;


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

    status:
      | "DRAFT"
      | "VERIFIED"
      | "COMPLETED"
      | string;

    studyDate: string;

    reportDate: string;

  };



  patient: {

    uhid: string;

    name: string;

    age: number;

    gender:
      | "Male"
      | "Female";

    dob?: string;

    mobile?: string;

    address?: string;

  };



  doctor: {

    name: string;

    department?: string;

  };



  visit?: {

    type?:
      | "OPD"
      | "IPD"
      | "Emergency"
      | string;

    visitNo?: string;

  };



  study: {

    accessionNo: string;


    // DICOM Study UID / PACS Study ID
    studyId: string;


    studyName: string;



    modality:
      | "X-Ray"
      | "CT"
      | "MRI"
      | "Ultrasound"
      | "Mammography"
      | "PET-CT"
      | "ECG";



    bodyPart: string;



    studyDate: string;



    studyTime: string;



    priority:
      | "Routine"
      | "Urgent"
      | "Stat";



    technician: string;



    machine: string;



    contrast?:
      | "Yes"
      | "No";

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