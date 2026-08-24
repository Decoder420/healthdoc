"use client";

import { useCallback, useEffect, useState } from "react";

import { listArchives, listIntegrityChecks } from "../api";
import type { AuditIntegrityCheck, AuditLogArchive } from "../types";

export function useIntegritySummary() {
  const [checks, setChecks] = useState<AuditIntegrityCheck[]>([]);
  const [archives, setArchives] = useState<AuditLogArchive[]>([]);
  /** True if ANY check in this facility's history failed, computed server-side
   *  over the whole history — a chain that broke months ago is still broken. */
  const [anyChainInvalid, setAnyChainInvalid] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [c, a] = await Promise.all([listIntegrityChecks(), listArchives()]);
      setChecks(c.items);
      setAnyChainInvalid(c.any_chain_invalid);
      setArchives(a);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { checks, archives, anyChainInvalid, loading, refresh };
}
