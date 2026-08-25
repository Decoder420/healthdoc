"use client";

import { useCallback, useEffect, useState } from "react";

import { listIncidents } from "@/features/nurse/api/nursing";
import type { ClinicalIncident } from "@/features/nurse/types";

export function useIncidents(patientId?: string | null) {
  const [incidents, setIncidents] = useState<ClinicalIncident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!patientId) {
      setIncidents([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setIncidents(await listIncidents({ patientId }));
    } catch (reason) {
      console.error("Unable to load incidents", reason);
      setError("Unable to load clinical incidents.");
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { incidents, loading, error, refresh };
}
