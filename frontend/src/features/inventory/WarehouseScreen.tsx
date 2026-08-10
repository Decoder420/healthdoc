"use client";

import { useEffect, useMemo, useState } from "react";

import WarehouseStats from "@/components/dashboard/inventory/warehouse/WarehouseStats";
import PendingWarehouseTable from "@/components/dashboard/inventory/warehouse/PendingWarehouseTable";
import RecentStockEntryTable from "@/components/dashboard/inventory/warehouse/RecentStockEntryTable";
import WarehouseViewDialog from "@/components/dashboard/inventory/warehouse/WarehouseViewDialog";
import StockEntryDialog from "@/components/dashboard/inventory/warehouse/StockEntryDialog";

import type {
  WarehouseReceipt,
} from "@/features/inventory/types/warehouse";

import type {
  WarehouseStock,
} from "@/features/inventory/types/warehouseStock";

import {
  warehouseStockData,
} from "@/features/inventory/data/warehouseStockData";

import {
  warehouseReceipts,
} from "@/features/inventory/data/warehouseData";

import {
  getStoredGRNs,
} from "@/features/inventory/data/grnData";

import type {
  GRN,
} from "@/features/inventory/types/grn";

const WAREHOUSE_STOCK_KEY =
  "warehouse_stock";

const WAREHOUSE_RECEIPTS_KEY =
  "warehouse_receipts";

export default function WarehouseScreen() {
  const [receipts, setReceipts] =
    useState<WarehouseReceipt[]>([]);

  const [stocks, setStocks] =
    useState<WarehouseStock[]>([]);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [receiveOpen, setReceiveOpen] =
    useState(false);

  const [selectedReceipt, setSelectedReceipt] =
    useState<WarehouseReceipt | null>(null);

  /*
   * ============================================================
   * CONVERT VERIFIED GRN → WAREHOUSE RECEIPT
   * ============================================================
   */

  const createWarehouseReceiptFromGRN = (
    grn: GRN
  ): WarehouseReceipt => {
    return {
      id: `WR-${grn.id}`,

      grnId: grn.id,

      grnNumber:
        grn.grnNumber,

      purchaseOrderId:
        grn.purchaseOrderId,

      purchaseOrderNumber:
        grn.poNumber,

      supplierId:
        grn.supplierId,

      supplierName:
        grn.supplierName,

      warehouseId:
        "WH-001",

      warehouseName:
        "Main Hospital Store",

      receivedDate:
        grn.receivedDate,

      status:
        "Pending",

      items:
        grn.grnItems?.length ?? 0,

      totalReceivedQuantity:
        Number(grn.totalQuantity ?? 0),

      totalAcceptedQuantity:
        0,

      totalRejectedQuantity:
        0,

      warehouseItems:
        (grn.grnItems ?? []).map(
          (item, index) => ({
            id:
              `WRI-${grn.id}-${index + 1}`,

            itemId:
              item.itemId,

            itemName:
              item.itemName,

            orderedQuantity:
              Number(item.quantity ?? 0),

            receivedQuantity:
              Number(
                item.receivedQuantity ??
                  item.quantity ??
                  0
              ),

            acceptedQuantity:
              0,

            rejectedQuantity:
              0,

            batchNumber:
              item.batchNumber,

            expiryDate:
              item.expiryDate,

            unit:
              "Unit",
          })
        ),
    };
  };

  /*
   * ============================================================
   * SYNC VERIFIED GRNs → WAREHOUSE RECEIPTS
   * ============================================================
   */

  const syncVerifiedGRNsToWarehouse = (
    existingReceipts: WarehouseReceipt[]
  ): WarehouseReceipt[] => {
    const grns =
      getStoredGRNs();

    const verifiedGRNs =
      grns.filter(
        (grn) =>
          grn.status === "verified"
      );

    /*
     * Start with existing warehouse receipts.
     */

    const updatedReceipts = [
      ...existingReceipts,
    ];

    /*
     * Add every verified GRN which
     * does not already have a warehouse receipt.
     */

    verifiedGRNs.forEach((grn) => {
      const alreadyExists =
        updatedReceipts.some(
          (receipt) =>
            receipt.grnId === grn.id
        );

      if (alreadyExists) {
        return;
      }

      const warehouseReceipt =
        createWarehouseReceiptFromGRN(
          grn
        );

      updatedReceipts.unshift(
        warehouseReceipt
      );
    });

    /*
     * Persist synchronized receipts.
     */

    localStorage.setItem(
      WAREHOUSE_RECEIPTS_KEY,
      JSON.stringify(
        updatedReceipts
      )
    );

    return updatedReceipts;
  };

  /*
   * ============================================================
   * LOAD WAREHOUSE DATA
   * ============================================================
   */

  useEffect(() => {
    /*
     * ----------------------------------------------------------
     * LOAD EXISTING WAREHOUSE RECEIPTS
     * ----------------------------------------------------------
     */

    let loadedReceipts:
      WarehouseReceipt[] = [];

    try {
      const storedReceipts =
        localStorage.getItem(
          WAREHOUSE_RECEIPTS_KEY
        );

      if (storedReceipts) {
        const parsedReceipts =
          JSON.parse(
            storedReceipts
          );

        if (
          Array.isArray(
            parsedReceipts
          )
        ) {
          loadedReceipts =
            parsedReceipts;
        } else {
          loadedReceipts =
            [...warehouseReceipts];
        }
      } else {
        loadedReceipts =
          [...warehouseReceipts];
      }
    } catch (error) {
      console.error(
        "Failed to load warehouse receipts:",
        error
      );

      loadedReceipts =
        [...warehouseReceipts];
    }

    /*
     * ----------------------------------------------------------
     * IMPORTANT:
     *
     * Pull verified GRNs and convert
     * missing ones into warehouse receipts.
     * ----------------------------------------------------------
     */

    const synchronizedReceipts =
      syncVerifiedGRNsToWarehouse(
        loadedReceipts
      );

    setReceipts(
      synchronizedReceipts
    );

    /*
     * ----------------------------------------------------------
     * LOAD WAREHOUSE STOCK
     * ----------------------------------------------------------
     */

    try {
      const storedStock =
        localStorage.getItem(
          WAREHOUSE_STOCK_KEY
        );

      if (storedStock) {
        const parsedStock =
          JSON.parse(
            storedStock
          );

        if (
          Array.isArray(
            parsedStock
          )
        ) {
          setStocks(
            parsedStock
          );
        } else {
          setStocks(
            warehouseStockData
          );
        }
      } else {
        setStocks(
          warehouseStockData
        );

        localStorage.setItem(
          WAREHOUSE_STOCK_KEY,
          JSON.stringify(
            warehouseStockData
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to load warehouse stock:",
        error
      );

      setStocks(
        warehouseStockData
      );
    }
  }, []);

  /*
   * ============================================================
   * PENDING WAREHOUSE RECEIPTS
   * ============================================================
   */

  const pendingReceipts =
    useMemo(() => {
      return receipts.filter(
        (receipt) =>
          receipt.status ===
            "Pending" ||
          receipt.status ===
            "Partially Received"
      );
    }, [receipts]);

  /*
   * ============================================================
   * VIEW RECEIPT
   * ============================================================
   */

  const handleView = (
    receipt: WarehouseReceipt
  ) => {
    setSelectedReceipt(
      receipt
    );

    setViewOpen(true);
  };

  /*
   * ============================================================
   * RECEIVE STOCK
   * ============================================================
   */

  const handleReceive = (
    receipt: WarehouseReceipt
  ) => {
    setSelectedReceipt(
      receipt
    );

    setReceiveOpen(true);
  };

  /*
   * ============================================================
   * SAVE STOCK ENTRY
   * ============================================================
   */

  const handleStockEntrySave = (
    receiptId: string,
    items: any[]
  ) => {
    const receipt =
      receipts.find(
        (item) =>
          item.id === receiptId
      );

    if (!receipt) {
      console.error(
        "Warehouse receipt not found:",
        receiptId
      );

      return;
    }

    /*
     * ----------------------------------------------------------
     * ACCEPTED ITEMS
     * ----------------------------------------------------------
     */

    const acceptedItems =
      items.filter(
        (item) =>
          Number(
            item.acceptedQuantity
          ) > 0
      );

    if (
      acceptedItems.length === 0
    ) {
      alert(
        "Please accept at least one item."
      );

      return;
    }

    /*
     * ----------------------------------------------------------
     * CREATE WAREHOUSE STOCK
     * ----------------------------------------------------------
     */

    const now =
      new Date();

    const newStock:
      WarehouseStock[] =
      acceptedItems.map(
        (item, index) => ({
          id:
            `WS-${Date.now()}-${index}`,

          itemId:
            item.itemId,

          itemName:
            item.itemName,

          category:
            item.category ??
            "General",

          brand:
            item.brand,

          supplierId:
            item.supplierId ??
            receipt.supplierId,

          supplierName:
            item.supplierName ??
            receipt.supplierName,

          batchNumber:
            item.batchNumber ??
            "",

          expiryDate:
            item.expiryDate ??
            "",

          quantity:
            Number(
              item.acceptedQuantity
            ),

          availableQuantity:
            Number(
              item.acceptedQuantity
            ),

          unit:
            item.unit ??
            "Unit",

          warehouseId:
            receipt.warehouseId,

          warehouseName:
            receipt.warehouseName,

          grnId:
            receipt.grnId,

          grnNumber:
            receipt.grnNumber,

          receivedDate:
            now.toISOString(),

          status:
            "Available",
        })
      );

    /*
     * ----------------------------------------------------------
     * SAVE STOCK
     * ----------------------------------------------------------
     */

    setStocks(
      (currentStocks) => {
        const updatedStocks = [
          ...currentStocks,
          ...newStock,
        ];

        localStorage.setItem(
          WAREHOUSE_STOCK_KEY,
          JSON.stringify(
            updatedStocks
          )
        );

        return updatedStocks;
      }
    );

    /*
     * ----------------------------------------------------------
     * TOTALS
     * ----------------------------------------------------------
     */

    const totalAcceptedQuantity =
      items.reduce(
        (total, item) =>
          total +
          Number(
            item.acceptedQuantity ||
              0
          ),
        0
      );

    const totalRejectedQuantity =
      items.reduce(
        (total, item) =>
          total +
          Number(
            item.rejectedQuantity ||
              0
          ),
        0
      );

    /*
     * ----------------------------------------------------------
     * UPDATE RECEIPT
     * ----------------------------------------------------------
     */

    setReceipts(
      (currentReceipts) => {
        const updatedReceipts =
          currentReceipts.map(
            (currentReceipt) => {
              if (
                currentReceipt.id !==
                receiptId
              ) {
                return currentReceipt;
              }

              return {
                ...currentReceipt,

                status:
                  "Stock Entered" as WarehouseReceipt["status"],

                totalAcceptedQuantity,

                totalRejectedQuantity,

                warehouseItems:
                  items,
              };
            }
          );

        localStorage.setItem(
          WAREHOUSE_RECEIPTS_KEY,
          JSON.stringify(
            updatedReceipts
          )
        );

        return updatedReceipts;
      }
    );

    /*
     * ----------------------------------------------------------
     * CLOSE DIALOG
     * ----------------------------------------------------------
     */

    setReceiveOpen(false);

    setSelectedReceipt(null);
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

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="text-sm font-medium text-primary">
            Inventory Management
          </p>

          <h1 className="text-2xl font-bold text-foreground">
            Warehouse
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Receive verified GRNs, enter stock
            into the warehouse, and manage
            inventory storage.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Current Warehouse
          </p>

          <p className="mt-1 text-sm font-semibold">
            Main Hospital Store
          </p>
        </div>

      </div>

      {/* ======================================================
          PROCUREMENT FLOW
      ====================================================== */}

      <section className="surface-card p-5">

        <div className="mb-5">
          <h2 className="text-base font-semibold">
            Warehouse Receiving Flow
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Verified GRNs are received into the
            warehouse before becoming available stock.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">

          {[
            "Purchase Order",
            "GRN",
            "Warehouse",
            "Stock Entry",
            "Stock List",
          ].map(
            (stage, index, stages) => (
              <div
                key={stage}
                className="flex flex-1 items-center gap-3"
              >

                <div
                  className={`flex-1 rounded-lg border p-3 text-center ${
                    stage === "Warehouse"
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-muted/20"
                  }`}
                >

                  <p className="text-xs text-muted-foreground">
                    {index === 0
                      ? "Previous"
                      : index === 2
                      ? "Current"
                      : index === 4
                      ? "Result"
                      : "Next"}
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${
                      stage === "Warehouse"
                        ? "text-primary"
                        : ""
                    }`}
                  >
                    {stage}
                  </p>

                </div>

                {index <
                  stages.length - 1 && (
                  <span className="hidden text-muted-foreground md:block">
                    →
                  </span>
                )}

              </div>
            )
          )}

        </div>

      </section>

      {/* ======================================================
          STATS
      ====================================================== */}

      <WarehouseStats
        receipts={receipts}
      />

      {/* ======================================================
          PENDING WAREHOUSE RECEIPTS
      ====================================================== */}

      <PendingWarehouseTable
        receipts={pendingReceipts}
        onView={handleView}
        onReceive={handleReceive}
      />

      {/* ======================================================
          RECENT STOCK ENTRY
      ====================================================== */}

      <RecentStockEntryTable
        receipts={receipts}
      />

      {/* ======================================================
          STOCK ENTRY DIALOG
      ====================================================== */}

      <StockEntryDialog
        open={receiveOpen}
        receipt={selectedReceipt}
        onClose={() => {
          setReceiveOpen(false);
          setSelectedReceipt(null);
        }}
        onSave={handleStockEntrySave}
      />

      {/* ======================================================
          VIEW RECEIPT DIALOG
      ====================================================== */}

      <WarehouseViewDialog
        open={viewOpen}
        receipt={selectedReceipt}
        onClose={() => {
          setViewOpen(false);
          setSelectedReceipt(null);
        }}
      />

    </div>
  );
}