"use client";

import { useCallback, useEffect, useState } from "react";

import { callNextToken, listQueue } from "../api";
import type { QueueToken } from "../types";

export function useDoctorQueue() {
  const [patients, setPatients] = useState<QueueToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<QueueToken | null>(null);

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

  const [calling, setCalling] = useState(false);

  /**
   * POST /queue/tokens/{id}/call-next. The mock only flips status + called_at;
   * the real endpoint also moves queues.now_serving_token_id and publishes to
   * the department display board.
   */
  const callNext = useCallback(async (tokenId: string) => {
    setCalling(true);
    try {
      const updated = await callNextToken(tokenId);
      if (!updated) return;
      setPatients((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setSelected((prev) => (prev && prev.id === updated.id ? updated : prev));
    } finally {
      setCalling(false);
    }
  }, []);

  return { patients, loading, error, refresh, selected, select: setSelected, callNext, calling };
}
