"use client";

import { useCallback, useMemo, useState } from "react";

import { toast } from "@/components/ui/toast";
import { completeEncounter, createEncounter } from "../api";
import type { ActiveEncounter, EncounterContext, EncounterType } from "../types";

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
    started_at: new Date().toISOString(),
  }));

  const [encounterType, setEncounterType] = useState<EncounterType>("consultation");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [status, setStatus] = useState<ConsultationStatus>("draft");
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

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
      setStatus("saved");
      toast.success("Encounter saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save encounter");
    } finally {
      setSaving(false);
    }
  }, [chiefComplaint, encounter, encounterType]);

  const complete = useCallback(async () => {
    setCompleting(true);
    try {
      await completeEncounter(encounter, new Date().toISOString());
      setStatus("completed");
      toast.success("Consultation completed");
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
  };
}
