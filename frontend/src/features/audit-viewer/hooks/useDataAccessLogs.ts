"use client";

import { useCallback, useEffect, useState } from "react";

import { listDataAccessLogs } from "../api";
import type { AccessChannel, DataAccessFilters, DataAccessLog } from "../types";

export function useDataAccessLogs(
  initial: DataAccessFilters = { access_channel: "all" },
) {
  const [filters, setFilters] = useState<DataAccessFilters>(initial);
  const [rows, setRows] = useState<DataAccessLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await listDataAccessLogs(filters));
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
    filters,
    setQuery: (query: string) => setFilters((f) => ({ ...f, query })),
    setAccessChannel: (access_channel: AccessChannel | "all") =>
      setFilters((f) => ({ ...f, access_channel })),
    refresh,
  };
}
