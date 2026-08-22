"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ModuleCapabilityGate } from "@/components/common/ModuleCapabilityGate";
import {
  collectLabSample,
  enterLabResult,
  getLabResultHistory,
  listLabWork,
  verifyLabResult,
} from "@/features/lab/api";
import type { LabOrderItem, LabResult } from "@/features/lab/types";
import { ApiError, formatDateTime } from "@/lib/api";

function StatusChip({ status }: { status: string }) {
  const tone =
    status === "released"
      ? "bg-success-muted text-success"
      : status === "completed"
        ? "bg-warning-muted text-warning"
        : status === "in_progress"
          ? "bg-info-muted text-info"
          : "bg-muted text-muted-foreground";
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${tone}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

function ResultHistory({ items }: { items: LabResult[] }) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-3">
      <h3 className="font-medium">Result history</h3>
      {items.map((result) => (
        <article key={result.id} className="rounded-md border border-border p-4 text-sm">
          <div className="flex flex-wrap justify-between gap-3">
            <strong>
              Version {result.version} · {result.status}
            </strong>
            <span className="text-muted-foreground">{formatDateTime(result.created_at)}</span>
          </div>
          <pre className="mt-3 overflow-x-auto rounded-md bg-muted p-3 text-xs">
            {JSON.stringify(result.result_data, null, 2)}
          </pre>
          {result.remarks ? <p className="mt-2">Remarks: {result.remarks}</p> : null}
          {result.tat_minutes != null ? (
            <p className="mt-1 text-muted-foreground">TAT: {result.tat_minutes} minutes</p>
          ) : null}
        </article>
      ))}
    </section>
  );
}

function LabPageContent() {
  const [rows, setRows] = useState<LabOrderItem[] | null>(null);
  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<LabResult[]>([]);
  const [barcode, setBarcode] = useState("");
  const [resultJson, setResultJson] = useState("{}\n");
  const [remarks, setRemarks] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const selected = useMemo(
    () => rows?.find((row) => row.id === selectedId) ?? null,
    [rows, selectedId],
  );

  const load = useCallback(async () => {
    try {
      const response = await listLabWork();
      setRows(response.items);
      setTotal(response.total);
      setError(null);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Failed to load lab worklist");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function loadHistory(item: LabOrderItem) {
    if (item.status === "placed" || item.status === "in_progress") {
      setHistory([]);
      return;
    }
    try {
      const response = await getLabResultHistory(item.id);
      setHistory(response.items);
    } catch (reason) {
      if (reason instanceof ApiError && reason.code === 404) {
        setHistory([]);
      } else {
        setError(reason instanceof Error ? reason.message : "Could not load result history");
      }
    }
  }

  function selectRow(item: LabOrderItem) {
    setSelectedId(item.id);
    setBarcode(item.barcode ?? "");
    setResultJson(
      item.test_name.toLowerCase().includes("hemoglobin")
        ? '{\n  "hemoglobin_g_dl": null\n}\n'
        : "{}\n",
    );
    setRemarks("");
    setMessage(null);
    setError(null);
    void loadHistory(item);
  }

  function updateRow(updated: LabOrderItem) {
    setRows((current) => current?.map((row) => (row.id === updated.id ? updated : row)) ?? []);
  }

  async function collectSample() {
    if (!selected || !barcode.trim()) {
      setError("Scan or enter a barcode before collecting the sample.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const updated = await collectLabSample(selected.id, barcode.trim());
      updateRow(updated);
      setMessage("Sample collected. Result entry is now available.");
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Sample collection failed");
    } finally {
      setBusy(false);
    }
  }

  async function enterResult() {
    if (!selected) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(resultJson);
    } catch {
      setError("Result data must be valid JSON.");
      return;
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      setError("Result data must be a JSON object.");
      return;
    }
    if (Object.keys(parsed).length === 0) {
      setError("Enter at least one result field.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await enterLabResult(
        selected.id,
        parsed as Record<string, unknown>,
        remarks,
      );
      setRows((current) =>
        current?.map((row) =>
          row.id === selected.id ? { ...row, status: "completed" } : row,
        ) ?? [],
      );
      setHistory([result]);
      setMessage(
        "Preliminary result saved. A different lab professional must verify and release it.",
      );
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Result entry failed");
    } finally {
      setBusy(false);
    }
  }

  async function verifyResult() {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      const verified = await verifyLabResult(selected.id);
      setRows((current) =>
        current?.map((row) =>
          row.id === selected.id ? { ...row, status: "released" } : row,
        ) ?? [],
      );
      setHistory((current) =>
        current.map((result) => (result.id === verified.id ? verified : result)),
      );
      setMessage("Result verified and released.");
    } catch (reason) {
      if (reason instanceof ApiError && reason.code === 403) {
        setError("Maker–checker blocked this action. Sign in as a different lab professional.");
      } else {
        setError(reason instanceof ApiError ? reason.message : "Verification failed");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Lab worklist</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows === null ? "Loading live orders…" : `${total} live order${total === 1 ? "" : "s"}`}
          </p>
        </div>
        <button type="button" className="text-sm underline" onClick={() => void load()}>
          Refresh
        </button>
      </div>

      {error ? (
        <p role="alert" className="rounded-md bg-danger-muted p-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="rounded-md bg-success-muted p-3 text-sm text-success">
          {message}
        </p>
      ) : null}

      {rows?.length === 0 ? (
        <section className="surface-card p-6 text-sm text-muted-foreground">
          No lab orders are waiting.
        </section>
      ) : null}

      {rows && rows.length > 0 ? (
        <div className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-muted">
                <tr>
                  {[
                    "Accession",
                    "Test",
                    "Sample",
                    "Barcode",
                    "Status",
                    "Ordered",
                    "",
                  ].map((label, index) => (
                    <th key={`${label}-${index}`} className="px-4 py-3 text-left">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-none">
                    <td className="px-4 py-3 font-mono">{row.accession_number}</td>
                    <td className="px-4 py-3 font-medium">{row.test_name}</td>
                    <td className="px-4 py-3">{row.sample_type}</td>
                    <td className="px-4 py-3">{row.barcode ?? "Not collected"}</td>
                    <td className="px-4 py-3">
                      <StatusChip status={row.status} />
                    </td>
                    <td className="px-4 py-3">{formatDateTime(row.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" className="underline" onClick={() => selectRow(row)}>
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {selected ? (
        <section className="surface-card space-y-5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-medium">{selected.test_name}</h2>
              <p className="text-sm text-muted-foreground">
                {selected.accession_number} · {selected.sample_type}
              </p>
            </div>
            <StatusChip status={selected.status} />
          </div>

          {selected.status === "placed" ? (
            <div className="space-y-3">
              <label className="block max-w-md space-y-1 text-sm">
                <span className="text-muted-foreground">Sample barcode</span>
                <input
                  className="w-full rounded-md border border-border px-3 py-2"
                  value={barcode}
                  onChange={(event) => setBarcode(event.target.value)}
                  placeholder="Scan or enter barcode"
                />
              </label>
              <button
                type="button"
                disabled={busy}
                onClick={() => void collectSample()}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {busy ? "Saving…" : "Confirm sample collection"}
              </button>
            </div>
          ) : null}

          {selected.status === "in_progress" ? (
            <div className="space-y-4">
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">Result data (JSON object)</span>
                <textarea
                  className="min-h-48 w-full rounded-md border border-border px-3 py-2 font-mono text-sm"
                  value={resultJson}
                  onChange={(event) => setResultJson(event.target.value)}
                  spellCheck={false}
                />
              </label>
              {selected.test_name.toLowerCase().includes("hemoglobin") ? (
                <p className="text-xs text-muted-foreground">
                  Use numeric field <code>hemoglobin_g_dl</code>; configured critical limits are
                  below 7.0 or above 20.0 g/dL. These limits still require clinical governance sign-off.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No test-specific result schema is configured. Enter only fields authorized by the
                  lab SOP; the server preserves the JSON exactly.
                </p>
              )}
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">Remarks</span>
                <textarea
                  className="min-h-20 w-full rounded-md border border-border px-3 py-2"
                  value={remarks}
                  onChange={(event) => setRemarks(event.target.value)}
                />
              </label>
              <button
                type="button"
                disabled={busy}
                onClick={() => void enterResult()}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {busy ? "Saving…" : "Save preliminary result"}
              </button>
            </div>
          ) : null}

          {selected.status === "completed" ? (
            <div className="space-y-3 rounded-md border border-warning bg-warning-muted p-4 text-sm">
              <p>
                This preliminary result needs independent verification. The user who entered it is
                blocked by the server from verifying it.
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => void verifyResult()}
                className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50"
              >
                {busy ? "Verifying…" : "Verify and release"}
              </button>
            </div>
          ) : null}

          {selected.status === "released" ? (
            <p className="rounded-md bg-success-muted p-3 text-sm text-success">
              Result verified and released.
            </p>
          ) : null}

          <ResultHistory items={history} />
        </section>
      ) : null}
    </div>
  );
}

export default function LabPage() {
  return (
    <ModuleCapabilityGate module="lab">
      <LabPageContent />
    </ModuleCapabilityGate>
  );
}
