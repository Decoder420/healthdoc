"use client";

import { useCallback, useEffect, useState } from "react";

import { toast } from "@/components/ui/toast";
import { saveDiagnoses, searchIcd } from "../api";
import type {
  ActiveEncounter,
  CreateDiagnosisInput,
  DraftDiagnosis,
  IcdConcept,
} from "../types";

export function useDiagnoses(encounter: ActiveEncounter) {
  const [rows, setRows] = useState<DraftDiagnosis[]>([]);
  const [options, setOptions] = useState<IcdConcept[]>([]);
  const [saving, setSaving] = useState(false);

  // Load the ICD catalogue on mount; refined per keystroke via search().
  useEffect(() => {
    let live = true;
    void searchIcd("").then((r) => live && setOptions(r));
    return () => {
      live = false;
    };
  }, []);

  const search = useCallback(async (query: string) => {
    setOptions(await searchIcd(query));
  }, []);

  const addConcept = useCallback((concept: IcdConcept) => {
    setRows((prev) => {
      if (prev.some((r) => r.icd_code === concept.code && r.icd_version === concept.version)) {
        return prev;
      }
      return [
        ...prev,
        {
          tempId: crypto.randomUUID(),
          icd_code: concept.code,
          icd_version: concept.version,
          icd_uri: concept.icd_uri,
          post_coordinated_code: undefined,
          diagnosis_text: concept.title,
          diagnosis_type: "provisional",
          is_primary: prev.length === 0,
        },
      ];
    });
  }, []);

  const updateRow = useCallback(
    (tempId: string, patch: Partial<DraftDiagnosis>) =>
      setRows((prev) => prev.map((r) => (r.tempId === tempId ? { ...r, ...patch } : r))),
    [],
  );

  const setPrimary = useCallback(
    (tempId: string) =>
      setRows((prev) => prev.map((r) => ({ ...r, is_primary: r.tempId === tempId }))),
    [],
  );

  const removeRow = useCallback(
    (tempId: string) =>
      setRows((prev) => {
        const next = prev.filter((r) => r.tempId !== tempId);
        if (next.length > 0 && !next.some((r) => r.is_primary)) next[0].is_primary = true;
        return next;
      }),
    [],
  );

  const save = useCallback(async () => {
    if (rows.length === 0) {
      toast.error("Add at least one diagnosis");
      return;
    }
    setSaving(true);
    const payload: CreateDiagnosisInput[] = rows.map((r) => ({
      encounter_id: encounter.encounter_id,
      icd_code: r.icd_code,
      icd_version: r.icd_version,
      icd_uri: r.icd_uri,
      post_coordinated_code: r.post_coordinated_code,
      diagnosis_text: r.diagnosis_text,
      diagnosis_type: r.diagnosis_type,
      is_primary: r.is_primary,
    }));
    try {
      await saveDiagnoses(payload);
      toast.success(`${rows.length} diagnosis${rows.length > 1 ? "es" : ""} saved`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save diagnoses");
    } finally {
      setSaving(false);
    }
  }, [encounter.encounter_id, rows]);

  return { rows, options, search, addConcept, updateRow, setPrimary, removeRow, saving, save };
}
