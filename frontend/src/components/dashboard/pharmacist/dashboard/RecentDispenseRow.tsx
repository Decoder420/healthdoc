"use client";

import { Eye } from "lucide-react";

import { RecentDispense } from "@/features/pharmacy/types/dashboard";

interface Props {
  dispense: RecentDispense;
}

export default function RecentDispenseRow({
  dispense,
}: Props) {
  return (
    <tr className="border-b border-border hover:bg-muted/40">
      <td className="px-4 py-3 font-medium">
        {dispense.receiptNumber}
      </td>

      <td className="px-4 py-3">
        {dispense.patientName}
      </td>

      <td className="px-4 py-3 text-center">
        {dispense.medicines}
      </td>

      <td className="px-4 py-3">
        {dispense.dispensedBy}
      </td>

      <td className="px-4 py-3 text-center">
        {dispense.dispensedAt}
      </td>

      <td className="px-4 py-3 text-center">
        <button
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
        >
          <Eye className="h-4 w-4" />
          View
        </button>
      </td>
    </tr>
  );
}