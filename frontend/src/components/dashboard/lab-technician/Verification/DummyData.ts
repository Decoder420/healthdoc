import type { VerifiedReportData } from "./types";

export const reports: VerifiedReportData[] = [
    {
  patient: {
    patientId: "PAT-10002",
    uhid: "UHID240002",
    name: "Priya Verma",
    age: 29,
    gender: "Female",
    mobile: "9876543211",
  },

  doctor: {
    id: "DOC-002",
    name: "Dr. Rajesh Kumar",
    department: "Internal Medicine",
  },

  sample: {
    sampleId: "LAB-20260722-0002",
    barcode: "LAB-20260722-0002",
    specimen: "Whole Blood",
    collectedAt: "22 Jul 2026, 09:45 AM",
  },

  report: {
    reportNo: "RPT-240002",
    testName: "Complete Blood Count (CBC)",
    verifiedBy: "Dr. Neha Gupta",
    verifiedDate: "22 Jul 2026, 11:45 AM",
    status: "VERIFIED",
  },

  results: [
    {
      testName: "Hemoglobin",
      result: "11.2",
      unit: "g/dL",
      referenceRange: "12.0 - 15.0",
      flag: "LOW",
    },
    {
      testName: "RBC Count",
      result: "4.30",
      unit: "million/µL",
      referenceRange: "4.0 - 5.2",
      flag: "NORMAL",
    },
    {
      testName: "Packed Cell Volume (PCV)",
      result: "35.2",
      unit: "%",
      referenceRange: "36 - 46",
      flag: "LOW",
    },
    {
      testName: "MCV",
      result: "81.8",
      unit: "fL",
      referenceRange: "83 - 101",
      flag: "LOW",
    },
    {
      testName: "MCH",
      result: "26.2",
      unit: "pg",
      referenceRange: "27 - 32",
      flag: "LOW",
    },
    {
      testName: "MCHC",
      result: "32.4",
      unit: "%",
      referenceRange: "32.5 - 34.5",
      flag: "LOW",
    },
    {
      testName: "RDW",
      result: "16.4",
      unit: "%",
      referenceRange: "11.6 - 14.0",
      flag: "HIGH",
    },
    {
      testName: "WBC Count",
      result: "8900",
      unit: "/cumm",
      referenceRange: "4000 - 11000",
      flag: "NORMAL",
    },
    {
      testName: "Neutrophils",
      result: "68",
      unit: "%",
      referenceRange: "40 - 75",
      flag: "NORMAL",
    },
    {
      testName: "Lymphocytes",
      result: "24",
      unit: "%",
      referenceRange: "20 - 45",
      flag: "NORMAL",
    },
    {
      testName: "Eosinophils",
      result: "5",
      unit: "%",
      referenceRange: "1 - 6",
      flag: "NORMAL",
    },
    {
      testName: "Monocytes",
      result: "3",
      unit: "%",
      referenceRange: "2 - 10",
      flag: "NORMAL",
    },
    {
      testName: "Basophils",
      result: "0",
      unit: "%",
      referenceRange: "<2",
      flag: "NORMAL",
    },
    {
      testName: "Platelet Count",
      result: "195000",
      unit: "/cumm",
      referenceRange: "150000 - 410000",
      flag: "NORMAL",
    },
    {
      testName: "ESR",
      result: "42",
      unit: "mm/hr",
      referenceRange: "0 - 20",
      flag: "HIGH",
    },
  ],

  remarks: {
    interpretation:
      "Mild microcytic hypochromic anemia with elevated ESR. Clinical correlation is recommended.",
    comments:
      "Hemoglobin, MCV, MCH and PCV are below the normal range. ESR is elevated.",
    advice:
      "Recommend iron profile, serum ferritin and follow-up CBC after treatment.",
  },
},

{
  patient: {
    patientId: "PAT-10003",
    uhid: "UHID240003",
    name: "Aman Singh",
    age: 45,
    gender: "Male",
    mobile: "9876543212",
  },

  doctor: {
    id: "DOC-003",
    name: "Dr. Vivek Sharma",
    department: "Gastroenterology",
  },

  sample: {
    sampleId: "LAB-20260722-0003",
    barcode: "LAB-20260722-0003",
    specimen: "Serum",
    collectedAt: "22 Jul 2026, 10:15 AM",
  },

  report: {
    reportNo: "RPT-240003",
    testName: "Liver Function Test (LFT)",
    verifiedBy: "Dr. Neha Gupta",
    verifiedDate: "22 Jul 2026, 12:15 PM",
    status: "VERIFIED",
  },

  results: [
    {
      testName: "Total Bilirubin",
      result: "1.1",
      unit: "mg/dL",
      referenceRange: "0.3 - 1.2",
      flag: "NORMAL",
    },
    {
      testName: "Direct Bilirubin",
      result: "0.3",
      unit: "mg/dL",
      referenceRange: "0.0 - 0.3",
      flag: "NORMAL",
    },
    {
      testName: "Indirect Bilirubin",
      result: "0.8",
      unit: "mg/dL",
      referenceRange: "0.2 - 0.9",
      flag: "NORMAL",
    },
    {
      testName: "SGOT (AST)",
      result: "56",
      unit: "U/L",
      referenceRange: "5 - 40",
      flag: "HIGH",
    },
    {
      testName: "SGPT (ALT)",
      result: "72",
      unit: "U/L",
      referenceRange: "7 - 56",
      flag: "HIGH",
    },
    {
      testName: "Alkaline Phosphatase",
      result: "118",
      unit: "U/L",
      referenceRange: "44 - 147",
      flag: "NORMAL",
    },
    {
      testName: "Total Protein",
      result: "7.0",
      unit: "g/dL",
      referenceRange: "6.4 - 8.3",
      flag: "NORMAL",
    },
    {
      testName: "Albumin",
      result: "4.2",
      unit: "g/dL",
      referenceRange: "3.5 - 5.0",
      flag: "NORMAL",
    },
    {
      testName: "Globulin",
      result: "2.8",
      unit: "g/dL",
      referenceRange: "2.0 - 3.5",
      flag: "NORMAL",
    },
    {
      testName: "A/G Ratio",
      result: "1.5",
      unit: "",
      referenceRange: "1.0 - 2.2",
      flag: "NORMAL",
    },
  ],

  remarks: {
    interpretation:
      "Mild elevation of liver transaminases (AST and ALT), suggestive of mild hepatocellular injury.",
    comments:
      "Other liver function parameters including bilirubin, albumin and alkaline phosphatase are within normal limits.",
    advice:
      "Clinical correlation advised. Repeat LFT after 2-4 weeks and consider ultrasound abdomen if clinically indicated.",
  },
},

{
  patient: {
    patientId: "PAT-10004",
    uhid: "UHID240004",
    name: "Neha Sharma",
    age: 37,
    gender: "Female",
    mobile: "9876543213",
  },

  doctor: {
    id: "DOC-004",
    name: "Dr. Pooja Mehta",
    department: "Nephrology",
  },

  sample: {
    sampleId: "LAB-20260722-0004",
    barcode: "LAB-20260722-0004",
    specimen: "Serum",
    collectedAt: "22 Jul 2026, 10:40 AM",
  },

  report: {
    reportNo: "RPT-240004",
    testName: "Kidney Function Test (KFT)",
    verifiedBy: "Dr. Sandeep Mehra",
    verifiedDate: "22 Jul 2026, 12:45 PM",
    status: "VERIFIED",
  },

  results: [
    {
      testName: "Blood Urea",
      result: "34",
      unit: "mg/dL",
      referenceRange: "15 - 45",
      flag: "NORMAL",
    },
    {
      testName: "Serum Creatinine",
      result: "1.6",
      unit: "mg/dL",
      referenceRange: "0.6 - 1.2",
      flag: "HIGH",
    },
    {
      testName: "Uric Acid",
      result: "6.1",
      unit: "mg/dL",
      referenceRange: "2.5 - 6.8",
      flag: "NORMAL",
    },
    {
      testName: "Sodium",
      result: "139",
      unit: "mmol/L",
      referenceRange: "135 - 145",
      flag: "NORMAL",
    },
    {
      testName: "Potassium",
      result: "5.4",
      unit: "mmol/L",
      referenceRange: "3.5 - 5.1",
      flag: "HIGH",
    },
    {
      testName: "Chloride",
      result: "101",
      unit: "mmol/L",
      referenceRange: "98 - 107",
      flag: "NORMAL",
    },
    {
      testName: "Calcium",
      result: "9.4",
      unit: "mg/dL",
      referenceRange: "8.5 - 10.5",
      flag: "NORMAL",
    },
    {
      testName: "Phosphorus",
      result: "3.8",
      unit: "mg/dL",
      referenceRange: "2.5 - 4.5",
      flag: "NORMAL",
    },
    {
      testName: "eGFR",
      result: "58",
      unit: "mL/min/1.73m²",
      referenceRange: ">90",
      flag: "LOW",
    },
  ],

  remarks: {
    interpretation:
      "Serum creatinine and potassium are mildly elevated with reduced estimated GFR.",
    comments:
      "Findings are suggestive of mild renal impairment. Correlate with clinical history and previous renal function tests.",
    advice:
      "Repeat renal function tests after hydration if indicated. Consider nephrology consultation and urine routine examination.",
  },
},

{
  patient: {
    patientId: "PAT-10005",
    uhid: "UHID240005",
    name: "Rohit Kumar",
    age: 52,
    gender: "Male",
    mobile: "9876543214",
  },

  doctor: {
    id: "DOC-005",
    name: "Dr. Ashish Gupta",
    department: "Cardiology",
  },

  sample: {
    sampleId: "LAB-20260722-0005",
    barcode: "LAB-20260722-0005",
    specimen: "Serum",
    collectedAt: "22 Jul 2026, 11:05 AM",
  },

  report: {
    reportNo: "RPT-240005",
    testName: "Lipid Profile",
    verifiedBy: "Dr. Neha Gupta",
    verifiedDate: "22 Jul 2026, 01:15 PM",
    status: "VERIFIED",
  },

  results: [
    {
      testName: "Total Cholesterol",
      result: "245",
      unit: "mg/dL",
      referenceRange: "< 200",
      flag: "HIGH",
    },
    {
      testName: "Triglycerides",
      result: "210",
      unit: "mg/dL",
      referenceRange: "< 150",
      flag: "HIGH",
    },
    {
      testName: "HDL Cholesterol",
      result: "38",
      unit: "mg/dL",
      referenceRange: "> 40",
      flag: "LOW",
    },
    {
      testName: "LDL Cholesterol",
      result: "162",
      unit: "mg/dL",
      referenceRange: "< 100",
      flag: "HIGH",
    },
    {
      testName: "VLDL Cholesterol",
      result: "42",
      unit: "mg/dL",
      referenceRange: "5 - 40",
      flag: "HIGH",
    },
    {
      testName: "Non-HDL Cholesterol",
      result: "207",
      unit: "mg/dL",
      referenceRange: "< 130",
      flag: "HIGH",
    },
    {
      testName: "Total Cholesterol / HDL Ratio",
      result: "6.4",
      unit: "",
      referenceRange: "< 5.0",
      flag: "HIGH",
    },
    {
      testName: "LDL / HDL Ratio",
      result: "4.3",
      unit: "",
      referenceRange: "< 3.5",
      flag: "HIGH",
    },
  ],

  remarks: {
    interpretation:
      "Patient has dyslipidemia with elevated LDL cholesterol, triglycerides and total cholesterol along with reduced HDL cholesterol.",
    comments:
      "Findings indicate increased cardiovascular risk. Lifestyle modification and medical management should be considered.",
    advice:
      "Advise low-fat diet, regular exercise, weight reduction and follow-up lipid profile after 3 months or as advised by the physician.",
  },
},

{
  patient: {
    patientId: "PAT-10006",
    uhid: "UHID240006",
    name: "Sneha Kapoor",
    age: 31,
    gender: "Female",
    mobile: "9876543215",
  },

  doctor: {
    id: "DOC-006",
    name: "Dr. Kavita Sharma",
    department: "Endocrinology",
  },

  sample: {
    sampleId: "LAB-20260722-0006",
    barcode: "LAB-20260722-0006",
    specimen: "Serum",
    collectedAt: "22 Jul 2026, 11:25 AM",
  },

  report: {
    reportNo: "RPT-240006",
    testName: "Thyroid Profile",
    verifiedBy: "Dr. Neha Gupta",
    verifiedDate: "22 Jul 2026, 01:40 PM",
    status: "VERIFIED",
  },

  results: [
    {
      testName: "T3",
      result: "1.18",
      unit: "ng/mL",
      referenceRange: "0.80 - 2.00",
      flag: "NORMAL",
    },
    {
      testName: "T4",
      result: "8.2",
      unit: "µg/dL",
      referenceRange: "5.1 - 14.1",
      flag: "NORMAL",
    },
    {
      testName: "TSH",
      result: "8.45",
      unit: "µIU/mL",
      referenceRange: "0.35 - 5.50",
      flag: "HIGH",
    },
    {
      testName: "Free T3",
      result: "3.2",
      unit: "pg/mL",
      referenceRange: "2.3 - 4.2",
      flag: "NORMAL",
    },
    {
      testName: "Free T4",
      result: "1.1",
      unit: "ng/dL",
      referenceRange: "0.8 - 1.8",
      flag: "NORMAL",
    },
  ],

  remarks: {
    interpretation:
      "Raised TSH with normal Free T3 and Free T4 suggests subclinical hypothyroidism.",
    comments:
      "Recommend correlation with clinical symptoms and previous thyroid function reports.",
    advice:
      "Consult endocrinologist. Repeat thyroid profile after 6-8 weeks if clinically indicated.",
  },
},

]