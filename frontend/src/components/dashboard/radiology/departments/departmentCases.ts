import type {
  Priority,
  RadiologyCase,
  RadiologyStatus,
  ReportingTimeData,
  StatusDistributionData,
  TrendChartData,
} from "./dashboard/types";

export type ModalityKey =
  | "CT"
  | "MRI"
  | "XRAY"
  | "USG"
  | "MAMMOGRAPHY"
  | "ECG";

const NAMES = [
  "Rohit Sharma",
  "Neha Gupta",
  "Amit Verma",
  "Priya Singh",
  "Karan Mehta",
  "Ananya Iyer",
  "Vikram Joshi",
  "Sneha Kapoor",
  "Rahul Das",
  "Kavya Nair",
];

const DOCTORS = [
  "Dr. Sharma",
  "Dr. Mehta",
  "Dr. Kapoor",
  "Dr. Nair",
  "Dr. Gupta",
  "Dr. Iyer",
];

const STUDIES: Record<ModalityKey, string[]> = {
  CT: ["CT Brain", "CT Chest", "CT Abdomen", "CT KUB", "CT Angiography"],
  MRI: ["MRI Brain", "MRI Spine", "MRI Knee", "MRI Shoulder", "MRI Pelvis"],
  XRAY: ["Chest PA", "Knee AP/Lat", "Spine LS", "PNS", "Hand AP"],
  USG: ["USG Abdomen", "USG Pelvis", "Obstetric USG", "Thyroid USG", "Doppler"],
  MAMMOGRAPHY: ["Bilateral Mammogram", "Screening Mammo", "Diagnostic Mammo"],
  ECG: ["12-Lead ECG", "Stress ECG", "Rhythm Strip"],
};

const STATUSES: RadiologyStatus[] = ["PROCESSING", "VERIFIED"];
const PRIORITIES: Priority[] = ["Routine", "Urgent", "STAT"];

function buildCases(modality: ModalityKey, count: number): RadiologyCase[] {
  const prefix =
    modality === "XRAY"
      ? "XR"
      : modality === "MAMMOGRAPHY"
        ? "MAM"
        : modality;

  return Array.from({ length: count }, (_, index) => {
    const idNum = index + 1;
    const day = 20 + (index % 10);
    return {
      id: `${prefix}${String(idNum).padStart(3, "0")}`,
      patientName: NAMES[index % NAMES.length],
      uhid: `UH${20000 + index + modality.length * 100}`,
      accessionNo: `ACC-${prefix}-${String(idNum).padStart(3, "0")}`,
      study: STUDIES[modality][index % STUDIES[modality].length],
      modality,
      doctor: DOCTORS[index % DOCTORS.length],
      priority: PRIORITIES[index % PRIORITIES.length],
      status: STATUSES[index % STATUSES.length],
      studyDate: `2026-07-${String(day).padStart(2, "0")}`,
    };
  });
}

export const CT_CASES = buildCases("CT", 48);
export const MRI_CASES = buildCases("MRI", 48);
export const XRAY_CASES = buildCases("XRAY", 48);
export const USG_CASES = buildCases("USG", 48);
export const MAMMO_CASES = buildCases("MAMMOGRAPHY", 36);
export const ECG_CASES = buildCases("ECG", 36);

export function getDepartmentStats(rows: RadiologyCase[]) {
  const processing = rows.filter((r) => r.status === "PROCESSING").length;
  const verified = rows.filter((r) => r.status === "VERIFIED").length;
  return [
    { title: "Total Cases", text: rows.length },
    { title: "Processing", text: processing },
    { title: "Verified", text: verified },
    {
      title: "Average Reporting",
      text: `${18 + (rows.length % 10)} min`,
    },
  ];
}

export function getDepartmentTrend(rows: RadiologyCase[]): TrendChartData[] {
  const labels = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
  return labels.map((label, index) => ({
    label,
    value: Math.max(2, Math.round(rows.length / 8) + index * 2),
  }));
}

export function getDepartmentStatus(
  rows: RadiologyCase[],
): StatusDistributionData[] {
  return [
    {
      name: "Processing",
      value: rows.filter((r) => r.status === "PROCESSING").length,
    },
    {
      name: "Verified",
      value: rows.filter((r) => r.status === "VERIFIED").length,
    },
  ];
}

export function getDepartmentReporting(): ReportingTimeData[] {
  return [
    { day: "Mon", minutes: 24 },
    { day: "Tue", minutes: 22 },
    { day: "Wed", minutes: 26 },
    { day: "Thu", minutes: 21 },
    { day: "Fri", minutes: 20 },
    { day: "Sat", minutes: 23 },
    { day: "Sun", minutes: 19 },
  ];
}

export const ALL_DEPARTMENT_CASES = [
  ...CT_CASES,
  ...MRI_CASES,
  ...XRAY_CASES,
  ...USG_CASES,
  ...MAMMO_CASES,
  ...ECG_CASES,
];
