"use client";

import { useEffect, useState } from "react";

import { getConsent } from "../api";
import type { ConsentRecord } from "../types";

export function useConsentDetail(id: string | null) {
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setRecord(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void getConsent(id).then((row) => {
      if (!cancelled) {
        setRecord(row);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { record, loading };
}
