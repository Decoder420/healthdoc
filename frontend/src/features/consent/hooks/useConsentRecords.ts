"use client";

import { useCallback, useEffect, useState } from "react";

import { listConsentRecords } from "../api";
import type { ConsentListFilters, ConsentRecord, ConsentStatus } from "../types";

export function useConsentRecords(initial: ConsentListFilters = { status: "all" }) {
  const [filters, setFilters] = useState<ConsentListFilters>(initial);
  const [rows, setRows] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await listConsentRecords(filters));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load consents");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    rows,
    loading,
    error,
    filters,
    setQuery: (query: string) => setFilters((f) => ({ ...f, query })),
    setStatus: (status: ConsentStatus | "all") => setFilters((f) => ({ ...f, status })),
    refresh,
  };
}
