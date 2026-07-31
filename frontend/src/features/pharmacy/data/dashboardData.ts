import { QueueItem } from "@/features/pharmacy/types/index";
import {
  AlertTriangle,
  Clock3,
  PackageMinus,
} from "lucide-react";

export const dashboardStats = {
  todayPrescriptions: 128,
  waitingQueue: 18,
  dispensedToday: 96,
  onHold: 4,
  clarificationPending: 2,
};


export const todayQueue: QueueItem[] = [
  {
    id: "1",
    queueNumber: "Q-001",
    patientName: "Rahul Sharma",
    uhid: "UHID1001",
    doctor: "Dr. Amit",
    visitType: "OPD",
    medicines: 4,
    priority: "Normal",
    status: "Waiting",
    createdAt: "09:10 AM",
  },
  {
    id: "2",
    queueNumber: "Q-002",
    patientName: "Priya Singh",
    uhid: "UHID1002",
    doctor: "Dr. Neha",
    visitType: "OPD",
    medicines: 3,
    priority: "STAT",
    status: "Waiting",
    createdAt: "09:22 AM",
  },
  {
    id: "3",
    queueNumber: "Q-003",
    patientName: "Arjun Mehta",
    uhid: "UHID1003",
    doctor: "Dr. Vivek",
    visitType: "IPD",
    medicines: 5,
    priority: "High",
    status: "In Review",
    createdAt: "09:35 AM",
  },
];
export const inventoryNotifications = [
  {
    id: "1",
    type: "low-stock",
    medicineName: "Paracetamol 500 mg",
    message: "Only 8 tablets remaining",
    createdAt: "5 min ago",
  },

  {
    id: "2",
    type: "expiry",
    medicineName: "Insulin Injection",
    message: "Expires in 5 days",
    createdAt: "20 min ago",
  },

  {
    id: "3",
    type: "stock-update",
    medicineName: "Amoxicillin 250 mg",
    message: "GRN Received (+200)",
    createdAt: "45 min ago",
  },
];

export const recentDispenses = [
  {
    id: "1",
    receiptNumber: "RC-240001",
    patientName: "Rahul Sharma",
    medicines: 4,
    dispensedBy: "Amit Kumar",
    dispensedAt: "10:15 AM",
  },
  {
    id: "2",
    receiptNumber: "RC-240002",
    patientName: "Priya Singh",
    medicines: 3,
    dispensedBy: "Amit Kumar",
    dispensedAt: "10:32 AM",
  },
  {
    id: "3",
    receiptNumber: "RC-240003",
    patientName: "Arjun Mehta",
    medicines: 5,
    dispensedBy: "Amit Kumar",
    dispensedAt: "11:05 AM",
  },
];

// Dashboard warning cards
export const warningData = [
  {
    id: 1,
    type: "drug-interaction",
    title: "Drug Interaction Alerts",
    description: "3 prescriptions require pharmacist review.",
    count: 3,
    icon: AlertTriangle,
    color: "amber",
  },
  {
    id: 2,
    type: "expiry",
    title: "Near Expiry Medicines",
    description: "12 batches expire within 30 days.",
    count: 12,
    icon: Clock3,
    color: "yellow",
  },
  {
    id: 3,
    type: "low-stock",
    title: "Low Stock Medicines",
    description: "8 medicines below reorder level.",
    count: 8,
    icon: PackageMinus,
    color: "red",
  },
];

//Near Expiry Medicines Data
export const lowStockData = [
  {
    id: 1,
    medicine: "Paracetamol",
    available: 8,
    reorderLevel: 50,
    supplier: "ABC Pharma",
  },
  {
    id: 2,
    medicine: "Vitamin C",
    available: 5,
    reorderLevel: 30,
    supplier: "XYZ Pharma",
  },
];


export const nearExpiryData = [
  {
    id: 1,
    medicine: "Paracetamol 500 mg",
    batch: "PAR-001",
    expiry: "2026-08-10",
    quantity: 120,
    daysLeft: 17,
  },
  {
    id: 2,
    medicine: "Insulin",
    batch: "INS-102",
    expiry: "2026-08-03",
    quantity: 40,
    daysLeft: 10,
  },
];



export const returnMedicineData = [
  {
    id: 1,
    patient: "Rahul Sharma",
    medicine: "Paracetamol 500 mg",
    quantity: 2,
    reason: "Extra Medicine",
    status: "Pending",
  },
  {
    id: 2,
    patient: "Priya Verma",
    medicine: "Insulin Injection",
    quantity: 1,
    reason: "Damaged Pack",
    status: "Approved",
  },
  {
    id: 3,
    patient: "Amit Kumar",
    medicine: "Vitamin D",
    quantity: 5,
    reason: "Wrong Medicine",
    status: "Pending",
  },
];

export const interactionWarnings = [
  {
    id: 1,
    patient: "Rahul Sharma",
    uhid: "UHID1001",
    prescription: "RX-240001",
    medicine1: "Warfarin",
    medicine2: "Aspirin",
    interaction: "Increased bleeding risk",
    severity: "High",
  },
  {
    id: 2,
    patient: "Priya Singh",
    uhid: "UHID1002",
    prescription: "RX-240002",
    medicine1: "Metformin",
    medicine2: "Contrast Dye",
    interaction: "Risk of lactic acidosis",
    severity: "Medium",
  },
  {
    id: 3,
    patient: "Arjun Mehta",
    uhid: "UHID1003",
    prescription: "RX-240003",
    medicine1: "Ibuprofen",
    medicine2: "Lisinopril",
    interaction: "Reduced antihypertensive effect",
    severity: "Low",
  },
];