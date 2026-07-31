"use client";

import { DispenseMedicine } from "@/features/pharmacy/types/types";

interface MedicationRowProps {
  medicine: DispenseMedicine;
  onDispenseQtyChange: (id: string, quantity: number) => void;
}

export default function MedicationRow({
  medicine,
  onDispenseQtyChange,
}: MedicationRowProps) {
  const statusStyles = {
    Available: "bg-green-100 text-green-700",
    Partial: "bg-yellow-100 text-yellow-700",
    "Out of Stock": "bg-red-100 text-red-700",
  };

  return (
    <tr className="border-b border-border hover:bg-muted/40">
      <td className="px-4 py-3 font-medium">
        {medicine.medicineName}
      </td>

      <td className="px-4 py-3 text-center">
        {medicine.prescribedQty}
      </td>

      <td className="px-4 py-3 text-center">
        {medicine.batchNumber}
      </td>

      <td className="px-4 py-3 text-center">
        {medicine.expiryDate}
      </td>

      <td className="px-4 py-3 text-center">
        {medicine.availableStock}
      </td>

      <td className="px-4 py-3 text-center">
       <input
  type="text"
  inputMode="numeric"
  value={medicine.dispenseQty.toString()}
  onFocus={(e) => e.target.select()}
  onChange={(e) => {
    const value = e.target.value;

    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    onDispenseQtyChange(
      medicine.id,
      value === "" ? 0 : Number(value)
    );
  }}
  className="w-20 rounded-md border border-input bg-background px-2 py-1 text-center"
/> 
      </td>

      <td className="px-4 py-3 text-center">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            statusStyles[medicine.status]
          }`}
        >
          {medicine.status}
        </span>
      </td>
    </tr>
  );
}