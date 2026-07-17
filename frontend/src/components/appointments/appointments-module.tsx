"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Appointment } from "@/features/appointments/types";
import {
  filterAppointments,
  getAllAppointments,
} from "@/features/appointments/api";
import { todayIsoDate } from "@/features/appointments/data/mock-appointments";
import { AppointmentStats } from "@/components/appointments/appointment-stats";
import {
  AppointmentFilters,
  type AppointmentFilterState,
} from "@/components/appointments/appointment-filters";
import { AppointmentList } from "@/components/appointments/appointment-list";
import { AppointmentDetailPanel } from "@/components/appointments/appointment-detail-panel";
import { BookAppointmentFlow } from "@/components/appointments/book-appointment-flow";

type ViewMode = "directory" | "book";

const defaultFilters: AppointmentFilterState = {
  query: "",
  date: todayIsoDate(),
  doctorId: "all",
  departmentId: "all",
  status: "all",
  type: "all",
};

export function AppointmentsModule() {
  const searchParams = useSearchParams();
  const initialBook = searchParams.get("action") === "book";

  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    getAllAppointments(),
  );
  const [filters, setFilters] = useState<AppointmentFilterState>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>(initialBook ? "book" : "directory");

  const filteredAppointments = useMemo(
    () =>
      filterAppointments({
        query: filters.query,
        date: filters.date,
        doctorId: filters.doctorId,
        departmentId: filters.departmentId,
        status: filters.status,
        type: filters.type,
      }),
    [filters, appointments],
  );

  const selectedAppointment =
    appointments.find((item) => item.id === selectedId) ?? null;

  function refreshAppointments(nextSelected?: Appointment | null) {
    const latest = getAllAppointments();
    setAppointments(latest);
    if (nextSelected) {
      setSelectedId(nextSelected.id);
    }
  }

  if (view === "book") {
    return (
      <BookAppointmentFlow
        onCancel={() => setView("directory")}
        onBooked={(appointment) => {
          refreshAppointments(appointment);
          setFilters({
            ...defaultFilters,
            date: appointment.date,
          });
          setView("directory");
          setSelectedId(appointment.id);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Appointments Module</p>
        <h1 className="text-2xl font-semibold text-foreground">
          Appointment Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Book visits, manage schedules, check patients in, and update visit status.
        </p>
      </div>

      <AppointmentStats appointments={appointments} />

      <AppointmentFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(defaultFilters)}
        onBookClick={() => {
          setSelectedId(null);
          setView("book");
        }}
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <AppointmentList
          appointments={filteredAppointments}
          selectedId={selectedId}
          onSelect={(appointment) => setSelectedId(appointment.id)}
        />

        {selectedAppointment ? (
          <AppointmentDetailPanel
            key={selectedAppointment.id}
            appointment={selectedAppointment}
            onClose={() => setSelectedId(null)}
            onUpdated={(updated) => refreshAppointments(updated)}
          />
        ) : (
          <div className="surface-card flex min-h-64 items-center justify-center p-6 text-center text-sm text-muted-foreground">
            Select an appointment to view details, reschedule, or update status.
          </div>
        )}
      </div>
    </div>
  );
}
