"use client";

import { useEffect, useMemo, useState } from "react";

import WarehouseStats from "@/components/dashboard/inventory/warehouse/WarehouseStats";
import PendingWarehouseTable from "@/components/dashboard/inventory/warehouse/PendingWarehouseTable";
import RecentStockEntryTable from "@/components/dashboard/inventory/warehouse/RecentStockEntryTable";
import WarehouseViewDialog from "@/components/dashboard/inventory/warehouse/WarehouseViewDialog";
import StockEntryDialog from "@/components/dashboard/inventory/warehouse/StockEntryDialog";

import type { WarehouseReceipt } from "@/features/inventory/types/warehouse";
import type { WarehouseStock } from "@/features/inventory/types/warehouseStock";

import { warehouseStockData } from "@/features/inventory/data/warehouseStockData";
import { warehouseReceipts } from "@/features/inventory/data/warehouseData";

const WAREHOUSE_STOCK_KEY = "warehouse_stock";
const WAREHOUSE_RECEIPTS_KEY = "warehouse_receipts";

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
   * LOAD WAREHOUSE DATA
   * ============================================================
   */

  useEffect(() => {
    /*
     * Load warehouse receipts
     */

    try {
      const storedReceipts =
        localStorage.getItem(
          WAREHOUSE_RECEIPTS_KEY
        );

      if (storedReceipts) {
        const parsedReceipts =
          JSON.parse(storedReceipts);

        if (Array.isArray(parsedReceipts)) {
          setReceipts(parsedReceipts);
        } else {
          setReceipts(warehouseReceipts);
        }
      } else {
        setReceipts(warehouseReceipts);

        localStorage.setItem(
          WAREHOUSE_RECEIPTS_KEY,
          JSON.stringify(warehouseReceipts)
        );
      }
    } catch (error) {
      console.error(
        "Failed to load warehouse receipts:",
        error
      );

      setReceipts(warehouseReceipts);
    }

    /*
     * Load warehouse stock
     */

    try {
      const storedStock =
        localStorage.getItem(
          WAREHOUSE_STOCK_KEY
        );

      if (storedStock) {
        const parsedStock =
          JSON.parse(storedStock);

        if (Array.isArray(parsedStock)) {
          setStocks(parsedStock);
        } else {
          setStocks(warehouseStockData);
        }
      } else {
        setStocks(warehouseStockData);

        localStorage.setItem(
          WAREHOUSE_STOCK_KEY,
          JSON.stringify(warehouseStockData)
        );
      }
    } catch (error) {
      console.error(
        "Failed to load warehouse stock:",
        error
      );

      setStocks(warehouseStockData);
    }
  }, []);

  /*
   * ============================================================
   * PENDING RECEIPTS
   * ============================================================
   */

  const pendingReceipts = useMemo(() => {
    return receipts.filter(
      (receipt) =>
        receipt.status === "Pending" ||
        receipt.status === "Partially Received"
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
    setSelectedReceipt(receipt);
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
    setSelectedReceipt(receipt);
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
    const receipt = receipts.find(
      (item) => item.id === receiptId
    );

    if (!receipt) {
      console.error(
        "Warehouse receipt not found:",
        receiptId
      );

      return;
    }

    /*
     * Only accepted quantities become
     * warehouse stock.
     */

    const acceptedItems =
      items.filter(
        (item) =>
          Number(item.acceptedQuantity) > 0
      );

    if (acceptedItems.length === 0) {
      alert(
        "Please accept at least one item."
      );

      return;
    }

    /*
     * Create warehouse stock records.
     */

    const now = new Date();

    const newStock: WarehouseStock[] =
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
     * Add new stock to existing stock.
     */

    setStocks((currentStocks) => {
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
    });

    /*
     * Calculate totals.
     */

    const totalAcceptedQuantity =
      items.reduce(
        (total, item) =>
          total +
          Number(
            item.acceptedQuantity || 0
          ),
        0
      );

    const totalRejectedQuantity =
      items.reduce(
        (total, item) =>
          total +
          Number(
            item.rejectedQuantity || 0
          ),
        0
      );

    /*
     * Update warehouse receipt.
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

                // Ensure status matches WarehouseReceipt status type
                status: "Stock Entered" as WarehouseReceipt["status"],

                totalAcceptedQuantity,

                totalRejectedQuantity,

                warehouseItems: items,
              };
            }
          );

        /*
         * Persist receipts.
         */

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
     * Close dialog.
     */

    setReceiveOpen(false);
    setSelectedReceipt(null);
  };

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
            Receive approved GRNs, enter stock
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
            Stock becomes available only after
            warehouse entry.
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