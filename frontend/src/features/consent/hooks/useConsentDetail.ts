"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getConsent } from "../api";
import type { ConsentRecord } from "../types";

/**
 * One consent record.
 *
 * Takes the patient id as well: the endpoint is
 * GET /consent/patients/{patient_id}/records/{consent_id} — consent_records has
 * no facility_id of its own and is scoped through the patient, so the patient
 * is part of the address rather than a convenience.
 */
export function useConsentDetail(patientId: string | null, id: string | null) {
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const idRef = useRef(id);
  idRef.current = id;

  const load = useCallback(async () => {
    const current = idRef.current;
    if (!current || !patientId) {
      setRecord(null);
      return;
    }
    setLoading(true);
    const row = await getConsent(patientId, current);
    if (idRef.current === current) {
      setRecord(row);
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    void load();
  }, [id, patientId, load]);

  return { record, loading, refresh: load };
}
