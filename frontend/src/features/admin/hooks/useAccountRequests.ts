"use client";

import { useCallback, useEffect, useState } from "react";

import { listAccountRequests } from "../api";
import type { ApprovalStatus, UserAccountRequest } from "../types";

export function useAccountRequests(initialStatus: ApprovalStatus | "all" = "pending") {
  const [status, setStatus] = useState<ApprovalStatus | "all">(initialStatus);
  const [items, setItems] = useState<UserAccountRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listAccountRequests({ status });
      setItems(res.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, loading, error, status, setStatus, refresh };
}
