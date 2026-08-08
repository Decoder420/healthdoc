"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { toast } from "@/components/ui/toast";
import {
  acknowledgeResult,
  getAcknowledgements,
  getLabResults,
  getRadiologyReports,
  listResultsWorklist,
} from "../api";
import { MOCK_PROVIDER_NAME, MOCK_PROVIDER_USER_ID } from "../constants";
import type {
  LabResult,
  RadiologyReport,
  ResultAcknowledgement,
  ResultWorklistItem,
} from "../types";

export type ResultsFilter = "all" | "unread" | "critical";

/**
 * Owns the results worklist and the currently opened result.
 *
 * A selected item loads every version (corrections are new rows, never edits),
 * and the viewer defaults to the current one.
 */
export function useResults() {
  const [items, setItems] = useState<ResultWorklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ResultsFilter>("all");

  const [selected, setSelected] = useState<ResultWorklistItem | null>(null);
  const [labVersions, setLabVersions] = useState<LabResult[]>([]);
  const [radVersions, setRadVersions] = useState<RadiologyReport[]>([]);
  const [viewingVersion, setViewingVersion] = useState<number | null>(null);
  const [acks, setAcks] = useState<ResultAcknowledgement[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    let alive = true;
    listResultsWorklist()
      .then((rows) => alive && setItems(rows))
      .catch((e) => alive && setError(e instanceof Error ? e.message : "Failed to load results"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const visible = useMemo(() => {
    if (filter === "critical") return items.filter((i) => i.has_critical);
    if (filter === "unread") return items.filter((i) => i.result_status && !i.acknowledged_at);
    return items;
  }, [items, filter]);

  const counts = useMemo(
    () => ({
      total: items.length,
      unread: items.filter((i) => i.result_status && !i.acknowledged_at).length,
      critical: items.filter((i) => i.has_critical).length,
    }),
    [items],
  );

  const select = useCallback(async (item: ResultWorklistItem) => {
    setSelected(item);
    setLabVersions([]);
    setRadVersions([]);
    setAcks([]);
    setViewingVersion(null);

    if (!item.result_status) return; // nothing reported yet

    setDetailLoading(true);
    try {
      if (item.order_type === "lab") {
        const rows = await getLabResults(item.id);
        setLabVersions(rows);
        const current = rows.find((r) => r.is_current) ?? rows[0];
        setViewingVersion(current?.version ?? null);
        if (current) setAcks(await getAcknowledgements({ lab_result_id: current.id }));
      } else {
        const rows = await getRadiologyReports(item.id);
        setRadVersions(rows);
        const current = rows.find((r) => r.is_current) ?? rows[0];
        setViewingVersion(current?.version ?? null);
        if (current) setAcks(await getAcknowledgements({ radiology_report_id: current.id }));
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load result");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const labResult = useMemo(
    () => labVersions.find((r) => r.version === viewingVersion) ?? null,
    [labVersions, viewingVersion],
  );
  const radReport = useMemo(
    () => radVersions.find((r) => r.version === viewingVersion) ?? null,
    [radVersions, viewingVersion],
  );

  /** Sign-off applies to the current version only — you cannot sign a superseded one. */
  const currentVersion = useMemo(() => {
    const current = labVersions.find((r) => r.is_current) ?? radVersions.find((r) => r.is_current);
    return current?.version ?? null;
  }, [labVersions, radVersions]);

  const viewingIsCurrent = viewingVersion !== null && viewingVersion === currentVersion;
  const alreadySigned = acks.length > 0;

  const sign = useCallback(
    async (note?: string) => {
      const target = labVersions.find((r) => r.is_current) ?? radVersions.find((r) => r.is_current);
      if (!target || !selected) return;

      setSigning(true);
      try {
        const ack = await acknowledgeResult({
          lab_result_id: selected.order_type === "lab" ? target.id : undefined,
          radiology_report_id: selected.order_type === "radiology" ? target.id : undefined,
          reviewed_by: MOCK_PROVIDER_USER_ID,
          reviewed_by_name: MOCK_PROVIDER_NAME,
          note,
        });
        setAcks((prev) => [...prev, ack]);
        setItems((prev) =>
          prev.map((i) => (i.id === selected.id ? { ...i, acknowledged_at: ack.reviewed_at } : i)),
        );
        setSelected((prev) => (prev ? { ...prev, acknowledged_at: ack.reviewed_at } : prev));
        toast.success("Result signed off");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to sign off");
      } finally {
        setSigning(false);
      }
    },
    [labVersions, radVersions, selected],
  );

  return {
    items: visible,
    counts,
    loading,
    error,
    filter,
    setFilter,
    selected,
    select,
    detailLoading,
    labResult,
    radReport,
    labVersions,
    radVersions,
    viewingVersion,
    setViewingVersion,
    viewingIsCurrent,
    acks,
    alreadySigned,
    signing,
    sign,
  };
}
