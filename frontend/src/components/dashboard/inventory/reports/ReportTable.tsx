"use client";

import type { InventoryReportRow } from "@/features/inventory/types/report";

interface Props {
  rows: InventoryReportRow[];
  emptyMessage?: string;
}

export default function ReportTable({
  rows,
  emptyMessage = "No report data available.",
}: Props) {
  if (rows.length === 0) {
    return (
      <div className="surface-card flex min-h-[250px] items-center justify-center p-8 text-center">
        <div>
          <h2 className="text-lg font-semibold">
            No Data
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border p-5">
        <h2 className="text-base font-semibold">
          Inventory Report
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {rows.length} inventory records.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left">
              <th className="px-5 py-3">
                Item
              </th>

              <th className="px-5 py-3">
                Category
              </th>

              <th className="px-5 py-3">
                Warehouse
              </th>

              <th className="px-5 py-3">
                Batch
              </th>

              <th className="px-5 py-3">
                Expiry
              </th>

              <th className="px-5 py-3">
                Available
              </th>

              <th className="px-5 py-3">
                Reorder
              </th>

              <th className="px-5 py-3">
                Status
              </th>

              <th className="px-5 py-3">
                Stock Value
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`${row.itemId || "item"}-${row.batchNumber || "batch"}-${index}`}
                className="border-b border-border last:border-0"
              >
                <td className="px-5 py-4">
                  <p className="font-medium">
                    {row.itemName || "Unnamed Item"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {row.itemId || "No ID"}
                  </p>
                </td>

                <td className="px-5 py-4">
                  {row.category || "—"}
                </td>

                <td className="px-5 py-4">
                  {row.warehouse || "—"}
                </td>

                <td className="px-5 py-4">
                  {row.batchNumber || "—"}
                </td>

                <td className="px-5 py-4">
                  {row.expiryDate || "—"}
                </td>

                <td className="px-5 py-4 font-medium">
                  {row.availableStock.toLocaleString(
                    "en-IN"
                  )}{" "}
                  {row.unit}
                </td>

                <td className="px-5 py-4">
                  {row.reorderLevel.toLocaleString(
                    "en-IN"
                  )}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                    {row.status}
                  </span>
                </td>

                <td className="px-5 py-4 font-medium">
                  ₹
                  {row.stockValue.toLocaleString(
                    "en-IN"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}