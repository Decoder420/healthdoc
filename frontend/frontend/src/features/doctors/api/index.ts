import type {
  DoctorFieldErrors,
  DoctorFormInput,
  DoctorProfile,
  DoctorStatus,
} from "@/features/doctors/types";
import { mockDoctorProfiles, resolveDepartment } from "@/features/doctors/data/mock-doctors";

const STORAGE_KEY = "hms-doctor-registry";

let doctorRegistry: DoctorProfile[] = [];
let loaded = false;
let doctorCounter = 1006;

function ensureLoaded() {
  if (loaded) return;

  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as DoctorProfile[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          doctorRegistry = parsed;
          loaded = true;
          return;
        }
      } catch {
        // fall through
      }
    }
  }

  doctorRegistry = [...mockDoctorProfiles];
  loaded = true;
  persist();
}

function persist() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(doctorRegistry));
  }
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function validateDoctorForm(input: DoctorFormInput): {
  valid: boolean;
  errors: DoctorFieldErrors;
  firstError?: string;
} {
  const errors: DoctorFieldErrors = {};

  if (!input.name.trim()) errors.name = "Doctor name is required.";
  if (!input.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!input.phone.trim()) {
    errors.phone = "Mobile number is required.";
  } else {
    const digits = normalizePhone(input.phone);
    const mobile =
      digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      errors.phone = "Enter a valid 10-digit mobile number.";
    }
  }
  if (!input.departmentId) errors.departmentId = "Department is required.";
  if (!input.specialization.trim()) {
    errors.specialization = "Specialization is required.";
  }
  if (!input.qualification.trim()) {
    errors.qualification = "Qualification is required.";
  }
  if (!input.experienceYears || input.experienceYears < 0 || input.experienceYears > 60) {
    errors.experienceYears = "Enter valid experience years.";
  }
  if (!input.consultationFee || input.consultationFee <= 0) {
    errors.consultationFee = "Consultation fee must be greater than 0.";
  }
  if (!input.licenseNumber.trim()) {
    errors.licenseNumber = "Medical license number is required.";
  }
  if (!input.joiningDate) errors.joiningDate = "Joining date is required.";
  if (!input.address.trim() || input.address.trim().length < 8) {
    errors.address = "Address must be at least 8 characters.";
  }
  if (!input.availability.days.length) {
    errors.days = "Select at least one available day.";
  }
  if (!input.availability.startTime || !input.availability.endTime) {
    errors.startTime = "Availability timings are required.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstError: Object.values(errors)[0],
  };
}

export type DoctorMutationResult =
  | { success: true; doctor: DoctorProfile }
  | { success: false; error: string; errors?: DoctorFieldErrors };

export function getAllDoctors() {
  ensureLoaded();
  return [...doctorRegistry];
}

export function getDoctorProfileById(id: string) {
  ensureLoaded();
  return doctorRegistry.find((doctor) => doctor.id === id) ?? null;
}

export function filterDoctors(params: {
  query?: string;
  departmentId?: string | "all";
  status?: DoctorStatus | "all";
}) {
  ensureLoaded();
  const query = params.query?.trim().toLowerCase() ?? "";
  const departmentId = params.departmentId ?? "all";
  const status = params.status ?? "all";
  const compactQuery = query.replace(/[\s\-_/]/g, "");

  return doctorRegistry.filter((doctor) => {
    if (departmentId !== "all" && doctor.departmentId !== departmentId) return false;
    if (status !== "all" && doctor.status !== status) return false;
    if (!query) return true;

    const fields = [
      doctor.name,
      doctor.employeeId,
      doctor.email,
      doctor.phone,
      doctor.department,
      doctor.specialization,
      doctor.qualification,
      doctor.licenseNumber,
    ]
      .join(" ")
      .toLowerCase();

    return (
      fields.includes(query) ||
      fields.replace(/[\s\-_/]/g, "").includes(compactQuery)
    );
  });
}

export function createDoctor(input: DoctorFormInput): DoctorMutationResult {
  ensureLoaded();
  const validation = validateDoctorForm(input);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.firstError ?? "Please fix the highlighted fields.",
      errors: validation.errors,
    };
  }

  const department = resolveDepartment(input.departmentId);
  if (!department) {
    return { success: false, error: "Invalid department selected." };
  }

  const phoneDigits = normalizePhone(input.phone);
  const duplicatePhone = doctorRegistry.find(
    (doctor) => normalizePhone(doctor.phone) === phoneDigits,
  );
  if (duplicatePhone) {
    return {
      success: false,
      error: `Doctor already exists with phone ${duplicatePhone.phone}.`,
    };
  }

  const duplicateLicense = doctorRegistry.find(
    (doctor) =>
      doctor.licenseNumber.trim().toLowerCase() ===
      input.licenseNumber.trim().toLowerCase(),
  );
  if (duplicateLicense) {
    return {
      success: false,
      error: `License number already used by ${duplicateLicense.name}.`,
    };
  }

  doctorCounter += 1;
  const doctor: DoctorProfile = {
    id: `doc-${String(doctorCounter).padStart(3, "0")}`,
    employeeId: `EMP-DOC-${doctorCounter}`,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    gender: input.gender,
    departmentId: department.id,
    department: department.name,
    departmentCode: department.code,
    specialization: input.specialization.trim(),
    qualification: input.qualification.trim(),
    experienceYears: input.experienceYears,
    consultationFee: input.consultationFee,
    licenseNumber: input.licenseNumber.trim(),
    status: input.status,
    joiningDate: input.joiningDate,
    address: input.address.trim(),
    photo: input.photo,
    availability: {
      days: [...input.availability.days],
      startTime: input.availability.startTime,
      endTime: input.availability.endTime,
    },
  };

  doctorRegistry = [doctor, ...doctorRegistry];
  persist();
  return { success: true, doctor };
}

export function updateDoctor(
  id: string,
  input: DoctorFormInput,
): DoctorMutationResult {
  ensureLoaded();
  const index = doctorRegistry.findIndex((doctor) => doctor.id === id);
  if (index === -1) {
    return { success: false, error: "Doctor not found." };
  }

  const validation = validateDoctorForm(input);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.firstError ?? "Please fix the highlighted fields.",
      errors: validation.errors,
    };
  }

  const department = resolveDepartment(input.departmentId);
  if (!department) {
    return { success: false, error: "Invalid department selected." };
  }

  const phoneDigits = normalizePhone(input.phone);
  const duplicatePhone = doctorRegistry.find(
    (doctor, i) => i !== index && normalizePhone(doctor.phone) === phoneDigits,
  );
  if (duplicatePhone) {
    return {
      success: false,
      error: `Another doctor already uses phone ${duplicatePhone.phone}.`,
    };
  }

  const duplicateLicense = doctorRegistry.find(
    (doctor, i) =>
      i !== index &&
      doctor.licenseNumber.trim().toLowerCase() ===
        input.licenseNumber.trim().toLowerCase(),
  );
  if (duplicateLicense) {
    return {
      success: false,
      error: `License number already used by ${duplicateLicense.name}.`,
    };
  }

  const current = doctorRegistry[index];
  const updated: DoctorProfile = {
    ...current,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    gender: input.gender,
    departmentId: department.id,
    department: department.name,
    departmentCode: department.code,
    specialization: input.specialization.trim(),
    qualification: input.qualification.trim(),
    experienceYears: input.experienceYears,
    consultationFee: input.consultationFee,
    licenseNumber: input.licenseNumber.trim(),
    status: input.status,
    joiningDate: input.joiningDate,
    address: input.address.trim(),
    photo: input.photo,
    availability: {
      days: [...input.availability.days],
      startTime: input.availability.startTime,
      endTime: input.availability.endTime,
    },
  };

  doctorRegistry = [updated, ...doctorRegistry.filter((_, i) => i !== index)];
  persist();
  return { success: true, doctor: updated };
}
