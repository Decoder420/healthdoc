"use client";

import { useState } from "react";

import MedicationRow from "./MedicationRow";

import { DispenseMedicine } from "@/features/pharmacy/types/types";
import { validateDispense } from "@/lib/utils/validateDispense";

interface MedicationTableProps {
  medicines: DispenseMedicine[];
  setMedicines: React.Dispatch<
    React.SetStateAction<DispenseMedicine[]>
  >;
}

export default function MedicationTable({
  medicines,
  setMedicines,
}: MedicationTableProps) {
  
  const handleDispenseQtyChange = (
  id: string,
  quantity: number
) => {
  setMedicines((prev) =>
    prev.map((medicine) => {
      if (medicine.id !== id) return medicine;

      return {
        ...medicine,
        dispenseQty: quantity,
        status: validateDispense(medicine, quantity),
      };
    })
  );
};

  return (
    <div className="surface-card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Medications
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Review stock availability and verify dispense quantities.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm">
                Medicine
              </th>

              <th className="px-4 py-3 text-center text-sm">
                Prescribed Qty
              </th>

              <th className="px-4 py-3 text-center text-sm">
                FEFO Batch
              </th>

              <th className="px-4 py-3 text-center text-sm">
                Expiry Date
              </th>

              <th className="px-4 py-3 text-center text-sm">
                Available Stock
              </th>

              <th className="px-4 py-3 text-center text-sm">
                Dispense Qty
              </th>

              <th className="px-4 py-3 text-center text-sm">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((medicine) => (
              <MedicationRow
                key={medicine.id}
                medicine={medicine}
                onDispenseQtyChange={
                  handleDispenseQtyChange
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}