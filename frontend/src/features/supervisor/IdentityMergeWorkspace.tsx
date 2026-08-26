"use client";

import { useState, type FormEvent } from "react";

import {
  approveThidPromotion,
  requestThidPromotion,
  unmergeThidPromotion,
  type PromotionLog,
} from "@/features/emergency/api";
import { ApiError } from "@/lib/api";

type Tab = "request" | "approve" | "unmerge";

function errorMessage(reason: unknown): string {
  if (reason instanceof ApiError) {
    const code =
      reason.payload &&
      typeof reason.payload === "object" &&
      "code" in reason.payload
        ? String((reason.payload as { code?: string }).code)
        : undefined;
    if (code === "self_approval_not_allowed") {
      return "Maker–checker: the supervisor who requested cannot also approve.";
    }
    if (code === "self_unmerge_not_allowed") {
      return "Maker–checker: the supervisor who approved cannot also unmerge.";
    }
    if (code === "patient_not_thid") {
      return "This patient is not on the THID path — only temporary emergency charts can be promoted.";
    }
    if (code === "promotion_already_pending") {
      return "A promotion is already pending for this patient.";
    }
    return reason.message;
  }
  return "Request failed";
}

function ResultCard({ log }: { log: PromotionLog }) {
  return (
    <div className="surface-card space-y-2 border border-success p-4" aria-live="polite">
      <p className="text-sm text-muted-foreground">Merge log</p>
      <p className="break-all font-mono text-sm font-semibold">{log.id}</p>
      <p className="text-sm">
        Status: <span className="font-medium">{log.status}</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Patient <span className="font-mono">{log.source_patient_id}</span>
      </p>
      {log.status === "pending" ? (
        <p className="text-sm text-muted-foreground">
          Hand this merge log ID to a different supervisor to approve.
        </p>
      ) : null}
      {log.status === "approved" ? (
        <p className="text-sm text-muted-foreground">
          UHID assigned. A third supervisor (not the approver) can unmerge if needed.
        </p>
      ) : null}
    </div>
  );
}

export function IdentityMergeWorkspace() {
  const [tab, setTab] = useState<Tab>("request");
  const [patientId, setPatientId] = useState("");
  const [mergeLogId, setMergeLogId] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastLog, setLastLog] = useState<PromotionLog | null>(null);

  function resetFeedback() {
    setError(null);
    setLastLog(null);
  }

  async function onRequest(event: FormEvent) {
    event.preventDefault();
    const id = patientId.trim();
    if (!id) return;
    setBusy(true);
    resetFeedback();
    try {
      const log = await requestThidPromotion(id, reason);
      setLastLog(log);
      setMergeLogId(log.id);
    } catch (reasonCaught) {
      setError(errorMessage(reasonCaught));
    } finally {
      setBusy(false);
    }
  }

  async function onApprove(event: FormEvent) {
    event.preventDefault();
    const id = mergeLogId.trim();
    if (!id) return;
    setBusy(true);
    resetFeedback();
    try {
      setLastLog(await approveThidPromotion(id));
    } catch (reasonCaught) {
      setError(errorMessage(reasonCaught));
    } finally {
      setBusy(false);
    }
  }

  async function onUnmerge(event: FormEvent) {
    event.preventDefault();
    const id = mergeLogId.trim();
    if (!id) return;
    setBusy(true);
    resetFeedback();
    try {
      setLastLog(await unmergeThidPromotion(id, reason));
    } catch (reasonCaught) {
      setError(errorMessage(reasonCaught));
    } finally {
      setBusy(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "request", label: "1. Request promote" },
    { id: "approve", label: "2. Approve" },
    { id: "unmerge", label: "3. Unmerge" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold">Identity merges</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Supervisor records authority (#221): THID→UHID promotion with
          maker–checker confirm. Request and approve must be different people;
          unmerge must not be the approver. Superadmin cannot run this flow.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Merge steps">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              tab === item.id
                ? "bg-primary text-primary-foreground"
                : "border border-border"
            }`}
            onClick={() => {
              setTab(item.id);
              resetFeedback();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error ? (
        <p role="alert" className="rounded-md bg-danger-muted p-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      {lastLog ? <ResultCard log={lastLog} /> : null}

      {tab === "request" ? (
        <form onSubmit={onRequest} className="surface-card space-y-4 p-6">
          <h2 className="text-lg font-medium">Request THID→UHID promotion</h2>
          <p className="text-sm text-muted-foreground">
            Paste the patient ID from emergency registration. Only charts on the
            THID identity path can be promoted. Patient search is
            receptionist/admin only — supervisors use this ID.
          </p>
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Patient ID</span>
            <input
              className="w-full rounded-md border border-border px-3 py-2 font-mono text-sm"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
              autoComplete="off"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Reason (optional)</span>
            <input
              className="w-full rounded-md border border-border px-3 py-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={busy || !patientId.trim()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Requesting…" : "Request promotion"}
          </button>
        </form>
      ) : null}

      {tab === "approve" ? (
        <form onSubmit={onApprove} className="surface-card space-y-4 p-6">
          <h2 className="text-lg font-medium">Approve pending promotion</h2>
          <p className="text-sm text-muted-foreground">
            Must be a different supervisor from the requester. Assigns the UHID.
          </p>
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Merge log ID</span>
            <input
              className="w-full rounded-md border border-border px-3 py-2 font-mono text-sm"
              value={mergeLogId}
              onChange={(e) => setMergeLogId(e.target.value)}
              required
              autoComplete="off"
            />
          </label>
          <button
            type="submit"
            disabled={busy || !mergeLogId.trim()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Approving…" : "Confirm and assign UHID"}
          </button>
        </form>
      ) : null}

      {tab === "unmerge" ? (
        <form onSubmit={onUnmerge} className="surface-card space-y-4 p-6">
          <h2 className="text-lg font-medium">Unmerge approved promotion</h2>
          <p className="text-sm text-muted-foreground">
            Clears the UHID and returns the chart to THID. Cannot be the same
            supervisor who approved.
          </p>
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Merge log ID</span>
            <input
              className="w-full rounded-md border border-border px-3 py-2 font-mono text-sm"
              value={mergeLogId}
              onChange={(e) => setMergeLogId(e.target.value)}
              required
              autoComplete="off"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Unmerge reason</span>
            <input
              className="w-full rounded-md border border-border px-3 py-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={busy || !mergeLogId.trim()}
            className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {busy ? "Unmerging…" : "Unmerge promotion"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
