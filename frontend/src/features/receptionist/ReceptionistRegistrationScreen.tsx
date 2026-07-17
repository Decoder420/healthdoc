"use client";

import { OpdRegistrationWizard } from "@/components/receptionist/opd-workflow";
import { DoctorQueuePanel } from "@/components/receptionist/opd-workflow/doctor-queue-panel";

export function ReceptionistRegistrationScreen() {
  return (
    <div className="space-y-8">
      <OpdRegistrationWizard />
      <DoctorQueuePanel />
    </div>
  );
}
