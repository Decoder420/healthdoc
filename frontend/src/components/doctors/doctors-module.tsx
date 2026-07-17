"use client";

import { useMemo, useState } from "react";
import type { DoctorProfile } from "@/features/doctors/types";
import { filterDoctors, getAllDoctors } from "@/features/doctors/api";
import { ROLES } from "@/config/roles";
import { useAuth } from "@/providers/auth-provider";
import { DoctorStats } from "@/components/doctors/doctor-stats";
import {
  DoctorFilters,
  type DoctorFilterState,
} from "@/components/doctors/doctor-filters";
import { DoctorList } from "@/components/doctors/doctor-list";
import { DoctorDetailPanel } from "@/components/doctors/doctor-detail-panel";
import { AddDoctorFlow } from "@/components/doctors/add-doctor-flow";

type ViewMode = "directory" | "add";

const defaultFilters: DoctorFilterState = {
  query: "",
  departmentId: "all",
  status: "all",
};

export function DoctorsModule() {
  const { user } = useAuth();
  const canManageDoctors = user?.role === ROLES.ADMIN;

  const [doctors, setDoctors] = useState<DoctorProfile[]>(() => getAllDoctors());
  const [filters, setFilters] = useState<DoctorFilterState>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("directory");

  const filteredDoctors = useMemo(
    () =>
      filterDoctors({
        query: filters.query,
        departmentId: filters.departmentId,
        status: filters.status,
      }),
    [filters, doctors],
  );

  const selectedDoctor =
    doctors.find((doctor) => doctor.id === selectedId) ?? null;

  function refreshDoctors(nextSelected?: DoctorProfile | null) {
    const latest = getAllDoctors();
    setDoctors(latest);
    if (nextSelected) {
      setSelectedId(nextSelected.id);
    }
  }

  if (view === "add" && canManageDoctors) {
    return (
      <AddDoctorFlow
        onCancel={() => setView("directory")}
        onCreated={(doctor) => {
          refreshDoctors(doctor);
          setView("directory");
          setSelectedId(doctor.id);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Doctors Module</p>
        <h1 className="text-2xl font-semibold text-foreground">
          {canManageDoctors ? "Doctor Management" : "Doctor Directory"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {canManageDoctors
            ? "Manage doctor profiles, departments, fees, and OPD availability."
            : "View doctor profiles, departments, fees, and OPD availability."}
        </p>
      </div>

      <DoctorStats doctors={doctors} />

      <DoctorFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(defaultFilters)}
        canAdd={canManageDoctors}
        onAddClick={
          canManageDoctors
            ? () => {
                setSelectedId(null);
                setView("add");
              }
            : undefined
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <DoctorList
          doctors={filteredDoctors}
          selectedId={selectedId}
          onSelect={(doctor) => setSelectedId(doctor.id)}
        />

        {selectedDoctor ? (
          <DoctorDetailPanel
            key={selectedDoctor.id}
            doctor={selectedDoctor}
            canEdit={canManageDoctors}
            onClose={() => setSelectedId(null)}
            onUpdated={(updated) => refreshDoctors(updated)}
          />
        ) : (
          <div className="surface-card flex min-h-64 items-center justify-center p-6 text-center text-sm text-muted-foreground">
            Select a doctor from the list to view profile, schedule, and fees.
          </div>
        )}
      </div>
    </div>
  );
}
