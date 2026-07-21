/**
 * MOCK DATA — replace with real API response once Suprita-iui (queue)
 * and priyanshuiuis (patients) confirm actual field names.
 * These types are our proposed shape — flag any mismatch to them.
 */

export type VisitStatus =
  | "waiting"
  | "called"
  | "in_service"
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
  full_name: string;
  uhid: string;
  visitId: string;
  status: VisitStatus;
  priorityType: PriorityType;
  waitTimeMinutes: number;
  age_years: number;
  sex: "male" | "female" | "other";
  lastVisitDate?: string;
  previousDiagnoses?: string[];
}

export const mockDoctorQueue: QueuePatient[] = [
  {
    id: "1",
    token: "A-01",
    full_name: "Ramesh Kumar",
    uhid: "UH1001",
    visitId: "V5001",
    status: "waiting",
    priorityType: "senior_citizen",
    waitTimeMinutes: 12,
    age_years: 68,
    sex: "male",
    lastVisitDate: "2026-05-02",
    previousDiagnoses: ["Hypertension", "Type 2 Diabetes"],
  },
  {
    id: "2",
    token: "A-02",
    full_name: "Sita Devi",
    uhid: "UH1002",
    visitId: "V5002",
    status: "called",
    priorityType: "pregnant",
    waitTimeMinutes: 4,
    age_years: 28,
    sex: "female",
    lastVisitDate: "2026-06-10",
    previousDiagnoses: [],
  },
  {
    id: "3",
    token: "A-03",
    full_name: "Arjun Singh",
    uhid: "UH1003",
    visitId: "V5003",
    status: "in_service",
    priorityType: "normal",
    waitTimeMinutes: 0,
    age_years: 34,
    sex: "male",
    lastVisitDate: "2026-04-18",
    previousDiagnoses: ["Seasonal allergy"],
  },
  {
    id: "4",
    token: "A-04",
    full_name: "Meena Patel",
    uhid: "UH1004",
    visitId: "V5004",
    status: "waiting_for_investigation",
    priorityType: "normal",
    waitTimeMinutes: 25,
    age_years: 45,
    sex: "female",
    lastVisitDate: "2026-03-22",
    previousDiagnoses: ["Anemia"],
  },
  {
    id: "5",
    token: "A-05",
    full_name: "Vikram Malhotra",
    uhid: "UH1005",
    visitId: "V5005",
    status: "waiting",
    priorityType: "emergency",
    waitTimeMinutes: 2,
    age_years: 52,
    sex: "male",
    lastVisitDate: "2026-01-30",
    previousDiagnoses: ["Chest pain — prior episode"],
  },
  {
    id: "6",
    token: "A-06",
    full_name: "Pooja Sharma",
    uhid: "UH1006",
    visitId: "V5006",
    status: "waiting",
    priorityType: "doctor_recall",
    waitTimeMinutes: 6,
    age_years: 39,
    sex: "female",
    lastVisitDate: "2026-07-01",
    previousDiagnoses: ["Follow-up: lab report review"],
  },
  {
    id: "7",
    token: "A-07",
    full_name: "Suresh Nair",
    uhid: "UH1007",
    visitId: "V5007",
    status: "completed",
    priorityType: "normal",
    waitTimeMinutes: 0,
    age_years: 61,
    sex: "male",
    lastVisitDate: "2026-07-10",
    previousDiagnoses: ["Osteoarthritis"],
  },
];