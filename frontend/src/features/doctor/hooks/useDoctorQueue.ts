"use client";

import { useCallback, useEffect, useState } from "react";

import { listQueue } from "../api";
import type { QueuePatient } from "../types";

export function useDoctorQueue() {
  const [patients, setPatients] = useState<QueuePatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<QueuePatient | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPatients(await listQueue());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { patients, loading, error, refresh, selected, select: setSelected };
}
