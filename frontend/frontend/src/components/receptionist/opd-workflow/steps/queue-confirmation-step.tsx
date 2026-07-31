"use client";

import type { OpdVisit } from "@/features/opd/types";
import { Button } from "@/components/ui/button";
import { InfoCard } from "@/components/receptionist/opd-workflow/form-controls";

type QueueConfirmationStepProps = {
  visit: OpdVisit;
  onStartNew: () => void;
};

export function QueueConfirmationStep({
  visit,
  onStartNew,
}: QueueConfirmationStepProps) {
  return (
    <div className="space-y-6">
      <div className="surface-card border-success/30 bg-success-muted/30 p-6">
        <h2 className="text-xl font-semibold text-success">Patient Added to Queue</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The patient has been successfully added to {visit.doctorName}&apos;s OPD queue.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="UHID">
          <p className="font-sans font-semibold text-primary">{visit.uhid}</p>
        </InfoCard>
        <InfoCard title="OPD ID">
          <p className="font-sans font-semibold text-foreground">{visit.opdId}</p>
        </InfoCard>
        <InfoCard title="Token">
          <p className="font-sans text-2xl font-bold text-primary">{visit.tokenNumber}</p>
        </InfoCard>
        <InfoCard title="Doctor Queue">
          <p className="font-sans text-sm text-foreground">
            {visit.doctorName} · {visit.department}
          </p>
        </InfoCard>
      </div>

      <Button type="button" onClick={onStartNew}>
        Register Next Patient
      </Button>
    </div>
  );
}
