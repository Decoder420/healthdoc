"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { toast } from "@/components/ui/toast";
import { newIdempotencyKey } from "@/lib/api";
import {
  completeEncounter,
  createEncounter,
  getEncounterForVisit,
  updateEncounter,
} from "../api";
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

/** Owns the one persisted encounter for this visit and restores it on reload. */
export function useConsultation(context: EncounterContext) {
  const [encounter, setEncounter] = useState<ActiveEncounter | null>(null);
  const [startedAt] = useState(() => new Date().toISOString());
  const [createKey] = useState(() => newIdempotencyKey());
  const [loading, setLoading] = useState(true);
  const [encounterType, setEncounterType] = useState<EncounterType>("consultation");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [status, setStatus] = useState<ConsultationStatus>("draft");
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [soap, setSoap] = useState<SoapNote>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  const [noteStatus, setNoteStatus] = useState<NoteStatus>("pending");
  const [conflict, setConflict] = useState<UpdateEncounterInput | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void getEncounterForVisit(context.visit_id, context.patient_id)
      .then((existing) => {
        if (cancelled || !existing) return;
        setEncounter(existing);
        setEncounterType(existing.encounter_type ?? "consultation");
        setChiefComplaint(existing.chief_complaint ?? "");
        setSoap({
          subjective: existing.subjective ?? "",
          objective: existing.objective ?? "",
          assessment: existing.assessment ?? "",
          plan: existing.plan ?? "",
        });
        setNoteStatus(existing.note_status);
        setStatus(existing.ended_at ? "completed" : "saved");
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "Failed to restore consultation");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [context.patient_id, context.visit_id]);

  const patchSoap = useCallback(
    (patch: Partial<SoapNote>) => setSoap((previous) => ({ ...previous, ...patch })),
    [],
  );

  const canComplete = useMemo(
    () => status === "saved" && encounter !== null,
    [encounter, status],
  );
  const canWriteChildren = status === "saved" && encounter !== null;

  const saveEncounter = useCallback(async () => {
    if (chiefComplaint.trim() === "") {
      toast.error("Chief complaint is required to save the encounter");
      return;
    }
    setSaving(true);
    try {
      let current = encounter;
      if (!current) {
        current = await createEncounter(
          {
            visit_id: context.visit_id,
            provider_user_id: context.provider_user_id,
            encounter_type: encounterType,
            chief_complaint: chiefComplaint.trim(),
            started_at: startedAt,
          },
          context.patient_id,
          createKey,
        );
        // Preserve the real id even if the following SOAP PATCH fails. A retry
        // must update this row, never POST a duplicate encounter.
        setEncounter(current);
      }

      const saved = await updateEncounter(current, {
        ...soap,
        encounter_type: encounterType,
        chief_complaint: chiefComplaint.trim(),
        note_status: "stored",
      });
      setEncounter(saved);
      setConflict(null);
      setNoteStatus(saved.note_status);
      setStatus("saved");
      toast.success("Encounter saved");
    } catch (error) {
      if (error instanceof StaleWriteError) {
        setConflict(error.serverCopy);
        setNoteStatus("failed");
        toast.error(
          "Someone else saved this encounter while you were editing. Reload before saving again — your note has NOT been stored.",
        );
        return;
      }
      toast.error(error instanceof Error ? error.message : "Failed to save encounter");
    } finally {
      setSaving(false);
    }
  }, [
    chiefComplaint,
    context.patient_id,
    context.provider_user_id,
    context.visit_id,
    createKey,
    encounter,
    encounterType,
    soap,
    startedAt,
  ]);

  const complete = useCallback(async () => {
    if (!encounter) return;
    setCompleting(true);
    try {
      const completed = await completeEncounter(encounter, new Date().toISOString());
      setEncounter(completed);
      setStatus("completed");
      toast.success("Consultation completed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to complete consultation");
    } finally {
      setCompleting(false);
    }
  }, [encounter]);

  return {
    encounter,
    startedAt: encounter?.started_at ?? startedAt,
    loading,
    encounterType,
    setEncounterType,
    chiefComplaint,
    setChiefComplaint,
    status,
    saving,
    completing,
    canComplete,
    canWriteChildren,
    saveEncounter,
    complete,
    soap,
    patchSoap,
    noteStatus,
    conflict,
  };
}
