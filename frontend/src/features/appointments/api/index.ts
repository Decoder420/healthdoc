import {
  createSeedAppointments,
  todayIsoDate,
} from "@/features/appointments/data/mock-appointments";
import {
  TIME_SLOTS,
  type Appointment,
  type AppointmentFieldErrors,
  type AppointmentFormInput,
  type AppointmentStatus,
  type AppointmentType,
} from "@/features/appointments/types";
import { getDoctorProfileById } from "@/features/doctors/api";
import { getPatientByUhid } from "@/features/patients/api";

const STORAGE_KEY = "hms-appointment-registry";

let appointmentRegistry: Appointment[] = [];
let loaded = false;
let appointmentCounter = 100;

function ensureLoaded() {
  if (loaded) return;

  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Appointment[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          appointmentRegistry = parsed;
          loaded = true;
          return;
        }
      } catch {
        // fall through
      }
    }
  }

  appointmentRegistry = createSeedAppointments();
  loaded = true;
  persist();
}

function persist() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(appointmentRegistry));
  }
}

const ACTIVE_STATUSES: AppointmentStatus[] = [
  "scheduled",
  "checked-in",
  "in-progress",
];

export function validateAppointmentForm(
  input: AppointmentFormInput,
  options?: { allowPastDate?: boolean },
): {
  valid: boolean;
  errors: AppointmentFieldErrors;
  firstError?: string;
} {
  const errors: AppointmentFieldErrors = {};

  if (!input.patientUhid) errors.patientUhid = "Select a patient.";
  if (!input.doctorId) errors.doctorId = "Select a doctor.";
  if (!input.date) errors.date = "Appointment date is required.";
  if (!input.time) errors.time = "Appointment time is required.";
  if (!input.type) errors.type = "Visit type is required.";
  if (!input.reason.trim() || input.reason.trim().length < 3) {
    errors.reason = "Enter a brief reason (at least 3 characters).";
  }

  if (input.date) {
    const selected = new Date(`${input.date}T00:00:00`);
    const min = new Date();
    min.setHours(0, 0, 0, 0);
    if (Number.isNaN(selected.getTime())) {
      errors.date = "Invalid date.";
    } else if (!options?.allowPastDate && selected < min) {
      errors.date = "Cannot book appointments in the past.";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstError: Object.values(errors)[0],
  };
}

export type AppointmentMutationResult =
  | { success: true; appointment: Appointment }
  | { success: false; error: string; errors?: AppointmentFieldErrors };

export function getAllAppointments() {
  ensureLoaded();
  return [...appointmentRegistry].sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    if (byDate !== 0) return byDate;
    return a.time.localeCompare(b.time);
  });
}

export function getAppointmentById(id: string) {
  ensureLoaded();
  return appointmentRegistry.find((item) => item.id === id) ?? null;
}

export function getTodaysAppointments() {
  const today = todayIsoDate();
  return getAllAppointments().filter((item) => item.date === today);
}

export function filterAppointments(params: {
  query?: string;
  date?: string | "all";
  doctorId?: string | "all";
  departmentId?: string | "all";
  status?: AppointmentStatus | "all";
  type?: AppointmentType | "all";
}) {
  ensureLoaded();
  const query = params.query?.trim().toLowerCase() ?? "";
  const date = params.date ?? "all";
  const doctorId = params.doctorId ?? "all";
  const departmentId = params.departmentId ?? "all";
  const status = params.status ?? "all";
  const type = params.type ?? "all";
  const compactQuery = query.replace(/[\s\-_/]/g, "");

  return getAllAppointments().filter((item) => {
    if (date !== "all" && item.date !== date) return false;
    if (doctorId !== "all" && item.doctorId !== doctorId) return false;
    if (departmentId !== "all" && item.departmentId !== departmentId) return false;
    if (status !== "all" && item.status !== status) return false;
    if (type !== "all" && item.type !== type) return false;
    if (!query) return true;

    const fields = [
      item.id,
      item.patientName,
      item.patientUhid,
      item.patientPhone,
      item.doctorName,
      item.department,
      item.reason,
    ]
      .join(" ")
      .toLowerCase();

    return (
      fields.includes(query) ||
      fields.replace(/[\s\-_/]/g, "").includes(compactQuery)
    );
  });
}

function hasSlotConflict(
  doctorId: string,
  date: string,
  time: string,
  excludeId?: string,
) {
  return appointmentRegistry.some(
    (item) =>
      item.id !== excludeId &&
      item.doctorId === doctorId &&
      item.date === date &&
      item.time === time &&
      ACTIVE_STATUSES.includes(item.status),
  );
}

export function getAvailableTimeSlots(params: {
  doctorId: string;
  date: string;
  excludeAppointmentId?: string;
}) {
  if (!params.doctorId || !params.date) return [...TIME_SLOTS];

  return TIME_SLOTS.filter(
    (slot) =>
      !hasSlotConflict(
        params.doctorId,
        params.date,
        slot,
        params.excludeAppointmentId,
      ),
  );
}

export function createAppointment(
  input: AppointmentFormInput,
): AppointmentMutationResult {
  ensureLoaded();
  const validation = validateAppointmentForm(input);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.firstError ?? "Please fix the highlighted fields.",
      errors: validation.errors,
    };
  }

  const patient = getPatientByUhid(input.patientUhid);
  if (!patient) {
    return { success: false, error: "Selected patient was not found." };
  }

  const doctor = getDoctorProfileById(input.doctorId);
  if (!doctor) {
    return { success: false, error: "Selected doctor was not found." };
  }
  if (doctor.status !== "active") {
    return {
      success: false,
      error: `${doctor.name} is not currently available for booking.`,
    };
  }

  if (hasSlotConflict(input.doctorId, input.date, input.time)) {
    return {
      success: false,
      error: "This doctor already has an appointment in that slot.",
      errors: { time: "Slot unavailable. Choose another time." },
    };
  }

  const now = new Date().toISOString();
  appointmentCounter += 1;
  const appointment: Appointment = {
    id: `apt-${String(appointmentCounter).padStart(3, "0")}`,
    date: input.date,
    time: input.time,
    patientUhid: patient.uhid,
    patientName: patient.name,
    patientPhone: patient.phone,
    doctorId: doctor.id,
    doctorName: doctor.name,
    departmentId: doctor.departmentId,
    department: doctor.department,
    status: "scheduled",
    type: input.type,
    reason: input.reason.trim(),
    notes: input.notes.trim(),
    createdAt: now,
    updatedAt: now,
  };

  appointmentRegistry = [appointment, ...appointmentRegistry];
  persist();
  return { success: true, appointment };
}

export function updateAppointment(
  id: string,
  input: AppointmentFormInput,
): AppointmentMutationResult {
  ensureLoaded();
  const index = appointmentRegistry.findIndex((item) => item.id === id);
  if (index === -1) {
    return { success: false, error: "Appointment not found." };
  }

  const current = appointmentRegistry[index];
  if (current.status === "completed" || current.status === "cancelled") {
    return {
      success: false,
      error: `Cannot edit a ${current.status} appointment.`,
    };
  }

  const validation = validateAppointmentForm(input, { allowPastDate: true });
  if (!validation.valid) {
    return {
      success: false,
      error: validation.firstError ?? "Please fix the highlighted fields.",
      errors: validation.errors,
    };
  }

  const patient = getPatientByUhid(input.patientUhid);
  if (!patient) {
    return { success: false, error: "Selected patient was not found." };
  }

  const doctor = getDoctorProfileById(input.doctorId);
  if (!doctor) {
    return { success: false, error: "Selected doctor was not found." };
  }

  if (hasSlotConflict(input.doctorId, input.date, input.time, id)) {
    return {
      success: false,
      error: "This doctor already has an appointment in that slot.",
      errors: { time: "Slot unavailable. Choose another time." },
    };
  }

  const updated: Appointment = {
    ...current,
    date: input.date,
    time: input.time,
    patientUhid: patient.uhid,
    patientName: patient.name,
    patientPhone: patient.phone,
    doctorId: doctor.id,
    doctorName: doctor.name,
    departmentId: doctor.departmentId,
    department: doctor.department,
    type: input.type,
    reason: input.reason.trim(),
    notes: input.notes.trim(),
    updatedAt: new Date().toISOString(),
  };

  appointmentRegistry = [
    updated,
    ...appointmentRegistry.filter((_, i) => i !== index),
  ];
  persist();
  return { success: true, appointment: updated };
}

const STATUS_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  scheduled: ["checked-in", "cancelled", "no-show"],
  "checked-in": ["in-progress", "cancelled"],
  "in-progress": ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  "no-show": [],
};

export function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): AppointmentMutationResult {
  ensureLoaded();
  const index = appointmentRegistry.findIndex((item) => item.id === id);
  if (index === -1) {
    return { success: false, error: "Appointment not found." };
  }

  const current = appointmentRegistry[index];
  const allowed = STATUS_TRANSITIONS[current.status];
  if (!allowed.includes(status)) {
    return {
      success: false,
      error: `Cannot change status from ${current.status} to ${status}.`,
    };
  }

  const updated: Appointment = {
    ...current,
    status,
    updatedAt: new Date().toISOString(),
  };

  appointmentRegistry = [
    updated,
    ...appointmentRegistry.filter((_, i) => i !== index),
  ];
  persist();
  return { success: true, appointment: updated };
}

export function toAppointmentFormInput(
  appointment: Appointment,
): AppointmentFormInput {
  return {
    patientUhid: appointment.patientUhid,
    doctorId: appointment.doctorId,
    date: appointment.date,
    time: appointment.time,
    type: appointment.type,
    reason: appointment.reason,
    notes: appointment.notes,
  };
}
