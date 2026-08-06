"use client";

import type { WarehouseReceipt } from "@/features/inventory/types/warehouse";

interface Props {
  receipts: WarehouseReceipt[];
}

export default function RecentStockEntryTable({
  receipts,
}: Props) {
  const entries = receipts.flatMap(
    (receipt) =>
      receipt.warehouseItems
        .filter(
          (item) =>
            item.acceptedQuantity > 0
        )
        .map((item) => ({
          ...item,
          grnNumber: receipt.grnNumber,
          supplierName:
            receipt.supplierName,
          receivedDate:
            receipt.receivedDate,
        }))
  );

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border p-5">
        <h3 className="font-semibold">
          Recent Stock Entries
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Inventory successfully entered into the warehouse.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold">
                Item
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold">
                GRN
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold">
                Batch
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold">
                Quantity
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold">
                Expiry
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold">
                Supplier
              </th>
            </tr>
          </thead>

          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-muted-foreground"
                >
                  No stock entries available.
                </td>
              </tr>
            ) : (
              entries.map((item) => (
                <tr
                  key={`${item.grnNumber}-${item.id}`}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium">
                      {item.itemName}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.itemId}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {item.grnNumber}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {item.batchNumber ?? "—"}
                  </td>

                  <td className="px-5 py-4 text-right text-sm font-semibold">
                    {item.acceptedQuantity.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {item.expiryDate ?? "—"}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {item.supplierName}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}