"use client";

import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";

import {
  CalendarDays,
  FileText,
  PackageCheck,
  Truck,
} from "lucide-react";

import type { PurchaseOrder } from "@/features/inventory/types/purchaseOrder";

export interface CreateGRNData {
  supplierInvoiceNumber?: string;
  receivedDate: string;

  items: {
    itemId: string;
    itemName: string;

    orderedQuantity: number;
    previouslyReceivedQuantity: number;
    quantity: number;

    batchNumber: string;
    expiryDate: string;

    unitPrice: number;
  }[];
}

interface Props {
  open: boolean;

  purchaseOrder: PurchaseOrder | null;

  onClose: () => void;

  onCreate: (data: CreateGRNData) => void;
}

export default function CreateGRNDialog({
  open,
  purchaseOrder,
  onClose,
  onCreate,
}: Props) {
  const [receivedDate, setReceivedDate] = useState("");

  const [supplierInvoiceNumber, setSupplierInvoiceNumber] =
    useState("");

  const [receivedQuantities, setReceivedQuantities] =
    useState<Record<string, number>>({});

  const [batchNumbers, setBatchNumbers] =
    useState<Record<string, string>>({});

  const [expiryDates, setExpiryDates] =
    useState<Record<string, string>>({});

  /*
   * ------------------------------------------------------------
   * INITIALIZE FORM
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (!purchaseOrder || !open) {
      return;
    }

    const today = new Date()
      .toISOString()
      .split("T")[0];

    setReceivedDate(today);
    setSupplierInvoiceNumber("");

    const quantities: Record<string, number> = {};
    const batches: Record<string, string> = {};
    const expiries: Record<string, string> = {};

    purchaseOrder.purchaseOrderItems.forEach((item) => {
      const previouslyReceived =
        item.receivedQuantity ?? 0;

      const remaining = Math.max(
        0,
        item.orderedQuantity - previouslyReceived
      );

      /*
       * Default Receive Now to remaining quantity.
       */
      quantities[item.id] = remaining;

      batches[item.id] = "";
      expiries[item.id] = "";
    });

    setReceivedQuantities(quantities);
    setBatchNumbers(batches);
    setExpiryDates(expiries);
  }, [purchaseOrder, open]);

  if (!purchaseOrder) {
    return null;
  }

  /*
   * ------------------------------------------------------------
   * QUANTITY CHANGE
   * ------------------------------------------------------------
   */

  const handleQuantityChange = (
    itemId: string,
    value: string,
    maxQuantity: number
  ) => {
    if (value === "") {
      setReceivedQuantities((prev) => ({
        ...prev,
        [itemId]: 0,
      }));

      return;
    }

    const quantity = Number(value);

    if (Number.isNaN(quantity)) {
      return;
    }

    setReceivedQuantities((prev) => ({
      ...prev,
      [itemId]: Math.min(
        Math.max(0, quantity),
        maxQuantity
      ),
    }));
  };

  /*
   * ------------------------------------------------------------
   * CREATE GRN
   * ------------------------------------------------------------
   */

  const handleCreate = () => {
    if (!receivedDate) {
      alert("Please select the received date.");
      return;
    }

    const hasReceivedItems =
      purchaseOrder.purchaseOrderItems.some(
        (item) =>
          (receivedQuantities[item.id] ?? 0) > 0
      );

    if (!hasReceivedItems) {
      alert(
        "Please enter received quantity for at least one item."
      );
      return;
    }

    /*
     * Validate every received item.
     */

    for (const item of purchaseOrder.purchaseOrderItems) {
      const received =
        receivedQuantities[item.id] ?? 0;

      if (received <= 0) {
        continue;
      }

      /*
       * Batch is mandatory because inventory_batches
       * requires batch_number.
       */

      if (!batchNumbers[item.id]?.trim()) {
        alert(
          `Please enter batch number for ${item.itemName}.`
        );

        return;
      }

      /*
       * Expiry is mandatory because inventory_batches
       * requires expiry_date.
       */

      if (!expiryDates[item.id]) {
        alert(
          `Please enter expiry date for ${item.itemName}.`
        );

        return;
      }

      const expiry = new Date(
        expiryDates[item.id]
      );

      if (Number.isNaN(expiry.getTime())) {
        alert(
          `Invalid expiry date for ${item.itemName}.`
        );

        return;
      }
    }

    /*
     * Build data for parent screen.
     */

    const data: CreateGRNData = {
      supplierInvoiceNumber:
        supplierInvoiceNumber.trim() || undefined,

      receivedDate,

      items:
        purchaseOrder.purchaseOrderItems
          .filter(
            (item) =>
              (receivedQuantities[item.id] ?? 0) > 0
          )
          .map((item) => ({
            itemId: item.itemId,

            itemName: item.itemName,

            orderedQuantity:
              item.orderedQuantity,

            previouslyReceivedQuantity:
              item.receivedQuantity ?? 0,

            quantity:
              receivedQuantities[item.id] ?? 0,

            batchNumber:
              batchNumbers[item.id].trim(),

            expiryDate:
              expiryDates[item.id],

            unitPrice:
              item.unitRate,
          })),
    };

    onCreate(data);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      {/* ======================================================
          TITLE
          ====================================================== */}

      <DialogTitle>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <PackageCheck
              size={21}
              className="text-primary"
            />
          </div>

          <div>
            <p className="text-lg font-semibold">
              Create Goods Received Note
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Receive goods against {purchaseOrder.poNumber}
            </p>
          </div>
        </div>
      </DialogTitle>

      <DialogContent dividers>

        {/* ====================================================
            PURCHASE ORDER INFORMATION
            ==================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          <Info
            icon={<FileText size={16} />}
            label="Purchase Order"
            value={purchaseOrder.poNumber}
          />

          <Info
            icon={<FileText size={16} />}
            label="Requisition"
            value={
              purchaseOrder.requisitionNumber
            }
          />

          <Info
            icon={<Truck size={16} />}
            label="Supplier"
            value={purchaseOrder.supplierName}
          />

          <Info
            icon={<CalendarDays size={16} />}
            label="Order Date"
            value={purchaseOrder.orderDate}
          />

        </div>

        <Divider sx={{ my: 3 }} />

        {/* ====================================================
            RECEIVING INFORMATION
            ==================================================== */}

        <h3 className="text-base font-semibold">
          Receiving Information
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter the delivery information provided by
          the supplier.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

          <Field
            label="Received Date"
            type="date"
            value={receivedDate}
            onChange={setReceivedDate}
            required
          />

          <Field
            label="Supplier Invoice Number"
            value={supplierInvoiceNumber}
            onChange={setSupplierInvoiceNumber}
            placeholder="e.g. INV-2026-001"
          />

        </div>

        <Divider sx={{ my: 3 }} />

        {/* ====================================================
            ITEMS
            ==================================================== */}

        <h3 className="text-base font-semibold">
          Goods Received
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Record the actual quantity received along with
          batch and expiry information.
        </p>

        <div className="mt-4 overflow-hidden rounded-lg border border-border">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px]">

              <thead className="border-b border-border bg-muted/40">

                <tr>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Item
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold">
                    Ordered
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold">
                    Previously Received
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold">
                    Receive Now
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Batch Number
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Expiry Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {purchaseOrder.purchaseOrderItems.map(
                  (item) => {

                    const previouslyReceived =
                      item.receivedQuantity ?? 0;

                    const remaining =
                      Math.max(
                        0,
                        item.orderedQuantity -
                          previouslyReceived
                      );

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-border last:border-0"
                      >

                        {/* ITEM */}

                        <td className="px-4 py-4">

                          <p className="text-sm font-medium">
                            {item.itemName}
                          </p>

                        </td>

                        {/* ORDERED */}

                        <td className="px-4 py-4 text-center text-sm">
                          {item.orderedQuantity}
                        </td>

                        {/* PREVIOUS */}

                        <td className="px-4 py-4 text-center text-sm">
                          {previouslyReceived}
                        </td>

                        {/* RECEIVE NOW */}

                        <td className="px-4 py-4">

                          <input
                            type="number"
                            min={0}
                            max={remaining}
                            value={
                              receivedQuantities[
                                item.id
                              ] ?? 0
                            }
                            onChange={(event) =>
                              handleQuantityChange(
                                item.id,
                                event.target.value,
                                remaining
                              )
                            }
                            className="w-24 rounded-md border border-border bg-background px-3 py-2 text-center text-sm outline-none focus:border-primary"
                          />

                        </td>

                        {/* BATCH */}

                        <td className="px-4 py-4">

                          <input
                            type="text"
                            value={
                              batchNumbers[
                                item.id
                              ] ?? ""
                            }
                            onChange={(event) =>
                              setBatchNumbers(
                                (prev) => ({
                                  ...prev,
                                  [item.id]:
                                    event.target.value,
                                })
                              )
                            }
                            placeholder="Batch no."
                            className="w-36 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                          />

                        </td>

                        {/* EXPIRY */}

                        <td className="px-4 py-4">

                          <input
                            type="date"
                            value={
                              expiryDates[
                                item.id
                              ] ?? ""
                            }
                            onChange={(event) =>
                              setExpiryDates(
                                (prev) => ({
                                  ...prev,
                                  [item.id]:
                                    event.target.value,
                                })
                              )
                            }
                            className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                          />

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ====================================================
            INFORMATION
            ==================================================== */}

        <div className="mt-4 rounded-lg bg-muted/40 p-4">

          <p className="text-sm text-muted-foreground">

            This will create a GRN with status{" "}

            <span className="font-medium text-foreground">
              received
            </span>
            .

          </p>

          <p className="mt-1 text-xs text-muted-foreground">

            The GRN records the goods physically received.
            Inventory stock should be updated only after
            verification/quality checks.

          </p>

        </div>

      </DialogContent>

      {/* ======================================================
          ACTIONS
          ====================================================== */}

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >

        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleCreate}
          startIcon={
            <PackageCheck size={16} />
          }
        >
          Create GRN
        </Button>

      </DialogActions>

    </Dialog>
  );
}

/* ============================================================
   INFO
============================================================ */

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border p-4">

      <div className="flex items-center gap-2 text-muted-foreground">

        {icon}

        <span className="text-xs">
          {label}
        </span>

      </div>

      <p className="mt-2 text-sm font-medium">
        {value}
      </p>

    </div>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>

      <label className="text-sm font-medium">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />

    </div>
  );
}