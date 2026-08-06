
"use client";

import {
  CalendarDays,
  FileText,
  Package,
  Warehouse,
  X,
} from "lucide-react";

import type { WarehouseReceipt } from "@/features/inventory/types/warehouse";

interface Props {
  open: boolean;
  receipt: WarehouseReceipt | null;
  onClose: () => void;
}

export default function WarehouseViewDialog({
  open,
  receipt,
  onClose,
}: Props) {
  if (!open || !receipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl bg-background shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-xs font-medium text-primary">
              Warehouse Receipt
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              {receipt.grnNumber}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              GRN details and received stock information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6 space-y-6">

          {/* GRN INFORMATION */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <FileText size={18} className="text-primary" />

              <h3 className="font-semibold">
                GRN Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-muted/20 p-4 md:grid-cols-3">

              <div>
                <p className="text-xs text-muted-foreground">
                  GRN Number
                </p>

                <p className="mt-1 text-sm font-medium">
                  {receipt.grnNumber}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Purchase Order
                </p>

                <p className="mt-1 text-sm font-medium">
                  {receipt.purchaseOrderNumber}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Supplier
                </p>

                <p className="mt-1 text-sm font-medium">
                  {receipt.supplierName}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Received Date
                </p>

                <p className="mt-1 flex items-center gap-1 text-sm font-medium">
                  <CalendarDays size={14} />
                  {receipt.receivedDate}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Total Items
                </p>

                <p className="mt-1 text-sm font-medium">
                  {receipt.items}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Total Received Quantity
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {receipt.totalReceivedQuantity.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* STATUS */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Warehouse size={18} className="text-primary" />

              <h3 className="font-semibold">
                Warehouse Status
              </h3>
            </div>

            <div className="rounded-lg border border-border p-4">
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                {receipt.status}
              </span>
            </div>
          </section>

          {/* ITEMS */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Package size={18} className="text-primary" />

              <h3 className="font-semibold">
                Received Items
              </h3>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[800px]">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      Item
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      Item ID
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      Batch
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold">
                      Accepted
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold">
                      Rejected
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      Expiry
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {receipt.warehouseItems?.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">
                          {item.itemName}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {item.itemId}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {item.batchNumber ?? "—"}
                      </td>

                      <td className="px-4 py-3 text-right text-sm font-semibold">
                        {item.acceptedQuantity.toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="px-4 py-3 text-right text-sm">
                        {item.rejectedQuantity?.toLocaleString(
                          "en-IN"
                        ) ?? "0"}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {item.expiryDate ?? "—"}
                      </td>
                    </tr>
                  ))}

                  {(!receipt.warehouseItems ||
                    receipt.warehouseItems.length === 0) && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-sm text-muted-foreground"
                      >
                        No warehouse item details available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

