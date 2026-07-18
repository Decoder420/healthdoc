import type { Appointment } from "@/features/appointments/types";

function isoDateOffset(daysFromToday: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

/** Seed appointments relative to "today" so the directory always has current data. */
export function createSeedAppointments(): Appointment[] {
  const today = isoDateOffset(0);
  const tomorrow = isoDateOffset(1);
  const yesterday = isoDateOffset(-1);
  const nextWeek = isoDateOffset(7);
  const now = new Date().toISOString();

  return [
    {
      id: "apt-001",
      date: today,
      time: "09:00",
      patientUhid: "UHID202500142",
      patientName: "Rahul Sharma",
      patientPhone: "+91 98765 43210",
      doctorId: "doc-001",
      doctorName: "Dr. Mehta",
      departmentId: "dept-gm",
      department: "General Medicine",
      status: "completed",
      type: "follow-up",
      reason: "Blood pressure review",
      notes: "BP stable. Continue current medication.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "apt-002",
      date: today,
      time: "09:30",
      patientUhid: "UHID202500087",
      patientName: "Priya Patel",
      patientPhone: "+91 91234 56789",
      doctorId: "doc-002",
      doctorName: "Dr. Singh",
      departmentId: "dept-cardio",
      department: "Cardiology",
      status: "in-progress",
      type: "new",
      reason: "Chest discomfort",
      notes: "ECG ordered.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "apt-003",
      date: today,
      time: "10:00",
      patientUhid: "UHID202400913",
      patientName: "Amit Kumar",
      patientPhone: "+91 99887 76655",
      doctorId: "doc-003",
      doctorName: "Dr. Reddy",
      departmentId: "dept-ortho",
      department: "Orthopedics",
      status: "checked-in",
      type: "follow-up",
      reason: "Knee pain follow-up",
      notes: "",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "apt-004",
      date: today,
      time: "10:30",
      patientUhid: "UHID202501120",
      patientName: "Sneha Desai",
      patientPhone: "+91 97654 32109",
      doctorId: "doc-001",
      doctorName: "Dr. Mehta",
      departmentId: "dept-gm",
      department: "General Medicine",
      status: "scheduled",
      type: "new",
      reason: "Fever and cough",
      notes: "",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "apt-005",
      date: today,
      time: "11:00",
      patientUhid: "UHID202500142",
      patientName: "Rahul Sharma",
      patientPhone: "+91 98765 43210",
      doctorId: "doc-004",
      doctorName: "Dr. Nair",
      departmentId: "dept-ent",
      department: "ENT",
      status: "scheduled",
      type: "follow-up",
      reason: "Sinus review",
      notes: "Prefer morning slot.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "apt-006",
      date: today,
      time: "11:30",
      patientUhid: "UHID202500087",
      patientName: "Priya Patel",
      patientPhone: "+91 91234 56789",
      doctorId: "doc-002",
      doctorName: "Dr. Singh",
      departmentId: "dept-cardio",
      department: "Cardiology",
      status: "cancelled",
      type: "new",
      reason: "ECG report discussion",
      notes: "Patient requested cancellation.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "apt-007",
      date: tomorrow,
      time: "10:00",
      patientUhid: "UHID202400913",
      patientName: "Amit Kumar",
      patientPhone: "+91 99887 76655",
      doctorId: "doc-006",
      doctorName: "Dr. Kapoor",
      departmentId: "dept-gm",
      department: "General Medicine",
      status: "scheduled",
      type: "consultation",
      reason: "General checkup",
      notes: "",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "apt-008",
      date: tomorrow,
      time: "15:00",
      patientUhid: "UHID202501120",
      patientName: "Sneha Desai",
      patientPhone: "+91 97654 32109",
      doctorId: "doc-005",
      doctorName: "Dr. Joshi",
      departmentId: "dept-pedia",
      department: "Pediatrics",
      status: "scheduled",
      type: "follow-up",
      reason: "Child vaccination counseling",
      notes: "Bring previous immunization card.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "apt-009",
      date: yesterday,
      time: "14:00",
      patientUhid: "UHID202500142",
      patientName: "Rahul Sharma",
      patientPhone: "+91 98765 43210",
      doctorId: "doc-003",
      doctorName: "Dr. Reddy",
      departmentId: "dept-ortho",
      department: "Orthopedics",
      status: "no-show",
      type: "new",
      reason: "Back pain",
      notes: "Did not arrive.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "apt-010",
      date: nextWeek,
      time: "09:30",
      patientUhid: "UHID202500087",
      patientName: "Priya Patel",
      patientPhone: "+91 91234 56789",
      doctorId: "doc-002",
      doctorName: "Dr. Singh",
      departmentId: "dept-cardio",
      department: "Cardiology",
      status: "scheduled",
      type: "follow-up",
      reason: "Lipid profile review",
      notes: "",
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function formatAppointmentTime(time: string) {
  const [hourRaw, minute] = time.split(":");
  const hour = Number(hourRaw);
  if (Number.isNaN(hour) || !minute) return time;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${String(displayHour).padStart(2, "0")}:${minute} ${period}`;
}

export function formatAppointmentDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function todayIsoDate() {
  return isoDateOffset(0);
}
