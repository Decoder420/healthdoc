import type {
  AppointmentItem,
  DashboardStat,
  QuickAction,
  QueueItem,
  RecentRegistration,
} from "../types";

export const receptionistStats: DashboardStat[] = [
  {
    label: "Today's Appointments",
    value: 48,
    change: "+6 from yesterday",
    trend: "up",
  },
  {
    label: "Waiting in Queue",
    value: 12,
    change: "3 urgent",
    trend: "neutral",
  },
  {
    label: "New Registrations",
    value: 9,
    change: "+2 this morning",
    trend: "up",
  },
  {
    label: "Checked In Today",
    value: 31,
    change: "64% of scheduled",
    trend: "neutral",
  },
];

export const receptionistQuickActions: QuickAction[] = [
  {
    label: "Register Patient",
    description: "Add a new patient record",
    href: "/receptionist/patient-search?action=register",
    color: "teal",
  },
  {
    label: "Book Appointment",
    description: "Schedule a new visit",
    href: "/appointments?action=book",
    color: "blue",
  },
  {
    label: "Patient Check-in",
    description: "OPD registration and token workflow",
    href: "/receptionist/registration",
    color: "violet",
  },
  {
    label: "View Reports",
    description: "Operational analytics and exports",
    href: "/reports",
    color: "amber",
  },
];

export const todaysAppointments: AppointmentItem[] = [
  {
    id: "apt-001",
    time: "09:00 AM",
    patientName: "Rahul Sharma",
    patientId: "P-1042",
    doctorName: "Dr. Mehta",
    department: "General Medicine",
    status: "completed",
    type: "follow-up",
  },
  {
    id: "apt-002",
    time: "09:30 AM",
    patientName: "Priya Patel",
    patientId: "P-1087",
    doctorName: "Dr. Singh",
    department: "Cardiology",
    status: "in-progress",
    type: "new",
  },
  {
    id: "apt-003",
    time: "10:00 AM",
    patientName: "Amit Kumar",
    patientId: "P-0913",
    doctorName: "Dr. Reddy",
    department: "Orthopedics",
    status: "checked-in",
    type: "follow-up",
  },
  {
    id: "apt-004",
    time: "10:30 AM",
    patientName: "Sneha Desai",
    patientId: "P-1120",
    doctorName: "Dr. Mehta",
    department: "General Medicine",
    status: "scheduled",
    type: "new",
  },
  {
    id: "apt-005",
    time: "11:00 AM",
    patientName: "Vikram Joshi",
    patientId: "P-0856",
    doctorName: "Dr. Nair",
    department: "ENT",
    status: "scheduled",
    type: "follow-up",
  },
  {
    id: "apt-006",
    time: "11:30 AM",
    patientName: "Ananya Iyer",
    patientId: "P-1098",
    doctorName: "Dr. Singh",
    department: "Cardiology",
    status: "cancelled",
    type: "new",
  },
];

export const waitingQueue: QueueItem[] = [
  {
    id: "q-001",
    token: "G-014",
    patientName: "Amit Kumar",
    patientId: "P-0913",
    doctorName: "Dr. Reddy",
    waitTime: "18 min",
    priority: "normal",
  },
  {
    id: "q-002",
    token: "C-007",
    patientName: "Ramesh Gupta",
    patientId: "P-0741",
    doctorName: "Dr. Singh",
    waitTime: "32 min",
    priority: "urgent",
  },
  {
    id: "q-003",
    token: "G-015",
    patientName: "Kavita Rao",
    patientId: "P-1033",
    doctorName: "Dr. Mehta",
    waitTime: "8 min",
    priority: "normal",
  },
  {
    id: "q-004",
    token: "E-003",
    patientName: "Suresh Menon",
    patientId: "P-0662",
    doctorName: "Dr. Nair",
    waitTime: "45 min",
    priority: "urgent",
  },
];

export const recentRegistrations: RecentRegistration[] = [
  {
    id: "reg-001",
    patientName: "Sneha Desai",
    patientId: "P-1120",
    registeredAt: "08:42 AM",
    contact: "+91 98765 43210",
  },
  {
    id: "reg-002",
    patientName: "Ananya Iyer",
    patientId: "P-1098",
    registeredAt: "08:15 AM",
    contact: "+91 91234 56789",
  },
  {
    id: "reg-003",
    patientName: "Mohit Verma",
    patientId: "P-1121",
    registeredAt: "07:55 AM",
    contact: "+91 99887 76655",
  },
];
