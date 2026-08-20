"use client";

import { useEffect, useState } from "react";

import AdmissionForm from "@/features/ipd/AdmissionForm";
import DischargeForm from "@/features/ipd/DischargeForm";
import AddPatientMovementForm from "@/components/AddPatientMovementForm";

import { useAddAdmission, useAddDischarge, useCurrentUser } from "@/features/ipd/hooks";
import { useAddPatientMovement } from "@/components/AddPatientMovementForm";
import {
  getWards,
  getBeds,
  getActiveAdmissions,
  getDischarges,
  type Admission,
  type Discharge,
} from "@/features/ipd/services/ipd.service";
import { MODULE_LABELS } from "@/features/ipd/DischargeForm/constants";
import type { TargetModule } from "@/features/ipd/DischargeForm/DischargeForm.types";

import type { Ward } from "@/features/nurse/components/WardSelector/WardSelector.types";
import type { Bed } from "@/components/BedGrid/BedGrid.types";

// TEMPORARY — mock data for local testing while backend endpoints aren't
// live yet. Adjust these import paths to wherever your mock files actually
// live, then flip USE_MOCK_DATA to false once /wards, /beds, /admissions
// are real. Remove this whole block (and MOCK_ADMISSIONS) when done.
import { beds as MOCK_BEDS } from "@/lib/data/beds";
import { WARDS as MOCK_WARDS } from "@/lib/data/wardSelector";
import { MOCK_ADMISSIONS } from "@/lib/data/mockAdmissions";
import { MOCK_DISCHARGES } from "@/lib/data/mockDischarges";
const USE_MOCK_DATA = true;

// Static preview: all modules always get notified on discharge, all start
// 'queued' (discharge_notifications default, migration 0026). No
// per-admission preview endpoint is documented, so this is a fixed list.
const DEFAULT_NOTIFICATION_PREVIEW = (Object.keys(MODULE_LABELS) as TargetModule[]).map(
  (mod) => ({ target_module: mod, status: "queued" as const })
);

type Tab = "dashboard" | "admit" | "transfer" | "discharge";

export default function IpdPage() {
  const [tab, setTab] = useState<Tab>("dashboard");

  const [wards, setWards] = useState<Ward[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [discharges, setDischarges] = useState<Discharge[]>([]);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState("");

  const { submitAdmission, isSubmitting: isAdmitting } = useAddAdmission();
  const { submitDischarge, isSubmitting: isDischarging } = useAddDischarge();
  const { submitPatientMovement, isSubmitting: isTransferring } = useAddPatientMovement();
  const { userId } = useCurrentUser(); // stub until auth/session wiring exists

  const loadData = async () => {
    if (USE_MOCK_DATA) {
      setWards(MOCK_WARDS as unknown as Ward[]);
      setBeds(MOCK_BEDS as unknown as Bed[]);
      setAdmissions(MOCK_ADMISSIONS);
      setDischarges(MOCK_DISCHARGES);
      return;
    }

    const [wardsRes, bedsRes, admissionsRes, dischargesRes] = await Promise.all([
      getWards(),
      getBeds(),
      getActiveAdmissions(),
      getDischarges(),
    ]);
    // adjust unwrapping (e.g. `.data`) to match your api() helper's actual return shape
    setWards(wardsRes as unknown as Ward[]);
    setBeds(bedsRes as unknown as Bed[]);
    setAdmissions(admissionsRes as unknown as Admission[]);
    setDischarges(dischargesRes as unknown as Discharge[]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedAdmission = admissions.find((a) => a.id === selectedAdmissionId);

  // KPIs per Architecture doc §24 (Reports and MIS): "IPD admissions/
  // discharges/bed occupancy".
  const activeAdmissionsCount = admissions.filter((a) => a.status === "admitted").length;

  const bedStatusCounts = beds.reduce<Record<string, number>>((acc, bed) => {
    acc[bed.status] = (acc[bed.status] ?? 0) + 1;
    return acc;
  }, {});

  const today = new Date().toDateString();
  const dischargesTodayCount = discharges.filter(
    (d) => new Date(d.discharged_at).toDateString() === today
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">IPD</h1>
        <p className="mt-2 text-muted-foreground">
          Admit patients, record in-hospital ward/bed transfers, or discharge
          (including transfer to another facility).
        </p>
      </div>

      <div className="flex gap-2 border-b">
        {(["dashboard", "admit", "transfer", "discharge"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            {t === "transfer" ? "Ward transfer" : t === "admit" ? "Admit" : t === "discharge" ? "Discharge" : "Dashboard"}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="surface-card p-4">
            <p className="text-sm text-muted-foreground">Active Admissions</p>
            <p className="mt-1 text-2xl font-bold">{activeAdmissionsCount}</p>
          </div>

          <div className="surface-card p-4">
            <p className="text-sm text-muted-foreground">Bed Status</p>
            <p className="mt-1 text-sm">
              {(["vacant", "occupied", "reserved", "maintenance"] as const).map(
                (status) => (
                  <span key={status} className="mr-3">
                    {status}: <strong>{bedStatusCounts[status] ?? 0}</strong>
                  </span>
                )
              )}
            </p>
          </div>

          <div className="surface-card p-4">
            <p className="text-sm text-muted-foreground">Discharges Today</p>
            <p className="mt-1 text-2xl font-bold">{dischargesTodayCount}</p>
          </div>
        </div>
      )}

      {tab === "admit" && (
        <AdmissionForm
          wards={wards}
          beds={beds}
          isSubmitting={isAdmitting}
          onSubmit={async (data) => {
            const ok = await submitAdmission(data);
            if (ok) await loadData();
            return ok;
          }}
        />
      )}

      {(tab === "transfer" || tab === "discharge") && (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Select Admission
            </label>
            <select
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={selectedAdmissionId}
              onChange={(e) => setSelectedAdmissionId(e.target.value)}
            >
              <option value="">Select…</option>
              {admissions.map((a) => {
                const bed = beds.find((b) => b.id === a.bed_id);
                return (
                  <option key={a.id} value={a.id}>
                    {a.patient_id} — Bed {bed?.bed_number ?? a.bed_id}
                  </option>
                );
              })}
            </select>
          </div>

          {selectedAdmission && tab === "transfer" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                In-hospital ward or bed move. To send the patient to another
                facility, use Discharge with type Transferred to Another Facility.
              </p>
            <AddPatientMovementForm
              admissionId={selectedAdmission.id}
              currentWardId={selectedAdmission.ward_id}
              currentBedId={selectedAdmission.bed_id}
              wards={wards}
              beds={beds}
              movedBy={userId} // stub — swap to real auth id when available
              isSubmitting={isTransferring}
              onSubmit={async (data) => {
                const ok = await submitPatientMovement(data);
                if (ok) {
                  setSelectedAdmissionId("");
                  await loadData();
                }
                return ok;
              }}
            />
            </div>
          )}

          {selectedAdmission && tab === "discharge" && (
            <DischargeForm
              admissionId={selectedAdmission.id}
              notificationPreview={DEFAULT_NOTIFICATION_PREVIEW}
              isSubmitting={isDischarging}
              onSubmit={async (data) => {
                const ok = await submitDischarge(data);
                if (ok) {
                  setSelectedAdmissionId("");
                  await loadData();
                }
                return ok;
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
