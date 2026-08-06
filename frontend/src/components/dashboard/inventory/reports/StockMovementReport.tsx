"use client";

import type { InventoryReportRow } from "@/features/inventory/types/report";

interface Props {
  rows: InventoryReportRow[];
}

export default function StockMovementReport({
  rows,
}: Props) {
  const totalOpening = rows.reduce(
    (sum, row) => sum + row.openingStock,
    0
  );

  const totalReceived = rows.reduce(
    (sum, row) => sum + row.receivedQty,
    0
  );

  const totalIssued = rows.reduce(
    (sum, row) => sum + row.issuedQty,
    0
  );

  const totalAvailable = rows.reduce(
    (sum, row) => sum + row.availableStock,
    0
  );

  return (
    <div className="space-y-6">

      {/* Summary */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <MovementCard
          label="Opening Stock"
          value={totalOpening}
        />

        <MovementCard
          label="Received"
          value={totalReceived}
        />

        <MovementCard
          label="Issued"
          value={totalIssued}
        />

        <MovementCard
          label="Available Stock"
          value={totalAvailable}
        />

      </div>

      {/* Movement Table */}

      <div className="surface-card overflow-hidden">

        <div className="border-b border-border p-5">
          <h2 className="text-base font-semibold">
            Stock Movement
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Summary of stock received, issued,
            and currently available.
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
                  Warehouse
                </th>

                <th className="px-5 py-3">
                  Opening
                </th>

                <th className="px-5 py-3">
                  Received
                </th>

                <th className="px-5 py-3">
                  Issued
                </th>

                <th className="px-5 py-3">
                  Available
                </th>

                <th className="px-5 py-3">
                  Unit
                </th>

              </tr>
            </thead>

            <tbody>

              {rows.map(
                (row, index) => (
                  <tr
                    key={`${row.itemId || "item"}-${row.batchNumber || "batch"}-${index}`}
                    className="border-b border-border last:border-0"
                  >

                    <td className="px-5 py-4">
                      <p className="font-medium">
                        {row.itemName ||
                          "Unnamed Item"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {row.itemId ||
                          "No ID"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      {row.warehouse ||
                        "—"}
                    </td>

                    <td className="px-5 py-4">
                      {row.openingStock.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {row.receivedQty.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {row.issuedQty.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      {row.availableStock.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {row.unit || "—"}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

/* =========================================================
   MOVEMENT CARD
========================================================= */

function MovementCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="surface-card p-5">

      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value.toLocaleString("en-IN")}
      </p>

    </div>
  );
}