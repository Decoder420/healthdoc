"use client";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import type { DispenseMedicine } from "@/features/pharmacy/types/types";

interface MedicationTableProps {
  medicines: DispenseMedicine[];
  setMedicines: Dispatch<SetStateAction<DispenseMedicine[]>>;
}

export default function MedicationTable({
  medicines,
  setMedicines,
}: MedicationTableProps) {
  const handleQuantityChange = (
    medicineId: string,
    value: string
  ) => {
    const quantity = Number(value);

    setMedicines((prev) =>
      prev.map((medicine) => {
        if (medicine.id !== medicineId) {
          return medicine;
        }

        /*
         * Don't allow negative values.
         */
        const safeQuantity = Math.max(0, quantity);

        /*
         * Maximum allowed quantity is the smaller of:
         *
         * 1. Prescribed quantity
         * 2. Available FEFO batch stock
         */
        const maxQuantity = Math.min(
          medicine.prescribedQty,
          medicine.availableStock
        );

        const dispenseQty = Math.min(
          safeQuantity,
          maxQuantity
        );

        /*
         * Determine medicine status.
         */
        let status: DispenseMedicine["status"];

        if (medicine.availableStock === 0) {
          status = "Out of Stock";
        } else if (dispenseQty < medicine.prescribedQty) {
          status = "Partial";
        } else {
          status = "Available";
        }

        return {
          ...medicine,
          dispenseQty,
          status,
        };
      })
    );
  };

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Medication Dispensing
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            FEFO batch is automatically selected based on
            earliest expiry.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-border bg-muted">
            <tr className="text-left">
              <th className="px-5 py-4">
                Medicine
              </th>

              <th className="px-5 py-4 text-center">
                Prescribed
              </th>

              <th className="px-5 py-4">
                FEFO Batch
              </th>

              <th className="px-5 py-4">
                Expiry
              </th>

              <th className="px-5 py-4 text-center">
                Available
              </th>

              <th className="px-5 py-4 text-center">
                Dispense Qty
              </th>

              <th className="px-5 py-4">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((medicine) => {
              const isOutOfStock =
                medicine.availableStock === 0;

              const isPartial =
                !isOutOfStock &&
                medicine.dispenseQty <
                  medicine.prescribedQty;

              return (
                <tr
                  key={medicine.id}
                  className="border-b border-border transition-colors hover:bg-muted/40"
                >
                  {/* Medicine */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {medicine.medicineName}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        ID: {medicine.id}
                      </p>
                    </div>
                  </td>

                  {/* Prescribed */}
                  <td className="px-5 py-4 text-center font-medium">
                    {medicine.prescribedQty}
                  </td>

                  {/* FEFO Batch */}
                  <td className="px-5 py-4">
                    {medicine.batchNumber ? (
                      <span className="font-medium">
                        {medicine.batchNumber}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        —
                      </span>
                    )}
                  </td>

                  {/* Expiry */}
                  <td className="px-5 py-4">
                    {medicine.expiryDate ? (
                      medicine.expiryDate
                    ) : (
                      <span className="text-muted-foreground">
                        —
                      </span>
                    )}
                  </td>

                  {/* Available */}
                  <td className="px-5 py-4 text-center">
                    <span
                      className={
                        medicine.availableStock === 0
                          ? "font-semibold text-red-600"
                          : "font-medium"
                      }
                    >
                      {medicine.availableStock}
                    </span>
                  </td>

                  {/* Dispense Quantity */}
                  <td className="px-5 py-4">
                    <div className="flex justify-center">
                      <input
                        type="number"
                        min={0}
                        max={Math.min(
                          medicine.prescribedQty,
                          medicine.availableStock
                        )}
                        value={medicine.dispenseQty}
                        disabled={isOutOfStock}
                        onChange={(event) =>
                          handleQuantityChange(
                            medicine.id,
                            event.target.value
                          )
                        }
                        className="w-24 rounded-md border border-border bg-background px-3 py-2 text-center outline-none focus:border-[#001F54] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                      />
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    {isOutOfStock ? (
                      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                        Out of Stock
                      </span>
                    ) : isPartial ? (
                      <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                        Partial
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Full
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {medicines.length === 0 && (
        <div className="px-5 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No medicines found for this prescription.
          </p>
        </div>
      )}
    </div>
  );
}