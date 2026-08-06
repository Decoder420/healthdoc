"use client";

import type { InventoryReportRow } from "@/features/inventory/types/report";

interface Props {
  rows: InventoryReportRow[];
}

export default function StockValuationReport({
  rows,
}: Props) {
  const totalStockValue = rows.reduce(
    (sum, row) => sum + row.stockValue,
    0
  );

  const totalQuantity = rows.reduce(
    (sum, row) => sum + row.availableStock,
    0
  );

  const totalItems = rows.length;

  return (
    <div className="space-y-6">

      {/* Valuation Summary */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">
            Total Stock Value
          </p>

          <p className="mt-2 text-2xl font-bold">
            ₹
            {totalStockValue.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">
            Total Stock Quantity
          </p>

          <p className="mt-2 text-2xl font-bold">
            {totalQuantity.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">
            Inventory Items
          </p>

          <p className="mt-2 text-2xl font-bold">
            {totalItems.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

      </div>

      {/* Valuation Table */}

      <div className="surface-card overflow-hidden">

        <div className="border-b border-border p-5">
          <h2 className="text-base font-semibold">
            Stock Valuation
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Current inventory value based on
            available stock and unit price.
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
                  Available
                </th>

                <th className="px-5 py-3">
                  Unit Price
                </th>

                <th className="px-5 py-3">
                  Stock Value
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
                      {row.category ||
                        "—"}
                    </td>

                    <td className="px-5 py-4">
                      {row.warehouse ||
                        "—"}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {row.availableStock.toLocaleString(
                        "en-IN"
                      )}{" "}
                      {row.unit}
                    </td>

                    <td className="px-5 py-4">
                      ₹
                      {row.unitPrice.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      ₹
                      {row.stockValue.toLocaleString(
                        "en-IN"
                      )}
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