"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import { useEffect, useState } from "react";

import type { WarehouseReceipt } from "@/features/inventory/types/warehouse";
import type { GRN } from "@/features/inventory/types/grn";
import type { ItemMaster } from "@/features/inventory/types/itemMaster";

import { getStoredGRNs } from "@/features/inventory/data/grnData";

interface StockEntryItem {
  id: string;
  itemId: string;
  itemName: string;

  orderedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;

  unit?: string;
  batchNumber?: string;
  expiryDate?: string;

  category?: string;
  brand?: string;
  supplierId?: string;
  supplierName?: string;
}

interface Props {
  open: boolean;

  receipt: WarehouseReceipt | null;

  onClose: () => void;

  onSave: (
    receiptId: string,
    items: StockEntryItem[]
  ) => void;
}

const ITEM_MASTER_KEY = "hospital_item_master";

export default function StockEntryDialog({
  open,
  receipt,
  onClose,
  onSave,
}: Props) {
  const [items, setItems] =
    useState<StockEntryItem[]>([]);

  /*
   * ============================================================
   * LOAD ITEMS
   * ============================================================
   */

  useEffect(() => {
    if (!receipt) {
      setItems([]);
      return;
    }

    /*
     * ----------------------------------------------------------
     * 1. Load Item Master
     * ----------------------------------------------------------
     */

    let masterItems: ItemMaster[] = [];

    try {
      const storedItems =
        localStorage.getItem(
          ITEM_MASTER_KEY
        );

      if (storedItems) {
        const parsedItems =
          JSON.parse(storedItems);

        if (Array.isArray(parsedItems)) {
          masterItems = parsedItems;
        }
      }
    } catch (error) {
      console.error(
        "Failed to load Item Master:",
        error
      );
    }

    /*
     * ----------------------------------------------------------
     * 2. Load GRNs
     * ----------------------------------------------------------
     */

    let grns: GRN[] = [];

    try {
      grns = getStoredGRNs();
    } catch (error) {
      console.error(
        "Failed to load GRNs:",
        error
      );
    }

    /*
     * ----------------------------------------------------------
     * 3. Find GRN for this warehouse receipt
     * ----------------------------------------------------------
     */

    const grn = grns.find(
      (item) =>
        item.id === receipt.grnId
    );

    /*
     * ----------------------------------------------------------
     * 4. GRN is the source of items
     * ----------------------------------------------------------
     *
     * GRN contains:
     *
     * - Item
     * - Quantity
     * - Batch
     * - Expiry
     * - Received Quantity
     *
     * Item Master contains:
     *
     * - Category
     * - Brand
     * - Unit
     * - Supplier
     *
     */

    const sourceItems =
      grn?.grnItems ?? [];

    /*
     * ----------------------------------------------------------
     * 5. Convert GRN items into Stock Entry items
     * ----------------------------------------------------------
     */

    const formattedItems:
      StockEntryItem[] =
      sourceItems.map(
        (item, index) => {
          /*
           * Find matching Item Master record.
           */

          const masterItem =
            masterItems.find(
              (master) =>
                master.id ===
                item.itemId ||
                master.itemCode ===
                item.itemId
            );

          /*
           * Ordered quantity from GRN.
           */

          const orderedQuantity =
            Number(
              item.quantity ?? 0
            );

          /*
           * Received quantity from GRN.
           *
           * If receivedQuantity doesn't exist,
           * use ordered quantity.
           */

          const receivedQuantity =
            Number(
              item.receivedQuantity ??
              item.quantity ??
              0
            );

          /*
           * Return stock entry item.
           */

          return {
            id:
              item.id ??
              `${receipt.id}-ITEM-${index}`,

            itemId:
              item.itemId,

            /*
             * Item Master is preferred,
             * GRN is fallback.
             */

            itemName:
              masterItem?.itemName ??
              item.itemName ??
              "Unknown Item",

            orderedQuantity,

            /*
             * Initially accept everything
             * that was received.
             */

            acceptedQuantity:
              receivedQuantity,

            rejectedQuantity:
              Math.max(
                orderedQuantity -
                  receivedQuantity,
                0
              ),

            /*
             * Item Master metadata
             */

            unit:
              masterItem?.unit ??
              "Unit",

            category:
              masterItem?.category ??
              "General",

            brand:
              masterItem?.brand ??
              "",

            supplierId:
              masterItem?.supplierId ??
              receipt.supplierId,

            supplierName:
              masterItem?.supplierName ??
              receipt.supplierName,

            /*
             * Batch and expiry always come
             * from the GRN because they are
             * batch-specific.
             */

            batchNumber:
              item.batchNumber ??
              "",

            expiryDate:
              item.expiryDate ??
              "",
          };
        }
      );

    setItems(formattedItems);
  }, [receipt]);

  /*
   * ============================================================
   * ACCEPTED QUANTITY
   * ============================================================
   */

  const handleAcceptedChange = (
    index: number,
    value: string
  ) => {
    const quantity =
      Number(value) || 0;

    setItems(
      (currentItems) =>
        currentItems.map(
          (item, itemIndex) => {
            if (
              itemIndex !== index
            ) {
              return item;
            }

            const accepted =
              Math.min(
                Math.max(
                  quantity,
                  0
                ),
                item.orderedQuantity
              );

            return {
              ...item,

              acceptedQuantity:
                accepted,

              rejectedQuantity:
                Math.max(
                  item.orderedQuantity -
                    accepted,
                  0
                ),
            };
          }
        )
    );
  };

  /*
   * ============================================================
   * BATCH
   * ============================================================
   */

  const handleBatchChange = (
    index: number,
    value: string
  ) => {
    setItems(
      (currentItems) =>
        currentItems.map(
          (item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  batchNumber:
                    value,
                }
              : item
        )
    );
  };

  /*
   * ============================================================
   * EXPIRY
   * ============================================================
   */

  const handleExpiryChange = (
    index: number,
    value: string
  ) => {
    setItems(
      (currentItems) =>
        currentItems.map(
          (item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  expiryDate:
                    value,
                }
              : item
        )
    );
  };

  /*
   * ============================================================
   * SAVE
   * ============================================================
   */

  const handleSave = () => {
    if (!receipt) {
      return;
    }

    if (items.length === 0) {
      alert(
        "No GRN items found for this warehouse receipt."
      );

      return;
    }

    const hasAcceptedItem =
      items.some(
        (item) =>
          item.acceptedQuantity > 0
      );

    if (!hasAcceptedItem) {
      alert(
        "Please enter accepted quantity for at least one item."
      );

      return;
    }

    onSave(
      receipt.id,
      items
    );
  };

  /*
   * ============================================================
   * NO RECEIPT
   * ============================================================
   */

  if (!receipt) {
    return null;
  }

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        <div>
          <h2 className="text-lg font-semibold">
            Stock Entry
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {receipt.grnNumber}
          </p>
        </div>
      </DialogTitle>

      <DialogContent dividers>

        {/* ====================================================
            RECEIPT INFORMATION
        ==================================================== */}

        <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-4">

          <Info
            label="GRN"
            value={
              receipt.grnNumber ||
              "-"
            }
          />

          <Info
            label="Warehouse"
            value={
              receipt.warehouseName ||
              "-"
            }
          />

          <Info
            label="Receipt"
            value={
              receipt.id
            }
          />

          <Info
            label="Items"
            value={`${items.length}`}
          />

        </div>

        {/* ====================================================
            ITEMS
        ==================================================== */}

        <div className="space-y-4">

          {items.length === 0 ? (

            <div className="rounded-lg border border-dashed p-8 text-center">

              <p className="text-sm font-medium text-gray-700">
                No GRN items found
              </p>

              <p className="mt-1 text-xs text-gray-500">
                This warehouse receipt is not
                connected to any GRN items.
              </p>

            </div>

          ) : (

            items.map(
              (item, index) => (

                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 p-4"
                >

                  {/* ITEM HEADER */}

                  <div className="mb-4 flex items-start justify-between">

                    <div>

                      <p className="font-semibold text-gray-900">
                        {item.itemName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Item ID:{" "}
                        {item.itemId}
                      </p>

                    </div>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {item.unit}
                    </span>

                  </div>

                  {/* QUANTITY */}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    <TextField
                      label="Ordered Quantity"
                      value={
                        item.orderedQuantity
                      }
                      size="small"
                      fullWidth
                      disabled
                    />

                    <TextField
                      label="Accepted Quantity"
                      type="number"
                      value={
                        item.acceptedQuantity
                      }
                      size="small"
                      fullWidth
                      inputProps={{
                        min: 0,
                        max:
                          item.orderedQuantity,
                      }}
                      onChange={(
                        event
                      ) =>
                        handleAcceptedChange(
                          index,
                          event.target.value
                        )
                      }
                    />

                    <TextField
                      label="Rejected Quantity"
                      value={
                        item.rejectedQuantity
                      }
                      size="small"
                      fullWidth
                      disabled
                    />

                  </div>

                  {/* BATCH + EXPIRY */}

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                    <TextField
                      label="Batch Number"
                      value={
                        item.batchNumber
                      }
                      size="small"
                      fullWidth
                      onChange={(
                        event
                      ) =>
                        handleBatchChange(
                          index,
                          event.target.value
                        )
                      }
                    />

                    <TextField
                      label="Expiry Date"
                      type="date"
                      value={
                        item.expiryDate
                      }
                      size="small"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(
                        event
                      ) =>
                        handleExpiryChange(
                          index,
                          event.target.value
                        )
                      }
                    />

                  </div>

                  {/* ITEM METADATA */}

                  <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">

                    <Info
                      label="Category"
                      value={
                        item.category ||
                        "General"
                      }
                    />

                    <Info
                      label="Brand"
                      value={
                        item.brand ||
                        "-"
                      }
                    />

                    <Info
                      label="Unit"
                      value={
                        item.unit ||
                        "Unit"
                      }
                    />

                    <Info
                      label="Supplier"
                      value={
                        item.supplierName ||
                        "-"
                      }
                    />

                  </div>

                </div>
              )
            )

          )}

        </div>

      </DialogContent>

      {/* ======================================================
          ACTIONS
      ====================================================== */}

      <DialogActions>

        <Button
          onClick={onClose}
          color="inherit"
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            items.length === 0
          }
        >
          Save Stock Entry
        </Button>

      </DialogActions>

    </Dialog>
  );
}

/*
 * ============================================================
 * INFO COMPONENT
 * ============================================================
 */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}