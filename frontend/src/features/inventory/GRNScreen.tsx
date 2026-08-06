"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/providers/auth-provider";

import GRNStats from "@/components/dashboard/inventory/purchase/grn/GRNStats";
import GRNTable from "@/components/dashboard/inventory/purchase/grn/GRNTable";
import GRNViewDialog from "@/components/dashboard/inventory/purchase/grn/GRNViewDialog";
import GRNInspectionDialog from "@/components/dashboard/inventory/purchase/grn/GRNInspectionDialog";
import GRNStockEntryDialog from "@/components/dashboard/inventory/purchase/grn/GRNStockEntryDialog";

import type {
  GRN,
  GRNStatus,
} from "@/features/inventory/types/grn";

const loadGRNs = (): GRN[] => [];

const saveGRNs = (_grns: GRN[]) => {
  // Persisted via local state within the screen until
  // a dedicated inventory data layer is wired in.
};

export default function GRNScreen() {
  const { user } = useAuth();

  const [goodsReceivedNotes, setGoodsReceivedNotes] =
    useState<GRN[]>([]);

  const [selectedGRN, setSelectedGRN] =
    useState<GRN | null>(null);

  const [inspectionGRN, setInspectionGRN] =
    useState<GRN | null>(null);

  const [stockEntryGRN, setStockEntryGRN] =
    useState<GRN | null>(null);

  /*
   * ============================================================
   * LOAD GRNs
   * ============================================================
   */

  useEffect(() => {
    const grns = loadGRNs();

    setGoodsReceivedNotes(grns);
  }, []);

  /*
   * ============================================================
   * VIEW GRN
   * ============================================================
   */

  const handleView = (grn: GRN) => {
    setSelectedGRN(grn);
  };

  /*
   * ============================================================
   * STATUS UPDATE
   * ============================================================
   */

  const handleStatusUpdate = (
    grnId: string,
    status: GRNStatus
  ) => {
    setGoodsReceivedNotes((prev) => {
      const updated = prev.map((item) =>
        item.id === grnId
          ? {
              ...item,
              status,
            }
          : item
      );

      saveGRNs(updated);

      return updated;
    });

    /*
     * Keep currently opened View dialog synchronized.
     */

    setSelectedGRN((prev) =>
      prev && prev.id === grnId
        ? {
            ...prev,
            status,
          }
        : prev
    );

    /*
     * If GRN becomes verified,
     * prepare it for stock entry.
     */

    if (status === "verified") {
      const verifiedGRN =
        goodsReceivedNotes.find(
          (item) => item.id === grnId
        );

      if (verifiedGRN) {
        setStockEntryGRN({
          ...verifiedGRN,
          status: "verified",
        });
      }
    }
  };

  /*
   * ============================================================
   * INSPECT GRN
   * ============================================================
   */

  const handleInspect = (grn: GRN) => {
    setInspectionGRN(grn);
  };

  /*
   * ============================================================
   * COMPLETE INSPECTION
   * ============================================================
   */

  const handleCompleteInspection = (
    updatedGRN: GRN
  ) => {
    setGoodsReceivedNotes((prev) => {
      const updated = prev.map((item) =>
        item.id === updatedGRN.id
          ? updatedGRN
          : item
      );

      saveGRNs(updated);

      return updated;
    });

    /*
     * Close inspection dialog.
     */

    setInspectionGRN(null);

    /*
     * Keep View dialog synchronized.
     */

    setSelectedGRN((prev) =>
      prev && prev.id === updatedGRN.id
        ? updatedGRN
        : prev
    );

    /*
     * After successful verification,
     * open Stock Entry.
     */

    if (updatedGRN.status === "verified") {
      setStockEntryGRN(updatedGRN);
    }
  };

  /*
   * ============================================================
   * COMPLETE STOCK ENTRY
   * ============================================================
   */

  const handleCompleteStockEntry = (
    updatedGRN: GRN,
    stockLocationId: string
  ) => {
    console.log(
      "Stock entry completed:",
      {
        grn: updatedGRN,
        stockLocationId,
      }
    );

    /*
     * Keep GRN state synchronized.
     */

    setGoodsReceivedNotes((prev) => {
      const updated = prev.map((item) =>
        item.id === updatedGRN.id
          ? updatedGRN
          : item
      );

      saveGRNs(updated);

      return updated;
    });

    /*
     * Close Stock Entry dialog.
     */

    setStockEntryGRN(null);

    /*
     * Update View dialog if it is open.
     */

    setSelectedGRN((prev) =>
      prev && prev.id === updatedGRN.id
        ? updatedGRN
        : prev
    );
  };

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>
        <p className="text-sm font-medium text-primary">
          Purchase Management
        </p>

        <h1 className="text-2xl font-bold text-foreground">
          Goods Received Notes
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View goods received against purchase orders
          and track receiving status.
        </p>
      </div>

      {/* ======================================================
          USER
      ====================================================== */}

      <div className="text-sm text-muted-foreground">
        Logged in as{" "}
        <span className="font-medium text-foreground">
          {user?.name ?? "Inventory Manager"}
        </span>
      </div>

      {/* ======================================================
          STATS
      ====================================================== */}

      <GRNStats
        grns={goodsReceivedNotes}
      />

      {/* ======================================================
          TABLE
      ====================================================== */}

      <GRNTable
        grns={goodsReceivedNotes}
        onView={handleView}
        onInspect={handleInspect}
      />

      {/* ======================================================
          VIEW GRN
      ====================================================== */}

      <GRNViewDialog
        open={Boolean(selectedGRN)}
        grn={selectedGRN}
        onClose={() => {
          setSelectedGRN(null);
        }}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* ======================================================
          INSPECTION / VERIFICATION
      ====================================================== */}

      <GRNInspectionDialog
        open={Boolean(inspectionGRN)}
        grn={inspectionGRN}
        onClose={() => {
          setInspectionGRN(null);
        }}
        onComplete={handleCompleteInspection}
      />

      {/* ======================================================
          STOCK ENTRY
      ====================================================== */}

      <GRNStockEntryDialog
        open={Boolean(stockEntryGRN)}
        grn={stockEntryGRN}
        onClose={() => {
          setStockEntryGRN(null);
        }}
        onComplete={handleCompleteStockEntry}
      />

    </div>
  );
}