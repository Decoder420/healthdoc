"use client";

import { Eye, PackageCheck } from "lucide-react";

import type { WarehouseReceipt } from "@/features/inventory/types/warehouse";

interface Props {
  receipts: WarehouseReceipt[];

  onView: (
    receipt: WarehouseReceipt
  ) => void;

  onReceive: (
    receipt: WarehouseReceipt
  ) => void;
}

export default function PendingWarehouseTable({
  receipts,
  onView,
  onReceive,
}: Props) {
  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border p-5">
        <h3 className="font-semibold">
          Pending Warehouse Receipts
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          GRNs awaiting warehouse receiving and stock entry.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold">
                GRN
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold">
                Purchase Order
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold">
                Supplier
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold">
                Items
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold">
                Received Qty
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
            {receipts.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-muted-foreground"
                >
                  No pending warehouse receipts.
                </td>
              </tr>
            ) : (
              receipts.map((receipt) => (
                <tr
                  key={receipt.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium">
                      {receipt.grnNumber}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {receipt.receivedDate}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {receipt.purchaseOrderNumber}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {receipt.supplierName}
                  </td>

                  <td className="px-5 py-4 text-center text-sm">
                    {receipt.items}
                  </td>

                  <td className="px-5 py-4 text-right text-sm font-medium">
                    {receipt.totalReceivedQuantity.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                      {receipt.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onView(receipt)
                        }
                        className="rounded-md border border-border p-2 text-muted-foreground hover:bg-muted"
                        title="View GRN"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onReceive(receipt)
                        }
                        className="btn btn-primary"
                      >
                        <PackageCheck size={16} />
                        Receive Stock
                      </button>
                    </div>
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