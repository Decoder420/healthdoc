"use client";

import {
  Eye,
  Download,
  Printer,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { DispenseHistoryItem } from "@/features/pharmacy/types/types";

interface Props {
  item: DispenseHistoryItem;
}

export default function HistoryRow({ item }: Props) {
  const router = useRouter();

  const getStatusStyle = () => {
    switch (item.status) {
      case "Downloaded":
        return "bg-blue-100 text-blue-700";

      case "Printed":
        return "bg-green-100 text-green-700";

      case "Reprinted":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <tr className="border-b border-border hover:bg-muted/40 transition-colors">
      <td className="px-5 py-4 font-medium">
        {item.receiptNo}
      </td>

      <td className="px-5 py-4">
        {item.patientName}
      </td>

      <td className="px-5 py-4">
        {item.uhid}
      </td>

      <td className="px-5 py-4">
        {item.prescriptionNo}
      </td>

      <td className="px-5 py-4 text-center">
        {item.medicines}
      </td>

      <td className="px-5 py-4">
        {item.pharmacist}
      </td>

      <td className="px-5 py-4">
        {item.dispenseDate}
      </td>

      <td className="px-5 py-4 text-center">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle()}`}
        >
          {item.status}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center justify-center gap-2">
          <button
            className="btn btn-outline p-2"
            title="View Receipt"
            onClick={() =>
                router.push(`/pharmacy/receipt/preview?receipt=${item.receiptNo}`)
            }
          >
            <Eye size={16} />
         

        </button>
        </div>
      </td>
    </tr>
  );
}