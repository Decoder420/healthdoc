"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getConsent } from "../api";
import type { ConsentRecord } from "../types";

export function useConsentDetail(id: string | null) {
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const idRef = useRef(id);
  idRef.current = id;

  const load = useCallback(async () => {
    const current = idRef.current;
    if (!current) {
      setRecord(null);
      return;
    }
    setLoading(true);
    const row = await getConsent(current);
    if (idRef.current === current) {
      setRecord(row);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [id, load]);

  return { record, loading, refresh: load };
}
