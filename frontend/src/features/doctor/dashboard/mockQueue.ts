/**
 * MOCK DATA — replace with real API response once Suprita-iui (queue)
 * and priyanshuiuis (patients) confirm actual field names.
 * These types are our proposed shape — flag any mismatch to them.
 */

export type VisitStatus =
  | "waiting"
  | "called"
  | "in_consultation"
  | "waiting_for_investigation"
  | "report_ready"
  | "doctor_review_pending"
  | "pharmacy_pending"
  | "completed"
  | "cancelled"
  | "recalled";

export type PriorityType =
  | "normal"
  | "senior_citizen"
  | "pregnant"
  | "emergency"
  | "doctor_recall"
  | "follow_up_recall"
  | "admin_override";

export interface QueuePatient {
  id: string;
  token: string;
  patientName: string;
  uhid: string;
  visitId: string;
  status: VisitStatus;
  priorityType: PriorityType;
  waitTimeMinutes: number;
  age: number;
  gender: "Male" | "Female" | "Other";
  lastVisitDate?: string;
  previousDiagnoses?: string[];
}

export const mockDoctorQueue: QueuePatient[] = [
  {
    id: "1",
    token: "A-01",
    patientName: "Ramesh Kumar",
    uhid: "UH1001",
    visitId: "V5001",
    status: "waiting",
    priorityType: "senior_citizen",
    waitTimeMinutes: 12,
    age: 68,
    gender: "Male",
    lastVisitDate: "2026-05-02",
    previousDiagnoses: ["Hypertension", "Type 2 Diabetes"],
  },
  {
    id: "2",
    token: "A-02",
    patientName: "Sita Devi",
    uhid: "UH1002",
    visitId: "V5002",
    status: "called",
    priorityType: "pregnant",
    waitTimeMinutes: 4,
    age: 28,
    gender: "Female",
    lastVisitDate: "2026-06-10",
    previousDiagnoses: [],
  },
  {
    id: "3",
    token: "A-03",
    patientName: "Arjun Singh",
    uhid: "UH1003",
    visitId: "V5003",
    status: "in_consultation",
    priorityType: "normal",
    waitTimeMinutes: 0,
    age: 34,
    gender: "Male",
    lastVisitDate: "2026-04-18",
    previousDiagnoses: ["Seasonal allergy"],
  },
  {
    id: "4",
    token: "A-04",
    patientName: "Meena Patel",
    uhid: "UH1004",
    visitId: "V5004",
    status: "waiting_for_investigation",
    priorityType: "normal",
    waitTimeMinutes: 25,
    age: 45,
    gender: "Female",
    lastVisitDate: "2026-03-22",
    previousDiagnoses: ["Anemia"],
  },
  {
    id: "5",
    token: "A-05",
    patientName: "Vikram Malhotra",
    uhid: "UH1005",
    visitId: "V5005",
    status: "waiting",
    priorityType: "emergency",
    waitTimeMinutes: 2,
    age: 52,
    gender: "Male",
    lastVisitDate: "2026-01-30",
    previousDiagnoses: ["Chest pain — prior episode"],
  },
  {
    id: "6",
    token: "A-06",
    patientName: "Pooja Sharma",
    uhid: "UH1006",
    visitId: "V5006",
    status: "waiting",
    priorityType: "doctor_recall",
    waitTimeMinutes: 6,
    age: 39,
    gender: "Female",
    lastVisitDate: "2026-07-01",
    previousDiagnoses: ["Follow-up: lab report review"],
  },
  {
    id: "7",
    token: "A-07",
    patientName: "Suresh Nair",
    uhid: "UH1007",
    visitId: "V5007",
    status: "completed",
    priorityType: "normal",
    waitTimeMinutes: 0,
    age: 61,
    gender: "Male",
    lastVisitDate: "2026-07-10",
    previousDiagnoses: ["Osteoarthritis"],
  },
];