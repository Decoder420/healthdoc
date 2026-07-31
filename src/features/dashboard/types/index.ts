export type DashboardStat = {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
};

export type QuickAction = {
  label: string;
  description: string;
  href: string;
  color: "teal" | "blue" | "violet" | "amber";
};

export type AppointmentItem = {
  id: string;
  time: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  department: string;
  status: "scheduled" | "checked-in" | "in-progress" | "completed" | "cancelled";
  type: "new" | "follow-up";
};

export type QueueItem = {
  id: string;
  token: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  waitTime: string;
  priority: "normal" | "urgent";
};

export type RecentRegistration = {
  id: string;
  patientName: string;
  patientId: string;
  registeredAt: string;
  contact: string;
};
