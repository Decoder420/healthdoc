"use client";

import { useCallback, useEffect, useState } from "react";

import { toast } from "@/components/ui/toast";
import { checkSafety, createPrescription } from "../api";
import { FREQUENCIES_WITHOUT_DURATION } from "../constants";
import type {
  ActiveEncounter,
  DraftPrescriptionItem,
  EncounterContext,
  Medicine,
  SafetyWarning,
} from "../types";

function itemFromMedicine(m: Medicine): DraftPrescriptionItem {
  return {
    tempId: crypto.randomUUID(),
    medicine_item_id: m.id,
    medicine_name: m.name,
    generic_name: m.generic_name,
    strength: m.strength,
    form: m.form,
    is_controlled_drug: m.is_controlled_drug,
    dosage: "",
    frequency: "OD",
    duration_days: 5,
    route: "oral",
    instructions: "",
  };
}

export function usePrescription(encounter: ActiveEncounter, context: EncounterContext) {
  const [items, setItems] = useState<DraftPrescriptionItem[]>([]);
  const [notes, setNotes] = useState("");
  const [warnings, setWarnings] = useState<SafetyWarning[]>([]);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  // Re-run the safety check whenever the item set changes.
  useEffect(() => {
    let live = true;
    if (items.length === 0) {
      setWarnings([]);
      return;
    }
    setChecking(true);
    void checkSafety(context.known_allergies, items)
      .then((r) => {
        if (live) setWarnings(r.warnings);
      })
      .finally(() => {
        if (live) setChecking(false);
      });
    return () => {
      live = false;
    };
  }, [items, context.known_allergies]);

  const addMedicine = useCallback((m: Medicine) => {
    setItems((prev) =>
      prev.some((i) => i.medicine_item_id === m.id) ? prev : [...prev, itemFromMedicine(m)],
    );
  }, []);

  const updateItem = useCallback(
    (tempId: string, patch: Partial<DraftPrescriptionItem>) =>
      setItems((prev) =>
        prev.map((i) => {
          if (i.tempId !== tempId) return i;
          const next = { ...i, ...patch };
          // As-needed / single-dose frequencies carry no duration.
          if (patch.frequency && FREQUENCIES_WITHOUT_DURATION.includes(patch.frequency)) {
            next.duration_days = undefined;
          }
          return next;
        }),
      ),
    [],
  );

  const removeItem = useCallback(
    (tempId: string) => setItems((prev) => prev.filter((i) => i.tempId !== tempId)),
    [],
  );

  const hasCritical = warnings.some((w) => w.severity === "critical");

  const save = useCallback(async () => {
    if (items.length === 0) {
      toast.error("Add at least one medicine");
      return;
    }
    const incomplete = items.find((i) => i.dosage.trim() === "");
    if (incomplete) {
      toast.error(`Enter a dosage for ${incomplete.medicine_name}`);
      return;
    }
    setSaving(true);
    try {
      await createPrescription({
        encounter_id: encounter.encounter_id,
        patient_id: encounter.patient_id,
        notes: notes.trim() || undefined,
        items: items.map((i) => ({
          medicine_item_id: i.medicine_item_id,
          medicine_name: i.medicine_name,
          dosage: i.dosage,
          frequency: i.frequency,
          duration_days: i.duration_days,
          route: i.route,
          instructions: i.instructions,
        })),
      });
      toast.success("Prescription saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save prescription");
    } finally {
      setSaving(false);
    }
  }, [encounter, items, notes]);

  return {
    items,
    notes,
    setNotes,
    warnings,
    checking,
    hasCritical,
    saving,
    addMedicine,
    updateItem,
    removeItem,
    save,
  };
}
