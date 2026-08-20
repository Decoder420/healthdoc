import { mockIcdConcepts, savedDiagnoses, savedVitals } from "@/lib/mock";
import { StaleWriteError } from "../types";
import type {
  ActiveEncounter,
  CreateDiagnosisInput,
  CreateEncounterInput,
  UpdateEncounterInput,
  IcdConcept,
  VitalsInput,
} from "../types";

/** Stands in for the server's row_version column, keyed by encounter id. */
const serverRowVersion = new Map<string, number>();
/** Last SOAP state the "server" accepted, so a conflict can be shown as a diff. */
const serverSoap = new Map<string, UpdateEncounterInput>();

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
    encounter_type: body.encounter_type,
    chief_complaint: body.chief_complaint,
    started_at: body.started_at,
    note_status: "pending",
    row_version: 1,
  };
  return delay(created);
}

/**
 * PATCH /api/v1/encounters/{id} — where SOAP is saved (never on the POST).
 *
 * note_status tracks whether the long-form note reached its store: it starts
 * `pending`, becomes `stored` on success, and `failed` must stay visible so a
 * note that vanished is never mistaken for a note that was never written.
 */
export async function updateEncounter(
  encounter: ActiveEncounter,
  patch: UpdateEncounterInput,
): Promise<ActiveEncounter> {
  // Optimistic locking: the real call sends If-Match with the row_version we
  // read. If the server has moved on, it answers 409 stale_write and we must
  // NOT overwrite — someone else's clinical note would be lost silently.
  const sent = encounter.row_version ?? 1;
  const current = serverRowVersion.get(encounter.id) ?? sent;
  if (sent !== current) {
    throw new StaleWriteError(current, serverSoap.get(encounter.id) ?? {});
  }

  const nextVersion = current + 1;
  serverRowVersion.set(encounter.id, nextVersion);
  serverSoap.set(encounter.id, {
    subjective: patch.subjective,
    objective: patch.objective,
    assessment: patch.assessment,
    plan: patch.plan,
  });

  const next: ActiveEncounter = {
    ...encounter,
    ...patch,
    note_status: patch.note_status ?? "stored",
    row_version: nextVersion,
  };
  return delay(next, 300);
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
