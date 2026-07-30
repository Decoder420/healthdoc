"use client";

import { Monitor, Eye, Wrench } from "lucide-react";
import {
  RADIOLOGY_MACHINES,
  RADIOLOGY_TECHNICIANS,
} from "@/features/inventory/radiology-data";

const machines = RADIOLOGY_MACHINES.map((machine, index) => {
  const statusMap = {
    Online: "Available",
    Offline: "Busy",
    Maintenance: "Maintenance",
    Calibration: "Maintenance",
  } as const;

  return {
    machine: machine.name,
    type: machine.modality,
    status: statusMap[machine.status],
    technician: RADIOLOGY_TECHNICIANS[index % RADIOLOGY_TECHNICIANS.length].name,
    lastMaintenance: machine.nextService,
    nextMaintenance: machine.nextService,
    utilization: `${machine.utilization}%`,
  };
});

export default function MachineAvailabilityTable() {
  return (
    <div className="surface-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Machine Availability
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Live status of radiology equipment
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted">
            <tr>
              {[
                "Machine",
                "Type",
                "Status",
                "Technician",
                "Last Maintenance",
                "Next Maintenance",
                "Utilization",
                "Action",
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left font-semibold text-muted-foreground"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {machines.map((machine) => (
              <tr
                key={machine.machine}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                      <Monitor
                        size={18}
                        className="text-primary"
                      />
                    </div>

                    <span className="font-medium text-foreground">
                      {machine.machine}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-foreground">
                  {machine.type}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      machine.status === "Available"
                        ? "bg-success-muted text-success"
                        : machine.status === "Busy"
                        ? "bg-warning-muted text-warning"
                        : "bg-danger-muted text-danger"
                    }`}
                  >
                    {machine.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-foreground">
                  {machine.technician}
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {machine.lastMaintenance}
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {machine.nextMaintenance}
                </td>

                <td className="px-6 py-4 font-semibold text-primary">
                  {machine.utilization}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      className="btn btn-outline btn-icon"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      className="btn btn-outline btn-icon"
                      title="Maintenance"
                    >
                      <Wrench size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}