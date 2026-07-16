"use client";

import type { DoctorProfile, DoctorStatus } from "@/features/doctors/types";
import { Button } from "@/components/ui/button";

type DoctorListProps = {
  doctors: DoctorProfile[];
  selectedId?: string | null;
  onSelect: (doctor: DoctorProfile) => void;
};

function statusLabel(status: DoctorStatus) {
  if (status === "on_leave") return "On Leave";
  if (status === "inactive") return "Inactive";
  return "Active";
}

function statusClass(status: DoctorStatus) {
  if (status === "on_leave") return "text-amber-700 dark:text-amber-300";
  if (status === "inactive") return "text-muted-foreground";
  return "text-emerald-700 dark:text-emerald-300";
}

export function DoctorList({ doctors, selectedId, onSelect }: DoctorListProps) {
  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">Doctors</h2>
        <p className="text-xs text-muted-foreground">
          {doctors.length} profile{doctors.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Employee ID</th>
              <th className="px-5 py-3 font-medium">Doctor</th>
              <th className="px-5 py-3 font-medium">Department</th>
              <th className="px-5 py-3 font-medium">Fee</th>
              <th className="px-5 py-3 font-medium">Availability</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {doctors.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  No doctors match the current filters.
                </td>
              </tr>
            ) : (
              doctors.map((doctor) => {
                const isSelected = selectedId === doctor.id;
                return (
                  <tr
                    key={doctor.id}
                    className={isSelected ? "bg-accent/40" : "hover:bg-muted/40"}
                  >
                    <td className="px-5 py-3.5 font-semibold text-primary">
                      {doctor.employeeId}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-semibold text-primary">
                          {doctor.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={doctor.photo}
                              alt={doctor.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            doctor.name.replace(/^Dr\.\s*/i, "").charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{doctor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doctor.specialization}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-foreground">
                      <p>{doctor.department}</p>
                      <p className="text-xs text-muted-foreground">
                        {doctor.departmentCode}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-foreground">
                      ₹{doctor.consultationFee}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      <p>{doctor.availability.days.join(", ")}</p>
                      <p className="text-xs">
                        {doctor.availability.startTime} – {doctor.availability.endTime}
                      </p>
                    </td>
                    <td className={`px-5 py-3.5 font-medium ${statusClass(doctor.status)}`}>
                      {statusLabel(doctor.status)}
                    </td>
                    <td className="px-5 py-3.5">
                      <Button
                        type="button"
                        variant={isSelected ? "primary" : "outline"}
                        size="sm"
                        onClick={() => onSelect(doctor)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
