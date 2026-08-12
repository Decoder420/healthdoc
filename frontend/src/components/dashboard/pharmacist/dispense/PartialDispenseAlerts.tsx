"use client";

import { AlertTriangle } from "lucide-react";

import type {
  DispenseMedicine,
} from "@/features/pharmacy/types/types";

interface PartialDispenseAlertsProps {
  medicines: DispenseMedicine[];
}

export default function PartialDispenseAlerts({
  medicines,
}: PartialDispenseAlertsProps) {
  /*
   * Show medicines where the available FEFO stock
   * cannot satisfy the complete prescription.
   */
  const partialMedicines = medicines.filter(
    (medicine) =>
      medicine.availableStock < medicine.prescribedQty &&
      medicine.availableStock > 0
  );

  const outOfStockMedicines = medicines.filter(
    (medicine) =>
      medicine.availableStock === 0 &&
      medicine.prescribedQty > 0
  );

  if (
    partialMedicines.length === 0 &&
    outOfStockMedicines.length === 0
  ) {
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
          Dispense Alerts
        </h2>
      </div>

      <p className="mb-5 text-sm text-muted-foreground">
        Some medicines cannot be completely dispensed because
        sufficient stock is not available.
      </p>

      <div className="space-y-4">
        {partialMedicines.map((medicine) => {
          const remaining =
            medicine.prescribedQty -
            medicine.availableStock;

          return (
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
                    Shortage
                  </p>

                  <p className="font-medium text-red-600">
                    {remaining}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {outOfStockMedicines.map((medicine) => (
          <div
            key={medicine.id}
            className="rounded-lg border border-red-200 bg-red-50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">
                {medicine.medicineName}
              </h3>

              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                Out of Stock
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
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

                <p className="font-medium text-red-600">
                  0
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}