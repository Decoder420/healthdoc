"use client";

import { useCallback, useEffect, useState } from "react";

import { listArchives, listIntegrityChecks } from "../api";
import type { AuditIntegrityCheck, AuditLogArchive } from "../types";

export function useIntegritySummary() {
  const [checks, setChecks] = useState<AuditIntegrityCheck[]>([]);
  const [archives, setArchives] = useState<AuditLogArchive[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [c, a] = await Promise.all([listIntegrityChecks(), listArchives()]);
      setChecks(c);
      setArchives(a);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { checks, archives, loading, refresh };
}
