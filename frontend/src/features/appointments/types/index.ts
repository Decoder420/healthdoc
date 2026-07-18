export type AppointmentStatus =
  | "scheduled"
  | "checked-in"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "no-show";

export type AppointmentType = "new" | "follow-up" | "consultation";

export type Appointment = {
  id: string;
  date: string;
  time: string;
  patientUhid: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  department: string;
  status: AppointmentStatus;
  type: AppointmentType;
  reason: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type AppointmentFormInput = {
  patientUhid: string;
  doctorId: string;
  date: string;
  time: string;
  type: AppointmentType;
  reason: string;
  notes: string;
};

export type AppointmentFieldErrors = Partial<
  Record<keyof AppointmentFormInput, string>
>;

export const emptyAppointmentForm: AppointmentFormInput = {
  patientUhid: "",
  doctorId: "",
  date: "",
  time: "",
  type: "new",
  reason: "",
  notes: "",
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "Scheduled",
  "checked-in": "Checked In",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No Show",
};

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  new: "New Visit",
  "follow-up": "Follow-up",
  consultation: "Consultation",
};

export const TIME_SLOTS: string[] = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];
