/**
 * Prescribing.
 *
 * Retired from fixtures (P1.1). The allergy check used to be reimplemented in
 * this file — it filtered the allergy list in the browser and blocked on
 * `severity === "anaphylaxis"` while the server blocks on `is_absolute`. Those
 * two agree (is_absolute is a derived property returning exactly that
 * comparison), so nothing was wrong on screen; it was one safety rule stated
 * twice, in two languages, free to drift.
 *
 * It now calls GET /allergies/patients/{id}/check, which runs the same
 * app/allergies/service.check_prescription_item that decides the write. The
 * warning a clinician sees and the 409 that stops the save are now the same
 * verdict from the same matcher.
 *
 * Drug-drug interaction checking remains out of scope (schema v3.14: "ruled out
 * of scope pending a licensed database"). No homemade interaction table — a
 * partial one is more dangerous than none, because it reads as authoritative.
 */
import { api } from "@/lib/api";
import type {
  AllergyAlert,
  CreatePrescriptionInput,
  Medicine,
  MedicineForm,
} from "../types";

interface MedicineSearchResponse {
  items: Array<{
    item_id: string;
    name: string;
    generic_name: string | null;
    ingredient_code: string | null;
    strength: string | null;
    form: string | null;
    is_controlled_drug: boolean;
  }>;
}

/**
 * GET /pharmacy/medicines/search — prescribable stock at this facility.
 *
 * Returns only items with non-expired stock on hand, FEFO-ordered server-side.
 * `ingredient_code` is carried through deliberately: it is the key the allergy
 * check matches on, and an item without one can only ever come back
 * "uncheckable".
 */
export async function searchMedicines(query: string): Promise<Medicine[]> {
  const q = query.trim();
  if (!q) return [];

  const response = await api<MedicineSearchResponse>(
    `/pharmacy/medicines/search?q=${encodeURIComponent(q)}`,
  );

  return response.items.map((item) => ({
    id: item.item_id,
    name: item.name,
    generic_name: item.generic_name ?? undefined,
    ingredient_code: item.ingredient_code ?? undefined,
    strength: item.strength ?? undefined,
    form: (item.form ?? "other") as MedicineForm,
    is_controlled_drug: item.is_controlled_drug,
  }));
}

/**
 * Check one item against the patient's active allergies.
 *
 * Three rules, all load-bearing, and all now enforced server-side:
 *  1. Match on ingredient_code, never the stock item — two brands of the same
 *     ingredient must both trip the allergy.
 *  2. No ingredient_code is "unknown", not "clear". The endpoint returns
 *     `uncheckable` so the clinician is told the check did not run, rather
 *     than being reassured it passed.
 *  3. Anaphylaxis is absolute. Not a warning, and not overridable by any role.
 *
 * Returns null only for a genuine "clear" — a checked item with no match.
 */
export async function checkAllergies(
  patientId: string,
  medicineName: string,
  ingredientCode?: string,
): Promise<AllergyAlert | null> {
  const params = new URLSearchParams({ medicine_name: medicineName });
  if (ingredientCode) params.set("ingredient_code", ingredientCode);

  const verdict = await api<{
    kind: "clear" | "block" | "override_required" | "uncheckable";
    medicine_name: string;
    allergy: AllergyAlert["allergy"] | null;
    message: string;
  }>(`/allergies/patients/${patientId}/check?${params.toString()}`);

  if (verdict.kind === "clear") return null;

  return {
    kind: verdict.kind,
    medicine_name: verdict.medicine_name || medicineName,
    allergy: verdict.allergy ?? undefined,
    message: verdict.message,
  };
}

/**
 * POST /orders/prescriptions — header and items in one call.
 *
 * The allergy gate runs again here, server-side, and returns 409
 * `allergy_conflict` if the pre-check above was ignored or the register changed
 * between the two calls. The pre-check is a courtesy; this is the enforcement.
 */
export async function createPrescription(
  input: CreatePrescriptionInput,
): Promise<{ id: string }> {
  const created = await api<{ id: string }>("/orders/prescriptions", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return { id: created.id };
}
