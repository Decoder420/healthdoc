import { mockPatients, normalizePatientRecord } from "@/features/patients/data/mock-patients";
import type { NewPatientInput, Patient } from "@/features/patients/types";
import type { PatientFieldErrors } from "@/features/patients/utils/patient-validation";
import { validateNewPatientInput } from "@/features/patients/utils/patient-validation";
import { getAllDoctors, getDoctorProfileById } from "@/features/doctors/api";
import type { Doctor, OpdVisit, PaymentMethod, QueueEntry } from "@/features/opd/types";
import { OPD_TOKEN_FEE } from "@/features/opd/types";

const STORAGE_KEY = "hms-patient-registry";

let patientRegistry: Patient[] = [];
let registryLoaded = false;
let opdCounter = 1042;
let uhidCounter = 1201;
const tokenCounters: Record<string, number> = {};
let receiptCounter = 5001;

function pad(value: number, length: number) {
  return String(value).padStart(length, "0");
}

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1, 2);
  const day = pad(now.getDate(), 2);
  return `${year}${month}${day}`;
}

export function normalizeUhid(input: string): string {
  const compact = input.trim().toUpperCase().replace(/[\s\-_/]/g, "");

  if (!compact) return "";

  if (compact.startsWith("UHID")) {
    return compact;
  }

  if (/^\d{7,13}$/.test(compact)) {
    return `UHID${compact}`;
  }

  return compact;
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function normalizeAadhaar(aadhaar: string) {
  return aadhaar.replace(/\D/g, "");
}

function ensureRegistryLoaded() {
  if (registryLoaded) return;

  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<Patient>[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          patientRegistry = parsed.map((patient) =>
            normalizePatientRecord(
              patient as Parameters<typeof normalizePatientRecord>[0],
            ),
          );
          registryLoaded = true;
          return;
        }
      } catch {
        // fall through to mock data
      }
    }
  }

  patientRegistry = mockPatients.map((patient) => normalizePatientRecord(patient));
  registryLoaded = true;
  persistRegistry();
}

function persistRegistry() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(patientRegistry));
  }
}

export function searchPatientByUhid(uhid: string): Patient | null {
  ensureRegistryLoaded();
  const normalized = normalizeUhid(uhid);
  if (!normalized) return null;

  return (
    patientRegistry.find((patient) => normalizeUhid(patient.uhid) === normalized) ??
    null
  );
}

export function searchPatientByPhone(phone: string): Patient | null {
  ensureRegistryLoaded();
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return null;

  return (
    patientRegistry.find(
      (patient) => normalizePhone(patient.phone) === normalizedPhone,
    ) ?? null
  );
}

export function searchPatientByAadhaar(aadhaar: string): Patient | null {
  ensureRegistryLoaded();
  const normalized = normalizeAadhaar(aadhaar);
  if (!normalized) return null;

  return (
    patientRegistry.find(
      (patient) => normalizeAadhaar(patient.aadhaar) === normalized,
    ) ?? null
  );
}

export function searchPatientByAbha(abha: string): Patient | null {
  ensureRegistryLoaded();
  const normalized = normalizeAadhaar(abha);
  if (!normalized) return null;

  return (
    patientRegistry.find(
      (patient) => normalizeAadhaar(patient.abha) === normalized,
    ) ?? null
  );
}

export type PatientSearchType = "uhid" | "aadhaar" | "abha" | "mobile";

export function searchPatientByType(
  type: PatientSearchType,
  query: string,
): Patient | null {
  ensureRegistryLoaded();
  const trimmed = query.trim();
  if (!trimmed) return null;

  switch (type) {
    case "uhid":
      return searchPatientByUhid(trimmed);
    case "aadhaar": {
      const digits = normalizeAadhaar(trimmed);
      if (digits.length !== 12) return null;
      return searchPatientByAadhaar(digits);
    }
    case "abha": {
      const digits = normalizeAadhaar(trimmed);
      if (digits.length !== 14) return null;
      return searchPatientByAbha(digits);
    }
    case "mobile": {
      const digits = normalizePhone(trimmed);
      const mobile =
        digits.length === 12 && digits.startsWith("91")
          ? digits.slice(2)
          : digits;
      if (mobile.length !== 10) return null;
      return searchPatientByPhone(mobile);
    }
    default:
      return null;
  }
}

export function searchPatient(query: string): Patient | null {
  ensureRegistryLoaded();
  const trimmed = query.trim();
  if (!trimmed) return null;

  const byUhid = searchPatientByUhid(trimmed);
  if (byUhid) return byUhid;

  const digits = normalizeAadhaar(trimmed);
  if (digits.length === 14) {
    const byAbha = searchPatientByAbha(digits);
    if (byAbha) return byAbha;
  }

  if (digits.length === 12) {
    const byAadhaar = searchPatientByAadhaar(digits);
    if (byAadhaar) return byAadhaar;
  }

  if (/^\+?\d[\d\s\-]{8,}$/.test(trimmed)) {
    const byPhone = searchPatientByPhone(trimmed);
    if (byPhone) return byPhone;
  }

  const compact = trimmed.toUpperCase().replace(/[\s\-_/]/g, "");
  const partialMatch = patientRegistry.find((patient) => {
    const patientUhid = normalizeUhid(patient.uhid);
    return (
      patientUhid.includes(compact) ||
      compact.includes(patientUhid.replace(/^UHID/, ""))
    );
  });

  return partialMatch ?? null;
}

export type CreateAbhaResult =
  | { success: true; abha: string; patient: Patient }
  | { success: false; error: string };

export function createAbhaForPatient(params: {
  uhid?: string;
  aadhaar: string;
  phone: string;
  name?: string;
}): CreateAbhaResult {
  ensureRegistryLoaded();

  const aadhaar = normalizeAadhaar(params.aadhaar);
  const phone = normalizePhone(params.phone);
  const mobile =
    phone.length === 12 && phone.startsWith("91") ? phone.slice(2) : phone;

  if (aadhaar.length !== 12) {
    return { success: false, error: "Valid 12-digit Aadhaar is required to create ABHA." };
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return { success: false, error: "Valid 10-digit mobile number is required to create ABHA." };
  }

  const existingByAbhaLinkedAadhaar = patientRegistry.find(
    (patient) =>
      normalizeAadhaar(patient.aadhaar) === aadhaar &&
      normalizeAadhaar(patient.abha).length === 14,
  );

  if (existingByAbhaLinkedAadhaar) {
    return {
      success: false,
      error: `ABHA already exists for this Aadhaar: ${existingByAbhaLinkedAadhaar.abha}`,
    };
  }

  // Mock ABHA generation (in production this would call ABDM APIs)
  const timestamp = Date.now().toString().slice(-10);
  const abhaDigits = `${aadhaar.slice(0, 2)}${timestamp.slice(0, 4)}${mobile.slice(-4)}${aadhaar.slice(-4)}`.slice(0, 14);
  const abha = `${abhaDigits.slice(0, 2)}-${abhaDigits.slice(2, 6)}-${abhaDigits.slice(6, 10)}-${abhaDigits.slice(10, 14)}`;

  if (params.uhid) {
    const index = patientRegistry.findIndex(
      (patient) => normalizeUhid(patient.uhid) === normalizeUhid(params.uhid!),
    );

    if (index === -1) {
      return { success: false, error: "Patient not found to attach ABHA." };
    }

    const updated: Patient = {
      ...patientRegistry[index],
      aadhaar: patientRegistry[index].aadhaar || aadhaar,
      phone: patientRegistry[index].phone || mobile,
      abha,
    };

    patientRegistry = [
      updated,
      ...patientRegistry.filter((_, i) => i !== index),
    ];
    persistRegistry();

    return { success: true, abha, patient: updated };
  }

  return {
    success: true,
    abha,
    patient: normalizePatientRecord({
      uhid: "TEMP",
      name: params.name ?? "",
      age: 0,
      gender: "other",
      phone: mobile,
      aadhaar,
      abha,
      address: "",
      registeredAt: new Date().toISOString(),
    }),
  };
}

export function updatePatientAbha(uhid: string, abha: string): Patient | null {
  ensureRegistryLoaded();
  const index = patientRegistry.findIndex(
    (patient) => normalizeUhid(patient.uhid) === normalizeUhid(uhid),
  );
  if (index === -1) return null;

  const updated = { ...patientRegistry[index], abha };
  patientRegistry = [
    updated,
    ...patientRegistry.filter((_, i) => i !== index),
  ];
  persistRegistry();
  return updated;
}

export function uhidExists(uhid: string): boolean {
  return searchPatientByUhid(uhid) !== null;
}

export type CreatePatientResult =
  | { success: true; patient: Patient }
  | {
      success: false;
      error: string;
      existingPatient?: Patient;
      errors?: PatientFieldErrors;
    };

export function createPatient(input: NewPatientInput): CreatePatientResult {
  ensureRegistryLoaded();

  const validation = validateNewPatientInput(input);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
      errors: validation.errors,
    };
  }

  const phone = input.phone.trim();
  const normalizedPhone = normalizePhone(phone);
  const normalizedAadhaar = normalizeAadhaar(input.aadhaar);

  const duplicateByPhone = patientRegistry.find(
    (patient) => normalizePhone(patient.phone) === normalizedPhone,
  );

  if (duplicateByPhone) {
    return {
      success: false,
      error: `Patient already registered with phone ${duplicateByPhone.phone}.`,
      existingPatient: duplicateByPhone,
    };
  }

  if (normalizedAadhaar) {
    const duplicateByAadhaar = patientRegistry.find(
      (patient) => normalizeAadhaar(patient.aadhaar) === normalizedAadhaar,
    );

    if (duplicateByAadhaar) {
      return {
        success: false,
        error: `Patient already registered with this Aadhaar (UHID: ${duplicateByAadhaar.uhid}).`,
        existingPatient: duplicateByAadhaar,
      };
    }
  }

  const duplicateByName = patientRegistry.find(
    (patient) =>
      patient.name.trim().toLowerCase() === input.name.trim().toLowerCase() &&
      patient.age === input.age &&
      normalizePhone(patient.phone) === normalizedPhone,
  );

  if (duplicateByName) {
    return {
      success: false,
      error: `Patient already exists with UHID ${duplicateByName.uhid}.`,
      existingPatient: duplicateByName,
    };
  }

  const year = new Date().getFullYear();
  let newUhid = "";
  let attempts = 0;

  do {
    uhidCounter += 1;
    newUhid = `UHID${year}${pad(uhidCounter, 5)}`;
    attempts += 1;
  } while (uhidExists(newUhid) && attempts < 100);

  if (uhidExists(newUhid)) {
    return {
      success: false,
      error: "Unable to generate a unique UHID. Please try again.",
    };
  }

  const patient: Patient = normalizePatientRecord({
    uhid: newUhid,
    name: input.name.trim(),
    age: input.age,
    gender: input.gender,
    phone,
    alternateMobile: input.alternateMobile.trim(),
    email: input.email.trim(),
    address: input.address.trim(),
    photo: input.photo,
    aadhaar: normalizedAadhaar,
    abha: input.abha.trim(),
    guardian: {
      name: input.guardian.name.trim(),
      relation: input.guardian.relation,
      phone: input.guardian.phone.trim(),
      address: input.guardian.address.trim(),
    },
    identityDocument: {
      type: input.identityDocument.type,
      documentNumber: input.identityDocument.documentNumber.trim(),
      fileName: input.identityDocument.fileName,
      fileData: input.identityDocument.fileData,
    },
    registeredAt: new Date().toISOString(),
  });

  patientRegistry = [patient, ...patientRegistry];
  persistRegistry();

  return { success: true, patient };
}

export function generateOpdId(): string {
  opdCounter += 1;
  return `OPD${todayKey()}${pad(opdCounter % 10000, 4)}`;
}

export function generateTokenNumber(departmentCode: string): string {
  const code = departmentCode.toUpperCase();
  tokenCounters[code] = (tokenCounters[code] ?? 0) + 1;
  return `${code}-${pad(tokenCounters[code], 3)}`;
}

export function generateReceiptNumber(): string {
  receiptCounter += 1;
  return `RCP${todayKey()}${pad(receiptCounter % 10000, 4)}`;
}

export function getTokenFee() {
  return OPD_TOKEN_FEE;
}

export function createOpdVisit(params: {
  patient: Patient;
  doctorId: string;
  departmentId: string;
  paymentMethod: PaymentMethod;
  opdId: string;
  tokenNumber: string;
  receiptNumber: string;
}): OpdVisit {
  const doctor = getDoctorById(params.doctorId);
  if (!doctor) {
    throw new Error("Doctor not found");
  }

  return {
    opdId: params.opdId,
    uhid: params.patient.uhid,
    patientName: params.patient.name,
    doctorId: doctor.id,
    doctorName: doctor.name,
    department: doctor.department,
    departmentCode: doctor.departmentCode,
    tokenNumber: params.tokenNumber,
    tokenFee: OPD_TOKEN_FEE,
    paymentMethod: params.paymentMethod,
    receiptNumber: params.receiptNumber,
    createdAt: new Date().toISOString(),
  };
}

export function createQueueEntry(visit: OpdVisit): QueueEntry {
  return {
    id: `queue-${visit.opdId}`,
    tokenNumber: visit.tokenNumber,
    uhid: visit.uhid,
    patientName: visit.patientName,
    doctorId: visit.doctorId,
    doctorName: visit.doctorName,
    department: visit.department,
    opdId: visit.opdId,
    priority: "normal",
    status: "waiting",
    addedAt: new Date().toISOString(),
  };
}

export function getAllPatients() {
  ensureRegistryLoaded();
  return [...patientRegistry];
}

export function getPatientByUhid(uhid: string): Patient | null {
  return searchPatientByUhid(uhid);
}

export function updatePatient(
  uhid: string,
  input: Partial<NewPatientInput>,
): CreatePatientResult {
  ensureRegistryLoaded();

  const index = patientRegistry.findIndex(
    (patient) => normalizeUhid(patient.uhid) === normalizeUhid(uhid),
  );

  if (index === -1) {
    return { success: false, error: "Patient not found." };
  }

  const current = patientRegistry[index];
  const merged: NewPatientInput = {
    name: input.name ?? current.name,
    age: input.age ?? current.age,
    gender: input.gender ?? current.gender,
    phone: input.phone ?? current.phone,
    alternateMobile: input.alternateMobile ?? current.alternateMobile,
    email: input.email ?? current.email,
    address: input.address ?? current.address,
    photo: input.photo ?? current.photo,
    aadhaar: input.aadhaar ?? current.aadhaar,
    abha: input.abha ?? current.abha,
    guardian: input.guardian ?? current.guardian,
    identityDocument: input.identityDocument ?? current.identityDocument,
  };

  const validation = validateNewPatientInput(merged);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
      errors: validation.errors,
    };
  }

  const normalizedPhone = normalizePhone(merged.phone);
  const normalizedAadhaar = normalizeAadhaar(merged.aadhaar);

  const duplicateByPhone = patientRegistry.find(
    (patient, i) =>
      i !== index && normalizePhone(patient.phone) === normalizedPhone,
  );
  if (duplicateByPhone) {
    return {
      success: false,
      error: `Another patient already uses phone ${duplicateByPhone.phone}.`,
      existingPatient: duplicateByPhone,
    };
  }

  if (normalizedAadhaar) {
    const duplicateByAadhaar = patientRegistry.find(
      (patient, i) =>
        i !== index && normalizeAadhaar(patient.aadhaar) === normalizedAadhaar,
    );
    if (duplicateByAadhaar) {
      return {
        success: false,
        error: `Another patient already uses this Aadhaar (UHID: ${duplicateByAadhaar.uhid}).`,
        existingPatient: duplicateByAadhaar,
      };
    }
  }

  const updated = normalizePatientRecord({
    ...current,
    ...merged,
    phone: merged.phone.trim(),
    alternateMobile: merged.alternateMobile.trim(),
    email: merged.email.trim(),
    address: merged.address.trim(),
    aadhaar: normalizedAadhaar,
    abha: merged.abha.trim(),
    uhid: current.uhid,
    registeredAt: current.registeredAt,
  });

  patientRegistry = [
    updated,
    ...patientRegistry.filter((_, i) => i !== index),
  ];
  persistRegistry();

  return { success: true, patient: updated };
}

export function filterPatients(params: {
  query?: string;
  gender?: Patient["gender"] | "all";
  hasAbha?: "all" | "yes" | "no";
}): Patient[] {
  ensureRegistryLoaded();
  const query = params.query?.trim().toLowerCase() ?? "";
  const gender = params.gender ?? "all";
  const hasAbha = params.hasAbha ?? "all";
  const compactQuery = query.replace(/[\s\-_/]/g, "");

  return patientRegistry.filter((patient) => {
    if (gender !== "all" && patient.gender !== gender) return false;
    if (hasAbha === "yes" && !patient.abha) return false;
    if (hasAbha === "no" && patient.abha) return false;
    if (!query) return true;

    const fields = [
      patient.uhid,
      patient.name,
      patient.phone,
      patient.alternateMobile,
      patient.email,
      patient.aadhaar,
      patient.abha,
      patient.address,
    ]
      .join(" ")
      .toLowerCase();

    return (
      fields.includes(query) ||
      fields.replace(/[\s\-_/]/g, "").includes(compactQuery)
    );
  });
}

function toOpdDoctor(doctor: {
  id: string;
  name: string;
  departmentId: string;
  department: string;
  departmentCode: string;
}): Doctor {
  return {
    id: doctor.id,
    name: doctor.name,
    departmentId: doctor.departmentId,
    department: doctor.department,
    departmentCode: doctor.departmentCode,
  };
}

export function getDoctorsByDepartment(departmentId: string): Doctor[] {
  return getAllDoctors()
    .filter(
      (doctor) =>
        doctor.departmentId === departmentId && doctor.status === "active",
    )
    .map(toOpdDoctor);
}

export function getDoctorById(doctorId: string): Doctor | undefined {
  const doctor = getDoctorProfileById(doctorId);
  return doctor ? toOpdDoctor(doctor) : undefined;
}
