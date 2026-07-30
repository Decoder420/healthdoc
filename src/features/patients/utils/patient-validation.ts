import type { NewPatientInput } from "@/features/patients/types";

export type PatientFieldErrors = Partial<
  Record<
    | "name"
    | "age"
    | "gender"
    | "phone"
    | "address"
    | "email"
    | "alternateMobile"
    | "aadhaar"
    | "abha"
    | "photo"
    | "guardianName"
    | "guardianPhone"
    | "guardianAddress"
    | "identityDocumentNumber"
    | "identityDocumentFile",
    string
  >
>;

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function normalizePhone(phone: string) {
  const digits = normalizeDigits(phone);
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  return digits;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidIndianMobile(phone: string) {
  const digits = normalizePhone(phone);
  return /^[6-9]\d{9}$/.test(digits);
}

function isValidName(name: string) {
  return /^[a-zA-Z][a-zA-Z\s.'-]{1,99}$/.test(name.trim());
}

export function formatAadhaar(value: string) {
  const digits = normalizeDigits(value).slice(0, 12);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatAbha(value: string) {
  const digits = normalizeDigits(value).slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}-${digits.slice(10)}`;
}

export function validatePatientFields(input: NewPatientInput): {
  valid: boolean;
  errors: PatientFieldErrors;
  firstError?: string;
} {
  const errors: PatientFieldErrors = {};

  const name = input.name.trim();
  if (!name) {
    errors.name = "Full name is required.";
  } else if (!isValidName(name)) {
    errors.name = "Enter a valid name (letters only, min 2 characters).";
  }

  if (!input.age || input.age <= 0) {
    errors.age = "Age is required.";
  } else if (!Number.isInteger(input.age) || input.age > 120) {
    errors.age = "Enter a valid age between 1 and 120.";
  }

  if (!input.gender) {
    errors.gender = "Gender is required.";
  }

  const phone = input.phone.trim();
  if (!phone) {
    errors.phone = "Mobile number is required.";
  } else if (!isValidIndianMobile(phone)) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  const address = input.address.trim();
  if (!address) {
    errors.address = "Address is required.";
  } else if (address.length < 10) {
    errors.address = "Address must be at least 10 characters.";
  }

  const email = input.email.trim();
  if (email && !isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  const alternateMobile = input.alternateMobile.trim();
  if (alternateMobile) {
    if (!isValidIndianMobile(alternateMobile)) {
      errors.alternateMobile = "Enter a valid 10-digit alternate mobile number.";
    } else if (normalizePhone(alternateMobile) === normalizePhone(phone)) {
      errors.alternateMobile = "Alternate mobile must be different from primary mobile.";
    }
  }

  const aadhaarDigits = normalizeDigits(input.aadhaar);
  if (aadhaarDigits && aadhaarDigits.length !== 12) {
    errors.aadhaar = "Aadhaar must be exactly 12 digits.";
  }

  const abhaDigits = normalizeDigits(input.abha);
  if (abhaDigits && abhaDigits.length !== 14) {
    errors.abha = "ABHA ID must be exactly 14 digits.";
  }

  const guardianName = input.guardian.name.trim();
  const guardianPhone = input.guardian.phone.trim();
  const guardianAddress = input.guardian.address.trim();

  if (guardianName && !isValidName(guardianName)) {
    errors.guardianName = "Enter a valid guardian name.";
  }

  if (guardianPhone && !isValidIndianMobile(guardianPhone)) {
    errors.guardianPhone = "Enter a valid guardian mobile number.";
  }

  if (guardianAddress && guardianAddress.length < 10) {
    errors.guardianAddress = "Guardian address must be at least 10 characters.";
  }

  const documentNumber = input.identityDocument.documentNumber.trim();
  if (documentNumber && documentNumber.length < 4) {
    errors.identityDocumentNumber = "Enter a valid identity document number.";
  }

  const firstError = Object.values(errors)[0];

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstError,
  };
}

export function validateNewPatientInput(
  input: NewPatientInput,
): { valid: true } | { valid: false; error: string; errors: PatientFieldErrors } {
  const result = validatePatientFields(input);
  if (result.valid) {
    return { valid: true };
  }
  return {
    valid: false,
    error: result.firstError ?? "Please fix the highlighted fields.",
    errors: result.errors,
  };
}

export function maskAadhaar(aadhaar: string) {
  const digits = normalizeDigits(aadhaar);
  if (digits.length !== 12) return aadhaar;
  return `XXXX XXXX ${digits.slice(-4)}`;
}
