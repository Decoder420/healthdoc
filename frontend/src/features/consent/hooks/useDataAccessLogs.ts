"use client";

import { useCallback, useEffect, useState } from "react";

import { listDataAccessLogs } from "../api";
import type { DataAccessLog } from "../types";

export function useDataAccessLogs(consentId: string | null) {
  const [rows, setRows] = useState<DataAccessLog[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!consentId) {
      setRows([]);
      return;
    }
    setLoading(true);
    try {
      setRows(await listDataAccessLogs({ consent_id: consentId }));
    } finally {
      setLoading(false);
    }
  }, [consentId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { rows, loading, refresh };
}
