"use client";

import { useEffect, useState } from "react";

import { getAuditEntry } from "../api";
import type { AuditLog } from "../types";

export function useAuditEntry(id: string | null, created_at: string | null) {
  const [entry, setEntry] = useState<AuditLog | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id || !created_at) {
      setEntry(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void getAuditEntry(id, created_at).then((row) => {
      if (!cancelled) {
        setEntry(row);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id, created_at]);

  return { entry, loading };
}
