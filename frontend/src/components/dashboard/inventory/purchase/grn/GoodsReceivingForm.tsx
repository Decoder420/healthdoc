
"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/providers/auth-provider";

import GRNStats from "@/components/dashboard/inventory/purchase/grn/GRNStats";
import GRNTable from "@/components/dashboard/inventory/purchase/grn/GRNTable";

import { getStoredGRNs } from "@/features/inventory/data/grnData";

import type { GRN } from "@/features/inventory/types/grn";

export default function GRNScreen() {
  const { user } = useAuth();

  const [goodsReceivedNotes, setGoodsReceivedNotes] =
    useState<GRN[]>([]);

  /*
   * SELECTED GRN FOR VIEW
   */

  const [selectedGRN, setSelectedGRN] =
    useState<GRN | null>(null);

  /*
   * SELECTED GRN FOR INSPECTION
   */

  const [inspectionGRN, setInspectionGRN] =
    useState<GRN | null>(null);

  /*
   * LOAD GRNs
   */

  useEffect(() => {
    const storedGRNs = getStoredGRNs();

    setGoodsReceivedNotes(storedGRNs);
  }, []);

  /*
   * VIEW GRN
   */

  const handleView = (grn: GRN) => {
    setSelectedGRN(grn);
  };

  /*
   * INSPECT GRN
   */

  const handleInspect = (grn: GRN) => {
    setInspectionGRN(grn);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <p className="text-sm font-medium text-primary">
          Purchase Management
        </p>

        <h1 className="text-2xl font-bold text-foreground">
          Goods Received Notes
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage goods received against purchase orders
          and track receiving status.
        </p>
      </div>

      {/* USER CONTEXT */}

      <div className="text-sm text-muted-foreground">
        Logged in as{" "}
        <span className="font-medium text-foreground">
          {user?.name ?? "Store Manager"}
        </span>
      </div>

      {/* STATS */}

      <GRNStats
        grns={goodsReceivedNotes}
      />

      {/* TABLE */}

      <GRNTable
        grns={goodsReceivedNotes}
        onView={handleView}
        onInspect={handleInspect}
      />

      {/* 
       * TEMPORARY VIEW
       *
       * We will replace this with
       * GRNViewDialog next.
       */}

      {selectedGRN && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-background p-6 shadow-xl">

            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  Goods Received Note
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedGRN.grnNumber}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setSelectedGRN(null)
                }
              >
                Close
              </button>

            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

              <Info
                label="GRN Number"
                value={selectedGRN.grnNumber}
              />

              <Info
                label="Purchase Order"
                value={selectedGRN.poNumber}
              />

              <Info
                label="Supplier"
                value={selectedGRN.supplierName}
              />

              <Info
                label="Department"
                value={selectedGRN.departmentName}
              />

              <Info
                label="Received Date"
                value={selectedGRN.receivedDate}
              />

              <Info
                label="Status"
                value={selectedGRN.status}
              />

            </div>

            <div className="mt-6">

              <h3 className="font-semibold">
                Received Items
              </h3>

              <div className="mt-3 overflow-x-auto rounded-lg border border-border">

                <table className="w-full">

                  <thead className="border-b border-border bg-muted/30">

                    <tr>

                      <th className="px-4 py-3 text-left text-xs font-semibold">
                        Item
                      </th>

                      <th className="px-4 py-3 text-center text-xs font-semibold">
                        Ordered
                      </th>

                      <th className="px-4 py-3 text-center text-xs font-semibold">
                        Received
                      </th>

                      <th className="px-4 py-3 text-center text-xs font-semibold">
                        Batch
                      </th>

                      <th className="px-4 py-3 text-center text-xs font-semibold">
                        Expiry
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {selectedGRN.grnItems.map(
                      (item) => (
                        <tr
                          key={item.id}
                          className="border-b border-border last:border-0"
                        >

                          <td className="px-4 py-3 text-sm font-medium">
                            {item.itemName}
                          </td>

                          <td className="px-4 py-3 text-center text-sm">
                            {item.orderedQuantity}
                          </td>

                          <td className="px-4 py-3 text-center text-sm">
                            {item.receivedQuantity}
                          </td>

                          <td className="px-4 py-3 text-center text-sm">
                            {item.batchNumber ?? "-"}
                          </td>

                          <td className="px-4 py-3 text-center text-sm">
                            {item.expiryDate ?? "-"}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

            <div className="mt-6 rounded-lg bg-muted/30 p-4">

              <div className="flex justify-between">

                <span className="text-sm text-muted-foreground">
                  Total Received Quantity
                </span>

                <span className="font-semibold">
                  {selectedGRN.totalReceivedQuantity}
                </span>

              </div>

              <div className="mt-2 flex justify-between">

                <span className="text-sm text-muted-foreground">
                  Inspection Status
                </span>

                <span className="font-medium">
                  {selectedGRN.status}
                </span>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* 
       * INSPECTION TEMPORARY
       *
       * We will replace this with
       * GRNInspectionDialog.
       */}

      {inspectionGRN && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

          <div className="w-full max-w-xl rounded-xl bg-background p-6 shadow-xl">

            <h2 className="text-xl font-semibold">
              Inspect GRN
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {inspectionGRN.grnNumber}
            </p>

            <div className="mt-6 space-y-3">

              <Info
                label="Purchase Order"
                value={inspectionGRN.poNumber}
              />

              <Info
                label="Supplier"
                value={inspectionGRN.supplierName}
              />

              <Info
                label="Received Quantity"
                value={String(
                  inspectionGRN.totalReceivedQuantity
                )}
              />

              <Info
                label="Status"
                value={inspectionGRN.status}
              />

            </div>

            <div className="mt-6 flex justify-end">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setInspectionGRN(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/*
 * INFO
 */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border p-4">

      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium">
        {value}
      </p>

    </div>
  );
}

