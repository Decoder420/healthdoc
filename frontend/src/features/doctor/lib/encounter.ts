import type { ActiveEncounter, EncounterContext } from "../types";

/**
 * A client-side provisional encounter, used by the standalone /doctor/orders and
 * /doctor/prescriptions routes so their panels have something to attach to.
 *
 * Real consultations get their encounter from useConsultation, which persists it
 * via POST /encounters. Panels must never mint one themselves — a prescription or
 * order has to reference the encounter the doctor actually opened.
 */
export function newProvisionalEncounter(context: EncounterContext): ActiveEncounter {
  return {
    id: crypto.randomUUID(),
    visit_id: context.visit_id,
    patient_id: context.patient_id,
    provider_user_id: context.provider_user_id,
    note_status: "pending" as const,
    started_at: new Date().toISOString(),
  };
}
