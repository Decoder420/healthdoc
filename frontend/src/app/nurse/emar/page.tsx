"use client";

import { useEffect, useState } from "react";

import { ApiError, api, formatDateTime } from "@/lib/api";
import EMARTable from "@/components/tables/EMARTable";
import type { MedicationRecord } from "@/components/tables/EMARTable";

interface Admission {
  id: string;
  visit_id: string;
  patient_id: string;
  ward_id: string;
  bed_id: string;
  admitted_at: string;
  reason: string | null;
  status: string;
}

/**
 * eMAR (#193).
 *
 * Scoped to an admission, matching
 * `GET /nursing/admissions/{admission_id}/medication-administrations` — an eMAR
 * belongs to a stay, not to a patient. The same person readmitted next month
 * starts a new sheet, and merging the two would put doses from two admissions
 * on one chart.
 */
export default function Page() {
  const [admissions, setAdmissions] = useState<Admission[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [records, setRecords] = useState<MedicationRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<Admission[]>("/admissions")
      .then((rows) => {
        if (cancelled) return;
        const active = rows.filter((a) => a.status === "admitted");
        setAdmissions(active);
        setSelected((current) => current ?? active[0]?.id ?? null);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof ApiError ? reason.message : "Could not load admissions");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    setRecords(null);
    api<MedicationRecord[]>(`/nursing/admissions/${selected}/medication-administrations`)
      .then((rows) => {
        if (!cancelled) setRecords(rows);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof ApiError ? reason.message : "Could not load the eMAR");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">eMAR</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every dose given, held or refused for one admission.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      {admissions !== null && admissions.length === 0 && (
        <div className="surface-card p-6">
          <p className="text-sm text-muted-foreground">No active admissions.</p>
        </div>
      )}

      {admissions && admissions.length > 0 && (
        <label className="block max-w-md space-y-1 text-sm">
          <span className="text-muted-foreground">Admission</span>
          <select
            className="w-full rounded-md border border-border px-3 py-2"
            value={selected ?? ""}
            onChange={(e) => setSelected(e.target.value)}
          >
            {admissions.map((admission) => (
              <option key={admission.id} value={admission.id}>
                {formatDateTime(admission.admitted_at)} ·{" "}
                {admission.reason ?? "admission"}
              </option>
            ))}
          </select>
        </label>
      )}

      {selected && records === null && !error && (
        <p className="text-sm text-muted-foreground">Loading eMAR…</p>
      )}

      {records && <EMARTable medications={records} />}
    </div>
  );
}
