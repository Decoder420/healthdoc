"use client";

import {
  Button,
  Chip,
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

import type { GRN } from "@/features/inventory/types/grn";

interface Props {
  open: boolean;
  grn: GRN | null;
  onClose: () => void;
  onComplete: (updatedGRN: GRN) => void;
}

export default function GRNInspectionDialog({
  open,
  grn,
  onClose,
  onComplete,
}: Props) {
  if (!grn) return null;

  /*
   * ============================================================
   * SAFE ITEMS
   * ============================================================
   */

  const items = grn.grnItems ?? [];

  /*
   * ============================================================
   * RECEIVED QUANTITY
   *
   * Prefer totalQuantity if available.
   * Otherwise calculate it from the items.
   * ============================================================
   */

  const calculatedTotalQuantity = items.reduce(
    (sum, item) =>
      sum +
      Number(
        item.receivedQuantity ??
          item.quantity ??
          0
      ),
    0
  );

  const receivedQuantity =
    Number(grn.totalQuantity ?? 0) ||
    calculatedTotalQuantity;

  /*
   * ============================================================
   * TOTAL AMOUNT
   * ============================================================
   */

  const totalAmount = items.reduce(
    (sum, item) => {
      const quantity =
        Number(
          item.receivedQuantity ??
            item.quantity ??
            0
        );

      const unitPrice =
        Number(item.unitPrice ?? 0);

      const amount =
        Number(item.amount ?? 0) ||
        quantity * unitPrice;

      return sum + amount;
    },
    0
  );

  /*
   * ============================================================
   * VERIFY
   * ============================================================
   */

  const handleVerify = () => {
    const updatedGRN: GRN = {
      ...grn,
      status: "verified",

      totalQuantity:
        receivedQuantity,

      totalItems:
        Number(grn.totalItems ?? items.length),
    };

    onComplete(updatedGRN);
  };

  /*
   * ============================================================
   * STATUS LABEL
   * ============================================================
   */

  const statusLabel =
    grn.status === "verified"
      ? "Verified"
      : grn.status === "cancelled"
      ? "Cancelled"
      : grn.status === "draft"
      ? "Draft"
      : "Received";

  const statusColor =
    grn.status === "verified"
      ? "success"
      : grn.status === "cancelled"
      ? "error"
      : grn.status === "draft"
      ? "default"
      : "warning";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <DialogTitle>
        <div className="flex items-start justify-between">

          <div className="flex items-start gap-3">

            <div className="rounded-lg bg-primary/10 p-2">
              <PackageCheck
                size={21}
                className="text-primary"
              />
            </div>

            <div>

              <p className="text-lg font-semibold">
                Verify Goods Receipt
              </p>

              <p className="text-sm text-muted-foreground">
                {grn.grnNumber}
              </p>

            </div>

          </div>

          <Chip
            label={statusLabel}
            size="small"
            color={statusColor as any}
          />

        </div>
      </DialogTitle>

      <DialogContent dividers>

        {/* ====================================================
            GRN INFORMATION
        ==================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          <Info
            icon={<FileText size={16} />}
            label="Purchase Order"
            value={
              grn.poNumber ||
              "Not specified"
            }
          />

          <Info
            icon={<Truck size={16} />}
            label="Supplier"
            value={
              grn.supplierName ||
              "Not specified"
            }
          />

          <Info
            icon={<CalendarDays size={16} />}
            label="Received Date"
            value={
              grn.receivedDate ||
              "Not specified"
            }
          />

          <Info
            icon={<PackageCheck size={16} />}
            label="Received Quantity"
            value={receivedQuantity.toLocaleString(
              "en-IN"
            )}
          />

        </div>

        <Divider sx={{ my: 3 }} />

        {/* ====================================================
            ITEMS
        ==================================================== */}

        <div>

          <h3 className="text-base font-semibold">
            Received Items
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Verify the goods received against the purchase order.
          </p>

        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-border">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="border-b border-border bg-muted/40">

                <tr>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Item
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold">
                    Received Quantity
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Batch
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Expiry
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold">
                    Unit Price
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold">
                    Amount
                  </th>

                </tr>

              </thead>

              <tbody>

                {items.map((item) => {

                  /*
                   * ------------------------------------------
                   * SAFE VALUES
                   * ------------------------------------------
                   */

                  const quantity =
                    Number(
                      item.receivedQuantity ??
                        item.quantity ??
                        0
                    );

                  const unitPrice =
                    Number(
                      item.unitPrice ?? 0
                    );

                  const amount =
                    Number(
                      item.amount ?? 0
                    ) ||
                    quantity * unitPrice;

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-border last:border-0"
                    >

                      {/* ITEM */}

                      <td className="px-4 py-4 text-sm font-medium">
                        {item.itemName ||
                          "Unnamed Item"}
                      </td>

                      {/* RECEIVED QUANTITY */}

                      <td className="px-4 py-4 text-center text-sm font-semibold">
                        {quantity.toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      {/* BATCH */}

                      <td className="px-4 py-4 text-sm">
                        {item.batchNumber ||
                          "Not specified"}
                      </td>

                      {/* EXPIRY */}

                      <td className="px-4 py-4 text-sm">
                        {item.expiryDate ||
                          "Not specified"}
                      </td>

                      {/* UNIT PRICE */}

                      <td className="px-4 py-4 text-right text-sm">
                        ₹
                        {unitPrice.toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      {/* AMOUNT */}

                      <td className="px-4 py-4 text-right text-sm font-medium">
                        ₹
                        {amount.toLocaleString(
                          "en-IN"
                        )}
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

        {/* ====================================================
            SUMMARY
        ==================================================== */}

        <div className="mt-5 ml-auto max-w-sm rounded-lg bg-muted/40 p-4">

          <SummaryRow
            label="Total Items"
            value={items.length}
          />

          <SummaryRow
            label="Total Quantity"
            value={receivedQuantity}
          />

          <SummaryRow
            label="Total Amount"
            value={totalAmount}
            currency
          />

        </div>

        <Divider sx={{ my: 3 }} />

        {/* ====================================================
            VERIFICATION INFORMATION
        ==================================================== */}

        <div className="rounded-lg border border-border p-4">

          <div className="flex items-center gap-2">

            <PackageCheck
              size={17}
              className="text-primary"
            />

            <p className="text-sm font-semibold">
              Verification
            </p>

          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Verify the received quantity, batch
            information, expiry dates and pricing
            before completing the GRN verification.
          </p>

        </div>

        {/* ====================================================
            REMARKS
        ==================================================== */}

        {grn.remarks && (
          <div className="mt-5 rounded-lg border border-border p-4">

            <p className="text-xs text-muted-foreground">
              Receiving Remarks
            </p>

            <p className="mt-1 text-sm">
              {grn.remarks}
            </p>

          </div>
        )}

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
          onClick={handleVerify}
          disabled={
            grn.status === "verified" ||
            grn.status === "cancelled"
          }
          startIcon={
            <PackageCheck size={16} />
          }
        >
          Verify GRN
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
   SUMMARY ROW
============================================================ */

function SummaryRow({
  label,
  value,
  currency = false,
}: {
  label: string;
  value: number;
  currency?: boolean;
}) {
  const safeValue =
    Number(value ?? 0);

  return (
    <div className="flex justify-between py-1">

      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="text-sm font-medium">

        {currency
          ? `₹${safeValue.toLocaleString(
              "en-IN"
            )}`
          : safeValue.toLocaleString(
              "en-IN"
            )}

      </span>

    </div>
  );
}