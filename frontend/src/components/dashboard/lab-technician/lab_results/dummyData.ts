import type { ResultEntryData } from "./types";

const NAMES = [
  "Rahul Sharma",
  "Priya Verma",
  "Amit Patel",
  "Sneha Kapoor",
  "Vikram Singh",
  "Ananya Iyer",
  "Karan Mehta",
  "Neha Gupta",
  "Rohit Das",
  "Kavya Nair",
  "Suresh Reddy",
  "Divya Bose",
];

const DOCTORS = [
  ["DOC-101", "Dr. Amit Verma", "General Medicine"],
  ["DOC-102", "Dr. Rajesh Kumar", "Cardiology"],
  ["DOC-103", "Dr. Neha Gupta", "Endocrinology"],
  ["DOC-104", "Dr. Sonal Iyer", "Nephrology"],
] as const;

const PANELS: Array<{
  category: string;
  tests: Array<{
    testName: string;
    unit: string;
    referenceRange: string;
    normal: string;
    high?: string;
    low?: string;
  }>;
}> = [
  {
    category: "CBC",
    tests: [
      {
        testName: "Hemoglobin",
        unit: "g/dL",
        referenceRange: "13-17",
        normal: "13.8",
        low: "10.2",
        high: "18.1",
      },
      {
        testName: "WBC Count",
        unit: "10³/uL",
        referenceRange: "4-11",
        normal: "8.4",
        high: "14.2",
      },
      {
        testName: "Platelet Count",
        unit: "10³/uL",
        referenceRange: "150-450",
        normal: "250",
        low: "95",
      },
    ],
  },
  {
    category: "LFT",
    tests: [
      {
        testName: "SGPT (ALT)",
        unit: "U/L",
        referenceRange: "7-56",
        normal: "28",
        high: "92",
      },
      {
        testName: "SGOT (AST)",
        unit: "U/L",
        referenceRange: "10-40",
        normal: "24",
        high: "78",
      },
      {
        testName: "Bilirubin Total",
        unit: "mg/dL",
        referenceRange: "0.1-1.2",
        normal: "0.7",
        high: "2.4",
      },
    ],
  },
  {
    category: "RFT",
    tests: [
      {
        testName: "Creatinine",
        unit: "mg/dL",
        referenceRange: "0.6-1.3",
        normal: "0.9",
        high: "2.1",
      },
      {
        testName: "Urea",
        unit: "mg/dL",
        referenceRange: "15-40",
        normal: "28",
        high: "68",
      },
    ],
  },
];

function buildResultEntry(index: number): ResultEntryData {
  const panel = PANELS[index % PANELS.length];
  const doctor = DOCTORS[index % DOCTORS.length];
  const priorities = ["Routine", "Urgent", "STAT"] as const;
  const sampleStatuses = [
    "Received",
    "Processing",
    "Completed",
    "Pending",
  ] as const;
  const reportStatuses = ["Draft", "Verified", "Completed"] as const;
  const priority = priorities[index % priorities.length];
  const sampleStatus = sampleStatuses[index % sampleStatuses.length];
  const reportStatus = reportStatuses[index % reportStatuses.length];
  const day = 20 + (index % 10);

  const tests = panel.tests.map((test, testIndex) => {
    const mode = index % 4;
    const value =
      mode === 1 && test.high
        ? test.high
        : mode === 2 && test.low
          ? test.low
          : test.normal;
    const flag =
      mode === 1 && test.high
        ? "High"
        : mode === 2 && test.low
          ? "Low"
          : "Normal";

    return {
      id: String(testIndex + 1),
      category: panel.category,
      testName: test.testName,
      result: sampleStatus === "Pending" ? "" : value,
      unit: test.unit,
      referenceRange: test.referenceRange,
      flag: sampleStatus === "Pending" ? ("-" as const) : (flag as "Normal" | "High" | "Low"),
      remarks: "",
      status:
        sampleStatus === "Pending"
          ? ("Pending" as const)
          : ("Completed" as const),
    };
  });

  return {
    patient: {
      patientId: `PAT-${10001 + index}`,
      uhid: `UHID${240001 + index}`,
      name: NAMES[index % NAMES.length],
      age: 22 + ((index * 3) % 50),
      gender: index % 2 === 0 ? "Male" : "Female",
      mobile: `98${String(76543210 + index).slice(0, 8)}`,
    },
    doctor: {
      doctorId: doctor[0],
      name: doctor[1],
      department: doctor[2],
    },
    visit: {
      visitId: `VIS-${10001 + index}`,
      visitType: index % 5 === 0 ? "Emergency" : index % 3 === 0 ? "IPD" : "OPD",
      visitDate: `2026-07-${String(day).padStart(2, "0")}`,
    },
    sample: {
      sampleId: `SMP-${10001 + index}`,
      barcode: `LAB-202607${String(day).padStart(2, "0")}-${String(index + 1).padStart(4, "0")}`,
      accessionNo: `ACC-${240001 + index}`,
      sampleType: "Whole Blood",
      container: "EDTA Tube",
      priority,
      collectedAt: `${day} Jul 2026 09:${String((index * 3) % 60).padStart(2, "0")} AM`,
      collectedBy: ["Nurse Anita", "Nurse Prerna", "Tech Ravi"][index % 3],
      receivedAt: `${day} Jul 2026 09:${String(15 + (index % 40)).padStart(2, "0")} AM`,
      receivedBy: ["Lab Technician Ravi", "Lab Technician Sohan"][index % 2],
      status: sampleStatus,
    },
    tests,
    reportStatus,
    report: {
      interpretation:
        reportStatus === "Draft"
          ? "Awaiting pathologist review."
          : `${panel.category} parameters reviewed.`,
      remarks: modeRemarks(index),
      recommendation:
        reportStatus === "Completed"
          ? "Correlate clinically. Repeat if indicated."
          : "",
      verifiedBy: reportStatus === "Draft" ? "" : "Dr. Neha Gupta",
      verifiedAt:
        reportStatus === "Draft"
          ? ""
          : `${day} Jul 2026 11:${String((index * 5) % 60).padStart(2, "0")} AM`,
    },
  };
}

function modeRemarks(index: number) {
  if (index % 4 === 1) return "Mild elevation noted.";
  if (index % 4 === 2) return "Values below reference range.";
  return "No critical alerts.";
}

/** Heavy result-entry dataset for lab results workflows. */
export const dummyPatients: ResultEntryData[] = Array.from(
  { length: 72 },
  (_, index) => buildResultEntry(index),
);

export default dummyPatients;
