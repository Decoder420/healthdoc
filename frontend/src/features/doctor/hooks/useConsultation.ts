"use client";

import { useCallback, useMemo, useState } from "react";

import { toast } from "@/components/ui/toast";
import { localOnly } from "../lib/mockMode";
import { completeEncounter, createEncounter, updateEncounter } from "../api";
import { StaleWriteError } from "../types";
import type {
  ActiveEncounter,
  EncounterContext,
  EncounterType,
  NoteStatus,
  UpdateEncounterInput,
} from "../types";
import type { SoapNote } from "../components/SoapNotePanel";

export type ConsultationStatus = "draft" | "saved" | "completed";

/**
 * Owns the encounters row for one consultation. A provisional encounter id +
 * started_at are fixed when the screen opens so vitals/diagnoses/orders/
 * prescriptions can reference it; "Save encounter" persists the real row.
 */
export function useConsultation(context: EncounterContext) {
  const [encounter] = useState<ActiveEncounter>(() => ({
    id: crypto.randomUUID(),
    visit_id: context.visit_id,
    patient_id: context.patient_id,
    provider_user_id: context.provider_user_id,
    note_status: "pending" as const,
    started_at: new Date().toISOString(),
  }));

  const [encounterType, setEncounterType] = useState<EncounterType>("consultation");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [status, setStatus] = useState<ConsultationStatus>("draft");
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [soap, setSoap] = useState<SoapNote>({ subjective: "", objective: "", assessment: "", plan: "" });
  const [noteStatus, setNoteStatus] = useState<NoteStatus>("pending");
  /** Server copy of a save we refused to overwrite, so the UI can show a diff. */
  const [conflict, setConflict] = useState<UpdateEncounterInput | null>(null);

  const patchSoap = useCallback(
    (patch: Partial<SoapNote>) => setSoap((prev) => ({ ...prev, ...patch })),
    [],
  );

  const canComplete = useMemo(() => status === "saved", [status]);

  const saveEncounter = useCallback(async () => {
    if (chiefComplaint.trim() === "") {
      toast.error("Chief complaint is required to save the encounter");
      return;
    }
    setSaving(true);
    try {
      await createEncounter(
        {
          visit_id: encounter.visit_id,
          provider_user_id: encounter.provider_user_id,
          encounter_type: encounterType,
          chief_complaint: chiefComplaint.trim(),
  
    started_at: encounter.started_at,
        },
        encounter.patient_id,
        encounter.id,
      );
      // SOAP is a PATCH, never part of the POST — EncounterCreate does not accept it.
      const saved = await updateEncounter({ ...encounter, note_status: "pending" }, soap);
      setNoteStatus(saved.note_status);
      setStatus("saved");
      toast.success(localOnly("Encounter saved"));
    } catch (e) {
      if (e instanceof StaleWriteError) {
        setConflict(e.serverCopy);
        // Do not overwrite. Tell the clinician their copy is stale and stop.
        setNoteStatus("failed");
        toast.error(
          "Someone else saved this encounter while you were editing. Reload before saving again — your note has NOT been stored.",
        );
        return;
      }
      toast.error(e instanceof Error ? e.message : "Failed to save encounter");
    } finally {
      setSaving(false);
    }
  }, [chiefComplaint, encounter, encounterType, soap]);

  const complete = useCallback(async () => {
    setCompleting(true);
    try {
      await completeEncounter(encounter, new Date().toISOString());
      setStatus("completed");
      toast.success(localOnly("Consultation completed"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to complete consultation");
    } finally {
      setCompleting(false);
    }
  }, [encounter]);

  return {
    encounter,
    encounterType,
    setEncounterType,
    chiefComplaint,
    setChiefComplaint,
    status,
    saving,
    completing,
    canComplete,
    saveEncounter,
    complete,
    soap,
    patchSoap,
    noteStatus,
    conflict,
  };
}
