"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Patient } from "@/features/patients/types";
import { filterPatients, getAllPatients } from "@/features/patients/api";
import { PatientStats } from "@/components/patients/patient-stats";
import {
  PatientFilters,
  type PatientFilterState,
} from "@/components/patients/patient-filters";
import { PatientList } from "@/components/patients/patient-list";
import { PatientDetailPanel } from "@/components/patients/patient-detail-panel";
import { RegisterPatientFlow } from "@/components/patients/register-patient-flow";

type ViewMode = "directory" | "register";

const defaultFilters: PatientFilterState = {
  query: "",
  gender: "all",
  hasAbha: "all",
};

export function PatientsModule() {
  const searchParams = useSearchParams();
  const initialRegister = searchParams.get("action") === "register";

  const [patients, setPatients] = useState<Patient[]>(() => getAllPatients());
  const [filters, setFilters] = useState<PatientFilterState>(defaultFilters);
  const [selectedUhid, setSelectedUhid] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>(
    initialRegister ? "register" : "directory",
  );

  const filteredPatients = useMemo(
    () =>
      filterPatients({
        query: filters.query,
        gender: filters.gender,
        hasAbha: filters.hasAbha,
      }),
    [filters, patients],
  );

  const selectedPatient =
    patients.find((patient) => patient.uhid === selectedUhid) ?? null;

  function refreshPatients(nextSelected?: Patient | null) {
    const latest = getAllPatients();
    setPatients(latest);
    if (nextSelected) {
      setSelectedUhid(nextSelected.uhid);
    }
  }

  if (view === "register") {
    return (
      <RegisterPatientFlow
        onCancel={() => setView("directory")}
        onRegistered={(patient) => {
          refreshPatients(patient);
          setView("directory");
          setSelectedUhid(patient.uhid);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Patients Module</p>
        <h1 className="text-2xl font-semibold text-foreground">Patient Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search, view, update profiles, create ABHA, and register new patients.
        </p>
      </div>

      <PatientStats patients={patients} />

      <PatientFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(defaultFilters)}
        onRegisterClick={() => {
          setSelectedUhid(null);
          setView("register");
        }}
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <PatientList
          patients={filteredPatients}
          selectedUhid={selectedUhid}
          onSelect={(patient) => setSelectedUhid(patient.uhid)}
        />

        {selectedPatient ? (
          <PatientDetailPanel
            key={selectedPatient.uhid}
            patient={selectedPatient}
            onClose={() => setSelectedUhid(null)}
            onUpdated={(updated) => refreshPatients(updated)}
          />
        ) : (
          <div className="surface-card flex min-h-64 items-center justify-center p-6 text-center text-sm text-muted-foreground">
            Select a patient from the list to view full profile details.
          </div>
        )}
      </div>
    </div>
  );
}
