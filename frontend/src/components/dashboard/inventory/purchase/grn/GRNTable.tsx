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
          GRNs will appear here after goods are
          received against purchase orders.
        </p>
      </div>
    );
  }

  /*
   * ============================================================
   * STATUS CLASS
   * ============================================================
   */

  const getStatusClass = (
    status: GRN["status"]
  ) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";

      case "received":
        return "bg-yellow-100 text-yellow-700";

      case "verified":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-muted text-muted-foreground";
    }
  };

  /*
   * ============================================================
   * STATUS LABEL
   * ============================================================
   */

  const formatStatus = (
    status: GRN["status"]
  ) => {
    switch (status) {
      case "draft":
        return "Draft";

      case "received":
        return "Received";

      case "verified":
        return "Verified";

      case "cancelled":
        return "Cancelled";

      default:
        return status;
    }
  };

  /*
   * ============================================================
   * RECEIVED QUANTITY
   * ============================================================
   *
   * We calculate the quantity safely because older GRNs may
   * not have totalQuantity populated.
   *
   * Priority:
   *
   * 1. totalQuantity
   * 2. sum of receivedQuantity
   * 3. sum of quantity
   *
   * ============================================================
   */

  const getReceivedQuantity = (
    grn: GRN
  ): number => {
    const totalQuantity = Number(
      grn.totalQuantity ?? 0
    );

    if (totalQuantity > 0) {
      return totalQuantity;
    }

    return (grn.grnItems ?? []).reduce(
      (sum, item) => {
        const receivedQuantity = Number(
          (item as any).receivedQuantity ??
            item.quantity ??
            0
        );

        return sum + receivedQuantity;
      },
      0
    );
  };

  return (
    <div className="surface-card overflow-hidden">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-border p-5">

        <h3 className="font-semibold">
          Goods Receipt Notes
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          View goods received against purchase orders.
        </p>

      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

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

            {grns.map((grn) => {

              /*
               * Calculate received quantity safely
               */

              const receivedQuantity =
                getReceivedQuantity(grn);

              /*
               * Calculate item count safely
               */

              const totalItems =
                Number(grn.totalItems ?? 0) ||
                (grn.grnItems ?? []).length;

              return (
                <tr
                  key={grn.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20"
                >

                  {/* GRN NUMBER */}

                  <td className="px-5 py-4">

                    <p className="text-sm font-medium">
                      {grn.grnNumber ||
                        "Not specified"}
                    </p>

                  </td>

                  {/* PO NUMBER */}

                  <td className="px-5 py-4">

                    <p className="text-sm">
                      {grn.poNumber ||
                        "Not specified"}
                    </p>

                  </td>

                  {/* SUPPLIER */}

                  <td className="px-5 py-4">

                    <p className="text-sm">
                      {grn.supplierName ||
                        "Not specified"}
                    </p>

                  </td>

                  {/* ITEMS */}

                  <td className="px-5 py-4 text-center text-sm">
                    {totalItems.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  {/* RECEIVED QUANTITY */}

                  <td className="px-5 py-4 text-center">

                    <span className="text-sm font-semibold">

                      {receivedQuantity.toLocaleString(
                        "en-IN"
                      )}

                    </span>

                  </td>

                  {/* RECEIVED DATE */}

                  <td className="px-5 py-4 text-sm">
                    {grn.receivedDate ||
                      "Not specified"}
                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4 text-center">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                        grn.status
                      )}`}
                    >
                      {formatStatus(
                        grn.status
                      )}
                    </span>

                  </td>

                  {/* ACTION */}

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() =>
                          onView(grn)
                        }
                        className="rounded-md border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        title="View GRN"
                      >
                        <Eye size={16} />
                      </button>

                      {/* VERIFY */}

                      {grn.status === "received" &&
                        onInspect && (
                          <button
                            type="button"
                            onClick={() =>
                              onInspect(grn)
                            }
                            className="rounded-md border border-primary/20 bg-primary/10 p-2 text-primary transition hover:bg-primary/20"
                            title="Verify GRN"
                          >
                            <PackageCheck
                              size={16}
                            />
                          </button>
                        )}

                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}