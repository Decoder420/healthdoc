import type { VerifiedReportData } from "./types";

const NAMES = [
  "Priya Verma",
  "Rahul Sharma",
  "Amit Patel",
  "Sneha Kapoor",
  "Vikram Singh",
  "Ananya Iyer",
  "Karan Mehta",
  "Neha Gupta",
  "Rohit Das",
  "Kavya Nair",
];

const TESTS = [
  "Complete Blood Count (CBC)",
  "Liver Function Test (LFT)",
  "Kidney Function Test (RFT)",
  "Lipid Profile",
  "Thyroid Profile",
  "Blood Sugar Fasting",
  "HbA1c",
  "Urine Routine",
];

const RESULT_SETS: VerifiedReportData["results"][] = [
  [
    {
      testName: "Hemoglobin",
      result: "11.2",
      unit: "g/dL",
      referenceRange: "12.0 - 15.0",
      flag: "LOW",
    },
    {
      testName: "WBC Count",
      result: "8900",
      unit: "/cumm",
      referenceRange: "4000 - 11000",
      flag: "NORMAL",
    },
    {
      testName: "Platelet Count",
      result: "2.1",
      unit: "lakh/cumm",
      referenceRange: "1.5 - 4.5",
      flag: "NORMAL",
    },
  ],
  [
    {
      testName: "SGPT (ALT)",
      result: "68",
      unit: "U/L",
      referenceRange: "7 - 56",
      flag: "HIGH",
    },
    {
      testName: "SGOT (AST)",
      result: "52",
      unit: "U/L",
      referenceRange: "10 - 40",
      flag: "HIGH",
    },
    {
      testName: "Bilirubin Total",
      result: "0.9",
      unit: "mg/dL",
      referenceRange: "0.1 - 1.2",
      flag: "NORMAL",
    },
  ],
  [
    {
      testName: "Creatinine",
      result: "1.8",
      unit: "mg/dL",
      referenceRange: "0.6 - 1.3",
      flag: "HIGH",
    },
    {
      testName: "Urea",
      result: "54",
      unit: "mg/dL",
      referenceRange: "15 - 40",
      flag: "HIGH",
    },
    {
      testName: "Uric Acid",
      result: "7.8",
      unit: "mg/dL",
      referenceRange: "3.5 - 7.2",
      flag: "HIGH",
    },
  ],
];

function buildReport(index: number): VerifiedReportData {
  const day = 18 + (index % 12);
  const testName = TESTS[index % TESTS.length];
  const results = RESULT_SETS[index % RESULT_SETS.length];
  const hasCritical = results.some((r) => r.flag === "CRITICAL" || r.flag === "HIGH");

  return {
    patient: {
      patientId: `PAT-${10002 + index}`,
      uhid: `UHID${240002 + index}`,
      name: NAMES[index % NAMES.length],
      age: 21 + ((index * 4) % 55),
      gender: index % 2 === 0 ? "Female" : "Male",
      mobile: `98${String(76543211 + index).slice(0, 8)}`,
    },
    doctor: {
      id: `DOC-${String(index % 8).padStart(3, "0")}`,
      name: [
        "Dr. Rajesh Kumar",
        "Dr. Amit Verma",
        "Dr. Sonal Iyer",
        "Dr. Neha Gupta",
      ][index % 4],
      department: [
        "Internal Medicine",
        "Cardiology",
        "Nephrology",
        "Endocrinology",
      ][index % 4],
    },
    sample: {
      sampleId: `LAB-202607${String(day).padStart(2, "0")}-${String(index + 2).padStart(4, "0")}`,
      barcode: `LAB-202607${String(day).padStart(2, "0")}-${String(index + 2).padStart(4, "0")}`,
      specimen: index % 3 === 0 ? "Serum" : "Whole Blood",
      collectedAt: `${day} Jul 2026, 0${8 + (index % 2)}:${String((index * 7) % 60).padStart(2, "0")} AM`,
    },
    report: {
      reportNo: `RPT-${240002 + index}`,
      testName,
      verifiedBy: "Dr. Neha Gupta",
      verifiedDate: `${day} Jul 2026, 11:${String((index * 5) % 60).padStart(2, "0")} AM`,
      status: "VERIFIED",
    },
    results,
    remarks: {
      interpretation: hasCritical
        ? `${testName} shows abnormal values requiring clinical correlation.`
        : `${testName} reviewed and within acceptable clinical context.`,
      comments: index % 3 === 0 ? "Repeat advised if clinically indicated." : "",
      advice: hasCritical
        ? "Urgent clinical review recommended."
        : "Continue routine follow-up.",
    },
  };
}

/** Heavy verified-report catalog for verification + report viewer/PDF. */
export const reports: VerifiedReportData[] = Array.from(
  { length: 72 },
  (_, index) => buildReport(index),
);
