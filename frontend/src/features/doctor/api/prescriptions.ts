import { mockAllergyMap, mockInteractionRules, mockMedicines, savedPrescriptions } from "@/lib/mock";
import type {
  CreatePrescriptionInput,
  DraftPrescriptionItem,
  Medicine,
  SafetyCheckResult,
  SafetyWarning,
} from "../types";

function delay<T>(value: T, ms = 240): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

/** Medicine search over the inventory_items catalogue. */
export async function searchMedicines(query = ""): Promise<Medicine[]> {
  const q = query.trim().toLowerCase();
  if (!q) return delay(mockMedicines);
  return delay(
    mockMedicines.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.generic_name?.toLowerCase().includes(q) ?? false),
    ),
  );
}

/**
 * Prescribing safety check (allergy + drug–drug interaction).
 * No schema table exists yet — this is mock rule evaluation, returned async so
 * the UI is already shaped for a future backend/CDS endpoint.
 */
export async function checkSafety(
  knownAllergies: string[],
  items: DraftPrescriptionItem[],
): Promise<SafetyCheckResult> {
  const warnings: SafetyWarning[] = [];
  const generic = (i: DraftPrescriptionItem) => (i.generic_name ?? i.medicine_name).trim();

  // Allergy matches.
  for (const item of items) {
    const g = generic(item).toLowerCase();
    for (const allergy of knownAllergies) {
      const rule = mockAllergyMap.find((a) => a.allergen === allergy);
      if (!rule) continue;
      if (rule.matches.some((m) => m.toLowerCase() === g)) {
        warnings.push({
          kind: "allergy",
          severity: "critical",
          medicine_name: item.medicine_name,
          allergen: allergy,
          message: `Patient is allergic to ${allergy} — ${item.medicine_name} is contraindicated.`,
        });
      }
    }
  }

  // Pairwise interactions.
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = generic(items[i]);
      const b = generic(items[j]);
      const rule = mockInteractionRules.find(
        (r) =>
          (r.a.toLowerCase() === a.toLowerCase() && r.b.toLowerCase() === b.toLowerCase()) ||
          (r.a.toLowerCase() === b.toLowerCase() && r.b.toLowerCase() === a.toLowerCase()),
      );
      if (rule) {
        warnings.push({
          kind: "interaction",
          severity: rule.severity,
          pair: [a, b],
          message: rule.message,
        });
      }
    }
  }

  return delay({ warnings });
}

/** POST /api/v1/prescriptions — header + prescription_items (linked to encounter_id/patient_id). */
export async function createPrescription(
  input: CreatePrescriptionInput,
): Promise<{ id: string }> {
  savedPrescriptions.push(input);
  return delay({ id: crypto.randomUUID() });
}
