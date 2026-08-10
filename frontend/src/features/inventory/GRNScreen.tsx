"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth-provider";

import GRNStats from "@/components/dashboard/inventory/purchase/grn/GRNStats";
import GRNTable from "@/components/dashboard/inventory/purchase/grn/GRNTable";
import GRNViewDialog from "@/components/dashboard/inventory/purchase/grn/GRNViewDialog";
import GRNInspectionDialog from "@/components/dashboard/inventory/purchase/grn/GRNInspectionDialog";

import type {
  GRN,
  GRNStatus,
} from "@/features/inventory/types/grn";

import {
  getStoredGRNs,
  saveGRNs,
} from "@/features/inventory/data/grnData";

import {
  createWarehouseReceiptFromGRN,
} from "@/features/inventory/data/warehouseData";

export default function GRNScreen() {
  const { user } = useAuth();
  const router = useRouter();

  /*
   * ============================================================
   * STATE
   * ============================================================
   */

  const [goodsReceivedNotes, setGoodsReceivedNotes] =
    useState<GRN[]>([]);

  const [selectedGRN, setSelectedGRN] =
    useState<GRN | null>(null);

  const [inspectionGRN, setInspectionGRN] =
    useState<GRN | null>(null);

  /*
   * ============================================================
   * LOAD GRNs
   * ============================================================
   */

  useEffect(() => {
    const storedGRNs = getStoredGRNs();

    setGoodsReceivedNotes(storedGRNs);
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
   *
   * Used when the GRN View dialog directly changes status.
   *
   * If status becomes verified:
   *
   * GRN
   * ↓
   * Warehouse Receipt
   * ↓
   * Warehouse
   */

  const handleStatusUpdate = (
    grnId: string,
    status: GRNStatus
  ) => {
    const currentGRNs = getStoredGRNs();

    const updatedGRNs = currentGRNs.map((grn) =>
      grn.id === grnId
        ? {
            ...grn,
            status,
          }
        : grn
    );

    /*
     * Save GRNs.
     */

    saveGRNs(updatedGRNs);

    /*
     * Update screen state.
     */

    setGoodsReceivedNotes(updatedGRNs);

    /*
     * Find updated GRN.
     */

    const updatedGRN = updatedGRNs.find(
      (grn) => grn.id === grnId
    );

    if (!updatedGRN) {
      return;
    }

    /*
     * Keep View dialog synchronized.
     */

    setSelectedGRN(updatedGRN);

    /*
     * ==========================================================
     * VERIFIED GRN → WAREHOUSE
     * ==========================================================
     */

    if (status === "verified") {
      /*
       * Create warehouse receipt.
       *
       * This function also prevents
       * duplicate warehouse receipts.
       */

      const warehouseReceipt =
        createWarehouseReceiptFromGRN(
          updatedGRN
        );

      console.log(
        "Warehouse receipt created:",
        warehouseReceipt
      );

      /*
       * Close dialog.
       */

      setSelectedGRN(null);

      /*
       * Navigate to Warehouse.
       */

      router.push("/inventory/warehouse");
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
   *
   * This is the main verification flow.
   *
   * GRN Inspection
   *       ↓
   * Verification
   *       ↓
   * Verified GRN
   *       ↓
   * Warehouse Receipt
   *       ↓
   * Warehouse Pending Receipts
   */

  const handleCompleteInspection = (
    updatedGRN: GRN
  ) => {
    /*
     * ==========================================================
     * UPDATE GRN
     * ==========================================================
     */

    const currentGRNs =
      getStoredGRNs();

    const updatedGRNs =
      currentGRNs.map((item) =>
        item.id === updatedGRN.id
          ? updatedGRN
          : item
      );

    /*
     * Persist GRN.
     */

    saveGRNs(updatedGRNs);

    /*
     * Update state.
     */

    setGoodsReceivedNotes(
      updatedGRNs
    );

    /*
     * Close inspection dialog.
     */

    setInspectionGRN(null);

    /*
     * Update View dialog.
     */

    setSelectedGRN((prev) =>
      prev &&
      prev.id === updatedGRN.id
        ? updatedGRN
        : prev
    );

    /*
     * ==========================================================
     * VERIFIED → WAREHOUSE
     * ==========================================================
     */

    if (
      updatedGRN.status ===
      "verified"
    ) {
      /*
       * Create Warehouse Receipt.
       */

      const warehouseReceipt =
        createWarehouseReceiptFromGRN(
          updatedGRN
        );

      console.log(
        "Verified GRN sent to Warehouse:",
        warehouseReceipt
      );

      /*
       * Close View dialog too.
       */

      setSelectedGRN(null);

      /*
       * Tell user.
       */

      alert(
        `${updatedGRN.grnNumber} verified successfully.`
      );

      /*
       * Navigate to Warehouse.
       *
       * Warehouse page will now load
       * the newly-created Pending receipt.
       */

      router.push(
        "/inventory/warehouse"
      );
    }
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

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
          {user?.name ??
            "Inventory Manager"}
        </span>
      </div>

      {/* ======================================================
          STATS
      ====================================================== */}

      <GRNStats
        grns={
          goodsReceivedNotes
        }
      />

      {/* ======================================================
          GRN TABLE
      ====================================================== */}

      <section className="surface-card overflow-hidden">
        <GRNTable
          grns={
            goodsReceivedNotes
          }

          onView={
            handleView
          }

          onInspect={
            handleInspect
          }
        />
      </section>

      {/* ======================================================
          VIEW GRN
      ====================================================== */}

      <GRNViewDialog
        open={
          Boolean(
            selectedGRN
          )
        }

        grn={
          selectedGRN
        }

        onClose={() => {
          setSelectedGRN(
            null
          );
        }}

        onStatusUpdate={
          handleStatusUpdate
        }
      />

      {/* ======================================================
          GRN INSPECTION / VERIFICATION
      ====================================================== */}

      <GRNInspectionDialog
        open={
          Boolean(
            inspectionGRN
          )
        }

        grn={
          inspectionGRN
        }

        onClose={() => {
          setInspectionGRN(
            null
          );
        }}

        onComplete={
          handleCompleteInspection
        }
      />

    </div>
  );
}