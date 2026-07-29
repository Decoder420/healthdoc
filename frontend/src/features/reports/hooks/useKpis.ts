"use client";

import { useCallback, useEffect, useState } from "react";

import { listKpis } from "../api";
import type { KpiPeriod, KpiSnapshot } from "../types";

export function useKpis(initialPeriod: KpiPeriod = "7d") {
  const [period, setPeriod] = useState<KpiPeriod>(initialPeriod);
  const [items, setItems] = useState<KpiSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listKpis(period);
      setItems(res.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load KPIs");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    items,
    loading,
    error,
    period,
    setPeriod,
    refresh,
  };
}
