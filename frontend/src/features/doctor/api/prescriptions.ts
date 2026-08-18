/**
 * Prescribing. The allergy gate mirrors backend
 * app/allergies/service.check_prescription_item exactly — see the three rules
 * below. Drug-drug interaction checking is out of scope (schema v3.14).
 */
import { mockAllergies, mockMedicines, savedPrescriptions } from "@/lib/mock";
import { ALLERGY_OVERRIDE_REASON_MIN } from "../constants";
import type { AllergyAlert, CreatePrescriptionInput, Medicine } from "../types";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

/** GET /api/v1/inventory/items?q= — prescribable stock. */
export async function searchMedicines(query: string): Promise<Medicine[]> {
  const q = query.trim().toLowerCase();
  if (!q) return delay(mockMedicines.slice(0, 8));
  const rows = mockMedicines.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      (m.generic_name?.toLowerCase().includes(q) ?? false),
  );
  return delay(rows.slice(0, 10), 150);
}

/**
 * Check one item against the patient's active allergies.
 *
 * Three rules, all load-bearing:
 *  1. Match on ingredient_code, never the stock item — two brands of the same
 *     ingredient must both trip the allergy.
 *  2. No ingredient_code is "unknown", not "clear". We return `uncheckable` so
 *     the clinician is told the check did not run, rather than implying it passed.
 *  3. Anaphylaxis is absolute. It is not a warning and cannot be overridden.
 */
export async function checkAllergies(
  patientId: string,
  medicineName: string,
  ingredientCode?: string,
): Promise<AllergyAlert | null> {
  if (!ingredientCode) {
    return delay({
      kind: "uncheckable",
      medicine_name: medicineName,
      message:
        "No ingredient code on this item — the allergy check could not be performed. Confirm with the patient before prescribing.",
    } as AllergyAlert);
  }

  const match = mockAllergies.find(
    (a) =>
      a.patient_id === patientId &&
      a.status === "active" &&
      a.ingredient_code === ingredientCode,
  );
  if (!match) return delay(null);

  if (match.severity === "anaphylaxis") {
    return delay({
      kind: "block",
      medicine_name: medicineName,
      allergy: match,
      message: `Anaphylaxis to ${match.substance_text}. This cannot be prescribed or overridden.`,
    } as AllergyAlert);
  }

  return delay({
    kind: "override_required",
    medicine_name: medicineName,
    allergy: match,
    message: `Recorded ${match.severity} allergy to ${match.substance_text}${
      match.reaction ? ` (${match.reaction})` : ""
    }. A reason of at least ${ALLERGY_OVERRIDE_REASON_MIN} characters is required to proceed.`,
  } as AllergyAlert);
}

/** POST /api/v1/orders/prescriptions — header + items in one call. */
export async function createPrescription(input: CreatePrescriptionInput): Promise<{ id: string }> {
  savedPrescriptions.push(input);
  return delay({ id: crypto.randomUUID() }, 320);
}
