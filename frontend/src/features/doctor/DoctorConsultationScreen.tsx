"use client";

import { DoctorQueuePanel } from "@/components/receptionist/opd-workflow/doctor-queue-panel";
import { FeatureStub } from "@/features/_shared/FeatureStub";

export function DoctorConsultationScreen() {
  return (
    <div className="space-y-6">
      <FeatureStub
        title="Consultation workspace"
        description="Live consultation notes and vitals will appear here."
      />
      <DoctorQueuePanel />
    </div>
  );
}
