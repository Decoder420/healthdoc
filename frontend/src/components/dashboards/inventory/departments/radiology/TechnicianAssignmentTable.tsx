"use client";

import { UserRound, Phone, CalendarDays } from "lucide-react";
import { RADIOLOGY_TECHNICIANS } from "@/features/inventory/radiology-data";

const technicians = RADIOLOGY_TECHNICIANS.map((tech, index) => ({
  name: tech.name,
  machine: tech.assignedMachine,
  shift: tech.shift,
  status:
    index % 5 === 0 ? "On Leave" : index % 3 === 0 ? "Busy" : "Available",
  phone: `+91 98${String(70000000 + index).slice(0, 8)}`,
}));

export default function TechnicianAssignmentTable() {
  return (
    <div className="surface-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Technician Assignment
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Assigned technicians and current shifts
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                Technician
              </th>

              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                Machine
              </th>

              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                Shift
              </th>

              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                Status
              </th>

              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                Contact
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {technicians.map((tech) => {
              const badgeClass =
                tech.status === "Available"
                  ? "bg-success-muted text-success"
                  : tech.status === "Busy"
                  ? "bg-warning-muted text-warning"
                  : "bg-danger-muted text-danger";

              return (
                <tr
                  key={tech.phone}
                  className="transition-colors hover:bg-muted/50"
                >
                  {/* Technician */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                        <UserRound
                          size={18}
                          className="text-primary"
                        />
                      </div>

                      <span className="font-medium text-foreground">
                        {tech.name}
                      </span>
                    </div>
                  </td>

                  {/* Machine */}
                  <td className="px-6 py-4 text-foreground">
                    {tech.machine}
                  </td>

                  {/* Shift */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays
                        size={16}
                        className="text-primary"
                      />

                      <span>{tech.shift}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                    >
                      {tech.status}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone
                        size={16}
                        className="text-primary"
                      />

                      <span>{tech.phone}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}