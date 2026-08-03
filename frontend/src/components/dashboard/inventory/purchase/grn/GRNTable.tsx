
"use client";

import {
  Eye,
  PackageCheck,
} from "lucide-react";

import type { GRN } from "@/features/inventory/types/grn";

interface Props {
  grns: GRN[];
  onView: (grn: GRN) => void;
  onInspect?: (grn: GRN) => void;
}

export default function GRNTable({
  grns,
  onView,
  onInspect,
}: Props) {
  if (grns.length === 0) {
    return (
      <div className="surface-card p-10 text-center">
        <PackageCheck
          size={32}
          className="mx-auto text-muted-foreground"
        />

        <p className="mt-3 font-medium">
          No GRNs found
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Goods Receipt Notes will appear here once goods are received.
        </p>
      </div>
    );
  }

  const getStatusClass = (status: GRN["status"]) => {
    switch (String(status)) {
      case "Accepted":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Pending Inspection":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border p-5">
        <div>
          <h3 className="font-semibold">
            Goods Receipt Notes
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            View goods received against purchase orders.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold">
                GRN Number
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold">
                PO Number
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold">
                Supplier
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold">
                Department
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold">
                Items
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold">
                Received Qty
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold">
                Received Date
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {grns.map((grn) => (
              <tr
                key={grn.id}
                className="border-b border-border last:border-0 hover:bg-muted/20"
              >
                {/* GRN NUMBER */}
                <td className="px-5 py-4">
                  <p className="text-sm font-medium">
                    {grn.grnNumber}
                  </p>
                </td>

                {/* PO NUMBER */}
                <td className="px-5 py-4">
                  <p className="text-sm">
                    {grn.poNumber}
                  </p>
                </td>

                {/* SUPPLIER */}
                <td className="px-5 py-4">
                  <p className="text-sm">
                    {grn.supplierName}
                  </p>
                </td>

                {/* DEPARTMENT */}
                <td className="px-5 py-4">
                  <p className="text-sm">
                    {grn.departmentName}
                  </p>
                </td>

                {/* ITEMS */}
                <td className="px-5 py-4 text-center text-sm">
                  {grn.totalItems}
                </td>

                {/* RECEIVED QUANTITY */}
                <td className="px-5 py-4 text-center text-sm font-medium">
                  {grn.totalReceivedQuantity}
                </td>

                {/* RECEIVED DATE */}
                <td className="px-5 py-4 text-sm">
                  {grn.receivedDate}
                </td>

                {/* STATUS */}
                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      grn.status
                    )}`}
                  >
                    {grn.status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(grn)}
                      className="rounded-md border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      title="View GRN"
                    >
                      <Eye size={16} />
                    </button>

                    {grn.status === "Pending Inspection" &&
                      onInspect && (
                        <button
                          type="button"
                          onClick={() => onInspect(grn)}
                          className="rounded-md border border-primary/20 bg-primary/10 p-2 text-primary transition hover:bg-primary/20"
                          title="Inspect GRN"
                        >
                          <PackageCheck size={16} />
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

