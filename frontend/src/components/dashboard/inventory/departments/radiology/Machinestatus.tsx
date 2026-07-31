"use client";

import {
  CheckCircle2,
  Wrench,
  Clock3,
} from "lucide-react";

const machines = [
  {
    name: "CT Scanner",
    room: "CT Room 1",
    status: "Available",
    icon: CheckCircle2,
  },
  {
    name: "MRI Scanner",
    room: "MRI Room",
    status: "Maintenance",
    icon: Wrench,
  },
  {
    name: "Digital X-Ray",
    room: "Radiology Room 2",
    status: "Running",
    icon: CheckCircle2,
  },
  {
    name: "Portable X-Ray",
    room: "Emergency",
    status: "In Use",
    icon: Clock3,
  },
];

export default function MachineStatus() {
  return (
    <div className="surface-card p-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Machine Status
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Current operational status of radiology equipment
        </p>
      </div>

      {/* Machine List */}
      <div className="mt-6 space-y-4">
        {machines.map((machine) => {
          const Icon = machine.icon;

          const badgeClass =
            machine.status === "Available" ||
            machine.status === "Running"
              ? "bg-success-muted text-success"
              : machine.status === "In Use"
              ? "bg-warning-muted text-warning"
              : "bg-danger-muted text-danger";

          return (
            <div
              key={machine.name}
              className="flex items-center justify-between rounded-lg border border-border bg-muted p-4"
            >
              <div>
                <h3 className="font-medium text-foreground">
                  {machine.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {machine.room}
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
              >
                <Icon size={14} />
                {machine.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}