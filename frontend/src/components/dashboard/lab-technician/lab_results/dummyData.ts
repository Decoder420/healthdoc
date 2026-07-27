import { ResultEntryData } from "./types";

export const dummyPatients: ResultEntryData[] = [
  {
    patient: {
      patientId: "PAT-10001",
      uhid: "UHID240001",
      name: "Rahul Sharma",
      age: 34,
      gender: "Male",
      mobile: "9876543210",
    },

    doctor: {
      doctorId: "DOC-101",
      name: "Dr. Amit Verma",
      department: "General Medicine",
    },

    visit: {
      visitId: "VIS-10001",
      visitType: "OPD",
      visitDate: "2026-07-21",
    },

    sample: {
      sampleId: "SMP-10001",
      barcode: "LAB-20260721-0001",
      accessionNo: "ACC-240001",
      sampleType: "Whole Blood",
      container: "EDTA Tube",
      priority: "Routine",
      collectedAt: "21 Jul 2026 09:15 AM",
      collectedBy: "Nurse Anita",
      receivedAt: "21 Jul 2026 09:30 AM",
      receivedBy: "Lab Technician Ravi",
      status: "Received",
    },

    tests: [
      {
        id: "1",
        category: "CBC",
        testName: "Hemoglobin",
        result: "13.8",
        unit: "g/dL",
        referenceRange: "13-17",
        flag: "Normal",
        remarks: "",
        status: "Completed",
      },
      {
        id: "2",
        category: "CBC",
        testName: "WBC Count",
        result: "8.4",
        unit: "10³/uL",
        referenceRange: "4-11",
        flag: "Normal",
        remarks: "",
        status: "Completed",
      },
      {
        id: "3",
        category: "CBC",
        testName: "Platelet Count",
        result: "250",
        unit: "10³/uL",
        referenceRange: "150-450",
        flag: "Normal",
        remarks: "",
        status: "Completed",
      },
    ],

    reportStatus: "Draft",


    report: {
      interpretation: "CBC parameters are within normal limits.",
      remarks: "No abnormal findings.",
      recommendation: "Routine follow-up.",
      verifiedBy: "Dr. Meena Kapoor",
      verifiedAt: "21 Jul 2026 12:30 PM",
    },
  },

  {
    patient: {
      patientId: "PAT-10002",
      uhid: "UHID240002",
      name: "Priya Singh",
      age: 27,
      gender: "Female",
      mobile: "9876501234",
    },

    doctor: {
      doctorId: "DOC-102",
      name: "Dr. Neha Gupta",
      department: "Gynecology",
    },

    visit: {
      visitId: "VIS-10002",
      visitType: "IPD",
      visitDate: "2026-07-21",
    },

    sample: {
      sampleId: "SMP-10002",
      barcode: "LAB-20260721-0002",
      accessionNo: "ACC-240002",
      sampleType: "Serum",
      container: "Plain Tube",
      priority: "Urgent",
      collectedAt: "21 Jul 2026 10:00 AM",
      collectedBy: "Nurse Pooja",
      receivedAt: "21 Jul 2026 10:15 AM",
      receivedBy: "Lab Technician Ravi",
      status: "Processing",
    },

    tests: [
      {
        id: "1",
        category: "Biochemistry",
        testName: "Blood Glucose",
        result: "98",
        unit: "mg/dL",
        referenceRange: "70-100",
        flag: "Normal",
        remarks: "",
        status: "Completed",
      },
      {
        id: "2",
        category: "Biochemistry",
        testName: "Creatinine",
        result: "0.9",
        unit: "mg/dL",
        referenceRange: "0.6-1.2",
        flag: "Normal",
        remarks: "",
        status: "Completed",
      },
      {
        id: "3",
        category: "Biochemistry",
        testName: "Urea",
        result: "26",
        unit: "mg/dL",
        referenceRange: "15-40",
        flag: "Normal",
        remarks: "",
        status: "Completed",
      },
    ],

    reportStatus: "Draft",


    report: {
      interpretation: "Renal function appears normal.",
      remarks: "Clinical correlation advised.",
      recommendation: "Continue current treatment.",
      verifiedBy: "Dr. Meena Kapoor",
      verifiedAt: "21 Jul 2026 01:10 PM",
    },
  },

  {
    patient: {
      patientId: "PAT-10003",
      uhid: "UHID240003",
      name: "Amit Kumar",
      age: 54,
      gender: "Male",
      mobile: "9811122233",
    },

    doctor: {
      doctorId: "DOC-103",
      name: "Dr. Rajesh Mehta",
      department: "Cardiology",
    },

    visit: {
      visitId: "VIS-10003",
      visitType: "Emergency",
      visitDate: "2026-07-21",
    },

    sample: {
      sampleId: "SMP-10003",
      barcode: "LAB-20260721-0003",
      accessionNo: "ACC-240003",
      sampleType: "Whole Blood",
      container: "EDTA Tube",
      priority: "STAT",
      collectedAt: "21 Jul 2026 11:05 AM",
      collectedBy: "Nurse Ritu",
      receivedAt: "21 Jul 2026 11:12 AM",
      receivedBy: "Lab Technician Mohit",
      status: "Completed",
    },

    tests: [
      {
        id: "1",
        category: "CBC",
        testName: "Hemoglobin",
        result: "10.8",
        unit: "g/dL",
        referenceRange: "13-17",
        flag: "Low",
        remarks: "Suggest Iron Profile",
        status: "Completed",
      },
      {
        id: "2",
        category: "CBC",
        testName: "WBC Count",
        result: "14.6",
        unit: "10³/uL",
        referenceRange: "4-11",
        flag: "High",
        remarks: "Possible infection",
        status: "Completed",
      },
      {
        id: "3",
        category: "CBC",
        testName: "Platelet Count",
        result: "178",
        unit: "10³/uL",
        referenceRange: "150-450",
        flag: "Normal",
        remarks: "",
        status: "Completed",
      },
    ],

    reportStatus: "Draft",


    report: {
      interpretation: "Mild anemia with leukocytosis.",
      remarks: "Further clinical evaluation recommended.",
      recommendation: "Repeat CBC after treatment.",
      verifiedBy: "Dr. Arvind Singh",
      verifiedAt: "21 Jul 2026 02:20 PM",
    },
  },
];

export default dummyPatients;