"use client";

import { AlertTriangle } from "lucide-react";
import { DispenseMedicine } from "@/features/pharmacy/types/types";

interface PartialDispenseAlertsProps {
  medicines: DispenseMedicine[];
}

export default function PartialDispenseAlerts({
  medicines,
}: PartialDispenseAlertsProps) {
  const partialMedicines = medicines.filter(
    (medicine) => medicine.availableStock < medicine.prescribedQty
  );

  if (partialMedicines.length === 0) {
    return null;
  }

  return (
    <div className="surface-card border-l-4 border-l-yellow-500 p-6">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle
          className="text-yellow-500"
          size={22}
        />

        <h2 className="text-lg font-semibold">
          Partial Dispense Alerts
        </h2>
      </div>

      <p className="mb-5 text-sm text-muted-foreground">
        The following medicines do not have sufficient stock for full
        dispensing.
      </p>

      <div className="space-y-4">
        {partialMedicines.map((medicine) => (
          <div
            key={medicine.id}
            className="rounded-lg border border-border bg-muted p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">
                {medicine.medicineName}
              </h3>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                Partial
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-mono text-muted-foreground">
                  Required
                </p>

                <p className="font-medium">
                  {medicine.prescribedQty}
                </p>
              </div>

              <div>
                <p className="font-mono text-muted-foreground">
                  Available
                </p>

                <p className="font-medium">
                  {medicine.availableStock}
                </p>
              </div>

              <div>
                <p className="font-mono text-muted-foreground">
                  Remaining
                </p>

                <p className="font-medium text-red-600">
                  {medicine.prescribedQty -
                    medicine.availableStock}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}