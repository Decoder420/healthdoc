type LabStatus = "QUEUE" | "COLLECTED" | "IN_PROCESS" | "VERIFIED" | "COMPLETED" | "REJECTED";
type LabPriority = "elective" | "urgent" | "emergency";
type VisitType = "OPD" | "IPD" | "Emergency";

export type LabPatientOrder = {
  status: LabStatus;
  patient: {
    patientId: string;
    uhid: string;
    name: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    mobile: string;
  };
  visit: {
    visitId: string;
    visitType: VisitType;
  };
  doctor: {
    doctorId: string;
    name: string;
    department: string;
  };
  order: {
    orderId: string;
    priority: LabPriority;
    orderedAt: string;
  };
  sample: {
    sampleId: string;
    barcode: string;
    sampleType: string;
    container: string;
    collectedAt: string;
    collectedBy: string;
  };
  requestedTests: string[];
  results: unknown[];
};

const FIRST_NAMES = [
  "Anjali", "Rohit", "Meena", "Vikram", "Sneha", "Amit", "Priya", "Karan",
  "Neha", "Rahul", "Pooja", "Suresh", "Kavya", "Arjun", "Divya", "Manish",
  "Isha", "Nikhil", "Ritu", "Sanjay", "Ananya", "Deepak", "Tanvi", "Harsh",
];

const LAST_NAMES = [
  "Mehra", "Jain", "Patel", "Sharma", "Kapoor", "Nair", "Verma", "Singh",
  "Gupta", "Reddy", "Iyer", "Das", "Kulkarni", "Malhotra", "Bose", "Chawla",
];

const DOCTORS = [
  ["DOC101", "Dr. Vivek Sharma", "General Medicine"],
  ["DOC102", "Dr. Aarti Kapoor", "Cardiology"],
  ["DOC103", "Dr. Rajesh Nair", "Endocrinology"],
  ["DOC104", "Dr. Neha Gupta", "Nephrology"],
  ["DOC105", "Dr. Kunal Mehra", "Orthopedics"],
  ["DOC106", "Dr. Sonal Iyer", "Neurology"],
  ["DOC107", "Dr. Amit Verma", "Gastroenterology"],
  ["DOC108", "Dr. Priya Desai", "Pulmonology"],
] as const;

const TEST_PANELS = [
  ["CBC", "ESR"],
  ["CBC", "Vitamin D"],
  ["Troponin I", "CK-MB", "D-Dimer"],
  ["LFT", "RFT"],
  ["HbA1c", "Fasting Blood Sugar", "Thyroid Profile"],
  ["Lipid Profile", "Blood Sugar"],
  ["Urine Routine", "Urine Culture"],
  ["Blood Culture", "CRP"],
  ["PT/INR", "APTT"],
  ["Electrolytes", "Calcium", "Magnesium"],
  ["Widal", "Dengue NS1"],
  ["HIV", "HBsAg", "HCV"],
];

const STATUSES: LabStatus[] = [
  "QUEUE",
  "QUEUE",
  "QUEUE",
  "COLLECTED",
  "COLLECTED",
  "IN_PROCESS",
  "IN_PROCESS",
  "VERIFIED",
  "COMPLETED",
  "REJECTED",
];

const PRIORITIES: LabPriority[] = [
  "elective",
  "elective",
  "elective",
  "urgent",
  "urgent",
  "emergency",
];

const VISIT_TYPES: VisitType[] = ["OPD", "OPD", "IPD", "Emergency"];

const SAMPLE_TYPES = [
  ["Whole Blood", "EDTA Tube"],
  ["Serum", "Plain Tube"],
  ["Plasma", "Citrate Tube"],
  ["Urine", "Sterile Container"],
  ["Stool", "Stool Container"],
];

function pad(n: number, width = 3) {
  return String(n).padStart(width, "0");
}

function dateAtOffset(dayOffset: number, hour: number, minute: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function makeOrder(
  patientIndex: number,
  orderIndex: number,
  dayOffset: number,
  statusOverride?: LabStatus,
): LabPatientOrder {
  const patientNum = patientIndex + 1;
  const orderNum = orderIndex + 1;
  const first = FIRST_NAMES[patientIndex % FIRST_NAMES.length];
  const last = LAST_NAMES[(patientIndex * 3) % LAST_NAMES.length];
  const doctor = DOCTORS[orderIndex % DOCTORS.length];
  const status = statusOverride ?? STATUSES[orderIndex % STATUSES.length];
  const priority = PRIORITIES[orderIndex % PRIORITIES.length];
  const visitType = VISIT_TYPES[orderIndex % VISIT_TYPES.length];
  const tests = TEST_PANELS[orderIndex % TEST_PANELS.length];
  const [sampleType, container] = SAMPLE_TYPES[orderIndex % SAMPLE_TYPES.length];
  const hour = 8 + (orderIndex % 9);
  const minute = (orderIndex * 7) % 60;
  const orderedAt = dateAtOffset(dayOffset, hour, minute);
  const collected =
    status === "QUEUE"
      ? {
          sampleId: "",
          barcode: "",
          sampleType: "",
          container: "",
          collectedAt: "",
          collectedBy: "",
        }
      : {
          sampleId: `SMP-${pad(orderNum, 4)}`,
          barcode: `LAB-${orderedAt.slice(0, 10).replace(/-/g, "")}-${pad(orderNum, 4)}`,
          sampleType,
          container,
          collectedAt: dateAtOffset(dayOffset, hour, minute + 15),
          collectedBy: ["Nurse Anita", "Tech Ravi", "Nurse Meera", "Tech Sohan"][
            orderIndex % 4
          ],
        };

  return {
    status,
    patient: {
      patientId: `P${pad(patientNum, 3)}`,
      uhid: `UHID${pad(patientNum, 6)}`,
      name: `${first} ${last}`,
      age: 18 + ((patientIndex * 5) % 60),
      gender:
        patientIndex % 5 === 0
          ? "Other"
          : patientIndex % 2 === 0
            ? "Female"
            : "Male",
      mobile: `98${String(70000000 + patientIndex).slice(0, 8)}`,
    },
    visit: {
      visitId: `VIS${pad(orderNum, 3)}`,
      visitType,
    },
    doctor: {
      doctorId: doctor[0],
      name: doctor[1],
      department: doctor[2],
    },
    order: {
      orderId: `ORD${pad(orderNum, 3)}`,
      priority,
      orderedAt,
    },
    sample: collected,
    requestedTests: [...tests],
    results: [],
  };
}

function buildPatients(primaryCount: number): LabPatientOrder[] {
  const list: LabPatientOrder[] = [];
  let orderIndex = 0;

  for (let patientIndex = 0; patientIndex < primaryCount; patientIndex++) {
    // Current / recent order (last 7 days)
    list.push(
      makeOrder(patientIndex, orderIndex, -((orderIndex * 2) % 7)),
    );
    orderIndex += 1;

    // Historical completed visit for every patient
    list.push(
      makeOrder(patientIndex, orderIndex, -14 - (patientIndex % 10), "COMPLETED"),
    );
    orderIndex += 1;

    // Extra verified history for every 3rd patient
    if (patientIndex % 3 === 0) {
      list.push(
        makeOrder(patientIndex, orderIndex, -28 - (patientIndex % 7), "VERIFIED"),
      );
      orderIndex += 1;
    }
  }

  return list;
}

/** Heavy pathology order book for dashboard, queue, sample, and patient pages. */
export const patients: LabPatientOrder[] = buildPatients(180);

/** Distinct sample barcodes for barcode preview / labeling demos. */
export function getLabBarcodeSamples(limit = 40) {
  return patients
    .filter((p) => p.sample.barcode)
    .slice(0, limit)
    .map((p) => ({
      barcode: p.sample.barcode,
      patientName: p.patient.name,
      uhid: p.patient.uhid,
      orderId: p.order.orderId,
    }));
}

export function getLabSampleKpis(list = patients) {
  const today = new Date().toISOString().slice(0, 10);
  const todayList = list.filter((p) => p.order.orderedAt.slice(0, 10) === today);
  const collected = todayList.filter((p) =>
    ["COLLECTED", "IN_PROCESS", "VERIFIED", "COMPLETED"].includes(p.status),
  ).length;
  const pending = todayList.filter((p) => p.status === "QUEUE").length;
  const urgent = todayList.filter(
    (p) =>
      p.order.priority === "urgent" || p.order.priority === "emergency",
  ).length;

  return {
    totalSamples: list.length,
    collectedToday: collected,
    pendingCollection: pending,
    urgentSamples: urgent,
  };
}
