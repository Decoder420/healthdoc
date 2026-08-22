"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, newIdempotencyKey } from "@/lib/api";

import { createVisit, issueToken, listQueues } from "./api";
import type { Patient, QueueSummary, QueueToken } from "./types";

/**
 * Register → visit → token, the rest of the OPD entry point.
 *
 * Registration alone was a dead end: a UHID and nothing else. A visit is what
 * puts the patient into the billing chain (its registration invoice is raised
 * in the same server transaction) and a token is what puts them in front of a
 * doctor.
 */
export function StartVisit({ patient }: { patient: Patient }) {
  const [queues, setQueues] = useState<QueueSummary[] | null>(null);
  const [queueId, setQueueId] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<QueueToken | null>(null);
  const [visitNumber, setVisitNumber] = useState<string | null>(null);

  // One key per patient, for the same reason the registration form holds one:
  // a retried click must replay the visit, not open a second one and bill a
  // second registration fee.
  const visitKey = useMemo(() => newIdempotencyKey(), []);
  const tokenKey = useMemo(() => newIdempotencyKey(), []);

  useEffect(() => {
    let cancelled = false;
    listQueues()
      .then((rows) => {
        if (cancelled) return;
        setQueues(rows);
        // Shortest queue first from the server, so the first row is the
        // sensible default — but it stays changeable.
        if (rows.length > 0) setQueueId(rows[0].id);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof ApiError ? reason.message : "Could not load queues");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function start() {
    if (!queueId) return;
    setBusy(true);
    setError(null);
    try {
      const visit = await createVisit(
        {
          patient_id: patient.id,
          visit_type: "opd",
          visit_date: new Date().toISOString(),
        },
        visitKey,
      );
      setVisitNumber(visit.visit_number);

      const issued = await issueToken({ queue_id: queueId, visit_id: visit.id }, tokenKey);
      setToken(issued);
    } catch (reason) {
      setError(
        reason instanceof ApiError
          ? reason.message
          : "Could not start the visit. Reload before retrying.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (token) {
    return (
      <div className="surface-card space-y-3 p-8 text-center">
        <p className="text-sm text-muted-foreground">Token issued</p>
        <p className="font-mono text-5xl font-bold">{token.token_display}</p>
        <p className="text-sm text-muted-foreground">
          {patient.full_name} · {patient.uhid ?? patient.thid}
        </p>
        {visitNumber && (
          <p className="text-xs text-muted-foreground">Visit {visitNumber}</p>
        )}
      </div>
    );
  }

  return (
    <div className="surface-card space-y-4 p-6">
      <h3 className="text-base font-medium">Start OPD visit</h3>

      {queues === null && !error && (
        <p className="text-sm text-muted-foreground">Loading today&apos;s queues…</p>
      )}

      {queues !== null && queues.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No open queues today. A queue has to be opened for a doctor before
          tokens can be issued.
        </p>
      )}

      {queues !== null && queues.length > 0 && (
        <>
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Doctor</span>
            <select
              className="w-full rounded-md border border-border px-3 py-2"
              value={queueId}
              onChange={(e) => setQueueId(e.target.value)}
            >
              {queues.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.doctor_name ?? "Doctor"}
                  {q.room_number ? ` · Room ${q.room_number}` : ""}
                  {` · ${q.waiting_count} waiting`}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => void start()}
            disabled={busy || !queueId}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {busy ? "Starting…" : "Create visit and issue token"}
          </button>
        </>
      )}

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default StartVisit;
