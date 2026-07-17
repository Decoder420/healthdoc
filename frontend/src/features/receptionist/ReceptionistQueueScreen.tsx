"use client";

import { DoctorQueuePanel } from "@/components/receptionist/opd-workflow/doctor-queue-panel";

export function ReceptionistQueueScreen() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Front desk</p>
        <h1 className="text-2xl font-semibold text-foreground">OPD Queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live queue of patients waiting for consultation after check-in.
        </p>
      </div>
      <DoctorQueuePanel />
    </div>
  );
}
