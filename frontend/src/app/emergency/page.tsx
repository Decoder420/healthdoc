"use client";

import { useState } from "react";

import {
  registerEmergencyPatient,
  type EmergencyPatient,
  type EmergencyPatientInput,
} from "@/features/emergency/api";
import { ApiError } from "@/lib/api";

const initial: EmergencyPatientInput = {
  full_name: "",
  sex: "unknown",
  age_years: 0,
  mobile: "",
};

export default function Page() {
  const [form, setForm] = useState<EmergencyPatientInput>(initial);
  const [created, setCreated] = useState<EmergencyPatient | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const patient = await registerEmergencyPatient({
        ...form,
        full_name: form.full_name?.trim() || undefined,
        mobile: form.mobile?.trim() || undefined,
      });
      setCreated(patient);
      setForm(initial);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Emergency registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold">Emergency registration</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Issue a temporary hospital identity (THID) immediately. Unknown patients can be promoted
          to a UHID later through the supervisor maker–checker workflow.
        </p>
      </div>

      {error ? (
        <p role="alert" className="rounded-md bg-danger-muted p-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      {created ? (
        <section className="surface-card border border-success p-6" aria-live="polite">
          <p className="text-sm text-muted-foreground">Temporary identity issued</p>
          <p className="mt-2 font-mono text-2xl font-semibold">{created.thid}</p>
          <p className="mt-2">{created.full_name} · estimated age {created.age_years}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Patient ID <span className="font-mono">{created.id}</span>
          </p>
          <button type="button" className="mt-4 underline" onClick={() => setCreated(null)}>
            Register another patient
          </button>
        </section>
      ) : (
        <form onSubmit={submit} className="surface-card space-y-5 p-6">
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Name (leave blank if unknown)</span>
            <input
              className="w-full rounded-md border border-border px-3 py-2"
              value={form.full_name ?? ""}
              onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Sex</span>
              <select
                className="w-full rounded-md border border-border px-3 py-2"
                value={form.sex}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sex: event.target.value as EmergencyPatientInput["sex"],
                  }))
                }
              >
                <option value="unknown">Unknown</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Estimated age (years)</span>
              <input
                type="number"
                min="0"
                max="150"
                required
                className="w-full rounded-md border border-border px-3 py-2"
                value={form.age_years}
                onChange={(event) =>
                  setForm((current) => ({ ...current, age_years: Number(event.target.value) }))
                }
              />
            </label>
          </div>
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Mobile (optional)</span>
            <input
              type="tel"
              className="w-full rounded-md border border-border px-3 py-2"
              value={form.mobile ?? ""}
              onChange={(event) => setForm((current) => ({ ...current, mobile: event.target.value }))}
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Issuing THID…" : "Register and issue THID"}
          </button>
        </form>
      )}
    </div>
  );
}
