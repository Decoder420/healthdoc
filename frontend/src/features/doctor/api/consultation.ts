import { mockIcdConcepts, savedDiagnoses, savedVitals } from "@/lib/mock";
import type {
  ActiveEncounter,
  CreateDiagnosisInput,
  CreateEncounterInput,
  IcdConcept,
  VitalsInput,
} from "../types";

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

/**
 * POST /api/v1/encounters — body carries only real encounters columns.
 * `patient_id` is context (resolved from the visit); `id` is the provisional
 * client id so vitals/diagnoses/orders stay linked after save.
 */
export async function createEncounter(
  body: CreateEncounterInput,
  patient_id: string,
  id: string,
): Promise<ActiveEncounter> {
  const created: ActiveEncounter = {
    id,
    visit_id: body.visit_id,
    patient_id,
    provider_user_id: body.provider_user_id,
    started_at: body.started_at,
  };
  return delay(created);
}

/** PATCH /api/v1/encounters/{id} { ended_at }. */
export async function completeEncounter(
  encounter: ActiveEncounter,
  ended_at: string,
): Promise<ActiveEncounter> {
  return delay({ ...encounter, ended_at });
}

/** POST /api/v1/vitals — vitals is its own table (never folded into the encounter). */
export async function saveVitals(input: VitalsInput): Promise<void> {
  savedVitals.push(input);
  await delay(null);
}

/** GET /api/v1/diagnoses/icd-search?q= — proxies WHO ICD-API + local icd_codes. */
export async function searchIcd(query: string): Promise<IcdConcept[]> {
  const q = query.trim().toLowerCase();
  if (!q) return delay(mockIcdConcepts);
  return delay(
    mockIcdConcepts.filter(
      (c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q),
    ),
  );
}

/** POST /api/v1/diagnoses — one row per diagnosis. */
export async function saveDiagnoses(rows: CreateDiagnosisInput[]): Promise<void> {
  savedDiagnoses.push(...rows);
  await delay(null);
}
