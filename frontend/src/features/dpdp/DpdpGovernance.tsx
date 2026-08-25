"use client";

/**
 * DPDP governance: the DPO, the grievance register, consent managers.
 *
 * All three tables have existed since migration 0022a and nothing could read or
 * write any of them. That matters more than an ordinary gap: the Act requires a
 * data fiduciary to HAVE a named, published DPO and a working grievance
 * mechanism, and a schema carrying those tables reads — to an assessor, or to
 * the next engineer — as though the hospital has them.
 *
 * The screen's job is to make the true state visible, including when the true
 * state is "nobody has been appointed".
 */
import { useCallback, useEffect, useState } from "react";

import { listUsers } from "@/features/admin/api/users";
import type { User } from "@/features/admin/types";
import { useCurrentUser } from "@/features/session/useCurrentUser";
import { ApiError } from "@/lib/api";

import {
  appointDpo,
  deactivateDpo,
  getActiveDpo,
  listConsentManagers,
  listDpoHistory,
  listGrievances,
  registerConsentManager,
  transitionGrievance,
  updateConsentManager,
} from "./api";
import type { ConsentManager, Dpo, Grievance, GrievanceStatus } from "./types";

type TransitionOption = { value: GrievanceStatus; label: string };

/** Mirrors the backend state machine in app/dpdp/service.py.
 *
 * This is intentionally keyed by the CURRENT status. Rendering every status
 * except the current one offered buttons the server correctly rejected with
 * `illegal_grievance_transition` — a screen that loaded cleanly but failed as
 * soon as its primary controls were used.
 */
const NEXT_STATUS: Record<GrievanceStatus, readonly TransitionOption[]> = {
  pending: [
    { value: "under_review", label: "Take under review" },
    { value: "escalated_dpb", label: "Escalate to the Data Protection Board" },
  ],
  under_review: [
    { value: "resolved", label: "Resolve" },
    { value: "escalated_dpb", label: "Escalate to the Data Protection Board" },
  ],
  escalated_dpb: [{ value: "resolved", label: "Resolve" }],
  resolved: [{ value: "closed", label: "Close" }],
  closed: [],
};

function statusTone(status: string): string {
  if (status === "resolved" || status === "closed") return "bg-green-100 text-green-800";
  if (status === "escalated_dpb") return "bg-red-100 text-red-800";
  if (status === "under_review") return "bg-blue-100 text-blue-800";
  return "bg-amber-100 text-amber-900";
}

/** Overdue is a fact about the SLA, not a styling choice. */
function isOverdue(grievance: Grievance): boolean {
  if (grievance.status === "resolved" || grievance.status === "closed") return false;
  return new Date(grievance.due_at).getTime() < Date.now();
}

export function DpdpGovernance() {
  const { user, loading: sessionLoading } = useCurrentUser();
  const isAdmin = (user?.roles ?? []).includes("admin");

  const [dpo, setDpo] = useState<Dpo | null>(null);
  const [dpoMissing, setDpoMissing] = useState(false);
  const [history, setHistory] = useState<Dpo[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [managers, setManagers] = useState<ConsentManager[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [appointee, setAppointee] = useState("");
  const [publishContact, setPublishContact] = useState(false);
  const [contact, setContact] = useState("");

  const [cmRegistrationId, setCmRegistrationId] = useState("");
  const [cmName, setCmName] = useState("");
  const [cmEndpoint, setCmEndpoint] = useState("");

  const load = useCallback(async () => {
    if (sessionLoading) return;
    try {
      // The DPO read 404s when none has ever been appointed. That is an ANSWER,
      // not an error — handled separately so it does not poison the rest of the
      // screen, and surfaced as a warning rather than swallowed.
      const dpoResult = await getActiveDpo().catch((reason) => {
        // ApiError carries `code`, not `status` — see lib/api.ts.
        if (reason instanceof ApiError && reason.code === 404) {
          setDpoMissing(true);
          return null;
        }
        throw reason;
      });

      const [historyResult, grievanceResult, managerResult, staffPage] = await Promise.all([
        listDpoHistory(),
        listGrievances(),
        listConsentManagers(),
        // GET /users is admin-only. Auditors can read this governance screen,
        // but granting them the facility staff directory just to turn a UUID
        // into a label would widen their access for a cosmetic convenience.
        isAdmin ? listUsers({ page_size: 100 }) : Promise.resolve(null),
      ]);

      setDpo(dpoResult);
      if (dpoResult) setDpoMissing(false);
      setHistory(historyResult);
      setGrievances(grievanceResult);
      setManagers(managerResult);
      setStaff(staffPage?.items ?? []);
      setError(null);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Could not load DPDP governance");
    }
  }, [isAdmin, sessionLoading]);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (fn: () => Promise<unknown>, failure: string) => {
    setBusy(true);
    try {
      await fn();
      await load();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : failure);
    } finally {
      setBusy(false);
    }
  };

  const submitAppointment = () =>
    act(
      () =>
        appointDpo({
          user_id: appointee,
          // Recorded when there is a sitting DPO, so succession is a handover
          // rather than the previous appointment quietly disappearing.
          replaces_dpo_id: dpo?.id ?? null,
          contact_published: publishContact,
          published_contact: publishContact ? contact.trim() : null,
        }).then(() => {
          setAppointee("");
          setContact("");
          setPublishContact(false);
        }),
      "Could not appoint the DPO",
    );

  const nameOf = (userId: string) =>
    staff.find((candidate) => candidate.id === userId)?.full_name ?? userId;

  const submitTransition = (
    grievance: Grievance,
    target: GrievanceStatus,
  ): void => {
    let resolution: string | null = null;
    let escalationReason: string | null = null;

    if (target === "resolved") {
      const entered = window.prompt("How was this resolved?");
      if (entered === null) return;
      resolution = entered.trim();
      if (!resolution) {
        setError("A resolution is required before a grievance can be resolved.");
        return;
      }
    }

    if (target === "escalated_dpb") {
      const entered = window.prompt("Why is this being escalated?");
      if (entered === null) return;
      escalationReason = entered.trim();
      if (!escalationReason) {
        setError("An escalation reason is required before sending a grievance to the Board.");
        return;
      }
    }

    void act(
      () =>
        transitionGrievance(grievance.id, {
          status: target,
          resolution,
          escalation_reason: escalationReason,
          assigned_to: null,
        }),
      "Could not update the grievance",
    );
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold">Data protection governance</h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          The DPDP Act requires a data fiduciary to name a data protection
          officer, publish a way to reach them, and operate a grievance
          mechanism. This is where those obligations are recorded.
        </p>
      </div>

      {error ? (
        <p role="alert" className="rounded-md bg-danger-muted p-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      {/* ------------------------------------------------------------ DPO */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Data protection officer</h2>

        {dpoMissing ? (
          <p className="rounded border border-warning p-3 text-sm">
            <strong>No data protection officer has been appointed.</strong> The
            Act requires one. Until an appointment is recorded here, a patient
            has no published contact for a data-protection concern.
          </p>
        ) : null}

        {dpo ? (
          <div className="rounded border border-border p-4 text-sm">
            <p className="font-medium">{nameOf(dpo.user_id)}</p>
            <p className="mt-1 text-muted-foreground">
              Appointed {new Date(dpo.appointed_at).toLocaleDateString()}
            </p>
            {dpo.contact_published ? (
              <p className="mt-1">Published contact: {dpo.published_contact}</p>
            ) : (
              <p className="mt-1 text-warning">
                Contact is not published — a DPO a patient cannot reach satisfies
                the appointment but not the obligation.
              </p>
            )}
            {isAdmin ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void act(() => deactivateDpo(dpo.id), "Could not stand the DPO down")}
                className="mt-3 rounded border border-gray-300 px-3 py-1 text-xs disabled:opacity-50"
              >
                Stand down
              </button>
            ) : null}
          </div>
        ) : null}

        {isAdmin ? (
          <div className="rounded border border-border p-4">
            <h3 className="text-base font-semibold">
              {dpo ? "Appoint a successor" : "Appoint a DPO"}
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                <span className="block text-muted-foreground">Officer</span>
                <select
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                  value={appointee}
                  onChange={(e) => setAppointee(e.target.value)}
                >
                  <option value="">Select a member of staff…</option>
                  {staff.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.full_name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="block text-muted-foreground">
                  Published contact
                </span>
                <input
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                  placeholder="dpo@hospital.example / phone"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  disabled={!publishContact}
                />
              </label>
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={publishContact}
                onChange={(e) => {
                  setPublishContact(e.target.checked);
                  if (!e.target.checked) setContact("");
                }}
              />
              {/* The server refuses both halves of the mismatch, so the form
                  keeps them in step rather than letting a 422 explain it. */}
              Publish this contact to data principals
            </label>
            <button
              type="button"
              disabled={busy || !appointee || (publishContact && !contact.trim())}
              onClick={() => void submitAppointment()}
              className="mt-4 rounded bg-blue-700 px-4 py-2 text-sm text-white disabled:bg-gray-300"
            >
              {dpo ? "Appoint successor" : "Appoint"}
            </button>
          </div>
        ) : null}

        {history.length > 1 ? (
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground">
              Appointment history ({history.length})
            </summary>
            <ul className="mt-2 space-y-1">
              {history.map((entry) => (
                <li key={entry.id} className="text-muted-foreground">
                  {nameOf(entry.user_id)} — appointed{" "}
                  {new Date(entry.appointed_at).toLocaleDateString()}
                  {entry.is_active ? " · current" : ""}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>

      {/* ----------------------------------------------------- grievances */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Grievance register ({grievances.length})</h2>
        {grievances.length === 0 ? (
          <p className="text-sm text-muted-foreground">No grievances recorded.</p>
        ) : (
          <ul className="space-y-2">
            {grievances.map((grievance) => (
              <li
                key={grievance.id}
                className={`rounded border p-3 text-sm ${
                  isOverdue(grievance) ? "border-danger" : "border-border"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-medium">{grievance.grievance_number}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {grievance.grievance_type.replace("_", " ")}
                    </span>
                  </div>
                  <span className={`rounded px-2 py-0.5 text-xs ${statusTone(grievance.status)}`}>
                    {grievance.status.replace("_", " ")}
                  </span>
                </div>

                <p className="mt-1">{grievance.description}</p>

                <p className={`mt-1 text-xs ${isOverdue(grievance) ? "text-danger" : "text-muted-foreground"}`}>
                  Due {new Date(grievance.due_at).toLocaleString()}
                  {isOverdue(grievance) ? " — past its response deadline" : ""}
                </p>

                {grievance.resolution ? (
                  <p className="mt-1 text-muted-foreground">
                    Resolution: {grievance.resolution}
                  </p>
                ) : null}

                {NEXT_STATUS[grievance.status].length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {NEXT_STATUS[grievance.status].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          disabled={busy}
                          onClick={() => submitTransition(grievance, option.value)}
                          className="rounded border border-gray-300 px-3 py-1 text-xs disabled:opacity-50"
                        >
                          {option.label}
                        </button>
                      ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ----------------------------------------------- consent managers */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Consent managers ({managers.length})</h2>
        <p className="text-sm text-muted-foreground">
          Registered under DPDP Rules 2025. `consent_records.consent_manager_id`
          points at these.
        </p>

        {managers.length === 0 ? (
          <p className="text-sm text-muted-foreground">None registered.</p>
        ) : (
          <ul className="space-y-2">
            {managers.map((manager) => (
              <li key={manager.id} className="rounded border border-border p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-medium">{manager.name}</span>
                    <span className="text-muted-foreground"> · {manager.cm_registration_id}</span>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      manager.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {manager.is_active ? "active" : "inactive"}
                  </span>
                </div>
                {manager.endpoint_url ? (
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {manager.endpoint_url}
                  </p>
                ) : null}
                {isAdmin ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void act(
                        () =>
                          updateConsentManager(manager.id, { is_active: !manager.is_active }),
                        "Could not update the consent manager",
                      )
                    }
                    className="mt-2 rounded border border-gray-300 px-3 py-1 text-xs disabled:opacity-50"
                  >
                    {manager.is_active ? "Deactivate" : "Reactivate"}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {isAdmin ? (
          <div className="rounded border border-border p-4">
            <h3 className="text-base font-semibold">Register a consent manager</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <label className="text-sm">
                <span className="block text-muted-foreground">Registration id</span>
                <input
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                  value={cmRegistrationId}
                  onChange={(e) => setCmRegistrationId(e.target.value)}
                />
              </label>
              <label className="text-sm">
                <span className="block text-muted-foreground">Name</span>
                <input
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                  value={cmName}
                  onChange={(e) => setCmName(e.target.value)}
                />
              </label>
              <label className="text-sm">
                <span className="block text-muted-foreground">Endpoint URL</span>
                <input
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                  placeholder="https://…"
                  value={cmEndpoint}
                  onChange={(e) => setCmEndpoint(e.target.value)}
                />
              </label>
            </div>
            <button
              type="button"
              disabled={busy || !cmRegistrationId.trim() || !cmName.trim()}
              onClick={() =>
                void act(
                  () =>
                    registerConsentManager({
                      cm_registration_id: cmRegistrationId.trim(),
                      name: cmName.trim(),
                      endpoint_url: cmEndpoint.trim() || null,
                    }).then(() => {
                      setCmRegistrationId("");
                      setCmName("");
                      setCmEndpoint("");
                    }),
                  "Could not register the consent manager",
                )
              }
              className="mt-4 rounded bg-blue-700 px-4 py-2 text-sm text-white disabled:bg-gray-300"
            >
              Register
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
