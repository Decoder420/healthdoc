
"use client";

import { useEffect, useState } from "react";

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import {
  CalendarDays,
  FileText,
  Package,
  Truck,
  User,
} from "lucide-react";

import type {
  GRN,
  GRNStatus,
} from "@/features/inventory/types/grn";

interface Props {
  open: boolean;
  grn: GRN | null;
  onClose: () => void;

  onStatusUpdate: (
    grnId: string,
    status: GRNStatus
  ) => void;
}

export default function GRNViewDialog({
  open,
  grn,
  onClose,
  onStatusUpdate,
}: Props) {
  const [selectedStatus, setSelectedStatus] =
    useState<GRNStatus>("draft");

  /*
   * ============================================================
   * SYNC STATUS WITH SELECTED GRN
   * ============================================================
   */

  useEffect(() => {
    if (grn) {
      setSelectedStatus(grn.status);
    }
  }, [grn]);

  if (!grn) return null;

  /*
   * ============================================================
   * STATUS COLOR
   * ============================================================
   */

  const getStatusColor = (status: GRNStatus) => {
    switch (status) {
      case "draft":
        return "default";

      case "received":
        return "warning";

      case "verified":
        return "success";

      case "cancelled":
        return "error";

      default:
        return "default";
    }
  };

  /*
   * ============================================================
   * STATUS LABEL
   * ============================================================
   */

  const getStatusLabel = (status: GRNStatus) => {
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
   * STATUS DESCRIPTION
   * ============================================================
   */

  const getStatusDescription = (status: GRNStatus) => {
    switch (status) {
      case "draft":
        return "This GRN is still in draft state.";

      case "received":
        return "Goods have been received and recorded. The GRN should be inspected before verification.";

      case "verified":
        return "The received goods have been verified and can proceed to stock entry.";

      case "cancelled":
        return "This GRN has been cancelled and should not affect inventory stock.";

      default:
        return "";
    }
  };

  /*
   * ============================================================
   * ITEMS
   * ============================================================
   */

  const items = grn.grnItems ?? [];

  /*
   * ============================================================
   * TOTAL QUANTITY
   *
   * Your GRNItem type currently uses `quantity`.
   * Therefore quantity = received quantity.
   * ============================================================
   */

  const calculatedTotalQuantity = items.reduce(
    (sum, item) => {
      return sum + Number(item.quantity ?? 0);
    },
    0
  );

  const totalQuantity =
    Number(grn.totalQuantity ?? 0) ||
    calculatedTotalQuantity;

  /*
   * ============================================================
   * TOTAL AMOUNT
   * ============================================================
   */

  const totalAmount = items.reduce(
    (sum, item) => {
      const quantity = Number(
        item.quantity ?? 0
      );

      const unitPrice = Number(
        item.unitPrice ?? 0
      );

      const amount =
        Number(item.amount ?? 0) ||
        quantity * unitPrice;

      return sum + amount;
    },
    0
  );

  /*
   * ============================================================
   * UPDATE STATUS
   * ============================================================
   */

  const handleStatusUpdate = () => {
    if (selectedStatus === grn.status) {
      return;
    }

    onStatusUpdate(
      grn.id,
      selectedStatus
    );
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

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

      <DialogTitle sx={{ pb: 2 }}>
        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="rounded-lg bg-primary/10 p-2">
              <Package
                size={21}
                className="text-primary"
              />
            </div>

            <div>
              <Typography
                variant="h6"
                fontWeight={600}
              >
                Goods Received Note
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {grn.grnNumber || "GRN"}
              </Typography>
            </div>

          </div>

          <Chip
            label={getStatusLabel(grn.status)}
            size="small"
            color={
              getStatusColor(
                grn.status
              ) as any
            }
          />

        </div>
      </DialogTitle>

      <DialogContent dividers>

        {/* ====================================================
            GRN INFORMATION
        ==================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <InfoCard
            icon={<Package size={16} />}
            label="GRN Number"
            value={
              grn.grnNumber ||
              "Not specified"
            }
          />

          <InfoCard
            icon={<FileText size={16} />}
            label="Purchase Order"
            value={
              grn.poNumber ||
              "Not specified"
            }
          />

          <InfoCard
            icon={<FileText size={16} />}
            label="Purchase Requisition"
            value={
              grn.requisitionNumber ||
              "Not specified"
            }
          />

          <InfoCard
            icon={<Truck size={16} />}
            label="Supplier"
            value={
              grn.supplierName ||
              "Not specified"
            }
          />

          <InfoCard
            icon={<CalendarDays size={16} />}
            label="Received Date"
            value={
              grn.receivedDate ||
              "Not specified"
            }
          />

          <InfoCard
            icon={<User size={16} />}
            label="Received By"
            value={
              grn.receivedBy ||
              "Not specified"
            }
          />

        </div>

        <Divider sx={{ my: 3 }} />

        {/* ====================================================
            DELIVERY INFORMATION
        ==================================================== */}

        <Typography
          variant="subtitle1"
          fontWeight={600}
        >
          Delivery Information
        </Typography>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

          <InfoCard
            icon={<FileText size={16} />}
            label="Supplier Invoice"
            value={
              grn.invoiceNumber ||
              "Not provided"
            }
          />

          <InfoCard
            icon={<CalendarDays size={16} />}
            label="Created At"
            value={
              grn.createdAt ||
              "Not specified"
            }
          />

        </div>

        <Divider sx={{ my: 3 }} />

        {/* ====================================================
            RECEIVED ITEMS
        ==================================================== */}

        <Typography
          variant="subtitle1"
          fontWeight={600}
        >
          Received Items
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Items received against the purchase order.
        </Typography>

        <div className="overflow-hidden rounded-lg border border-border">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead className="border-b bg-muted/60">

                <tr>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Item
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold">
                    Received Quantity
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Batch Number
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Expiry Date
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

                {items.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-sm text-muted-foreground"
                    >
                      No items found in this GRN.
                    </td>

                  </tr>

                ) : (

                  items.map((item) => {

                    /*
                     * IMPORTANT:
                     * GRNItem currently has `quantity`.
                     * We use it as Received Quantity.
                     */

                    const receivedQuantity =
                      Number(
                        item.quantity ?? 0
                      );

                    const unitPrice =
                      Number(
                        item.unitPrice ?? 0
                      );

                    const amount =
                      Number(
                        item.amount ?? 0
                      ) ||
                      receivedQuantity *
                        unitPrice;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-border last:border-0"
                      >

                        {/* ITEM */}

                        <td className="px-4 py-4">

                          <p className="text-sm font-medium">
                            {item.itemName ||
                              "Unnamed Item"}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.itemId ||
                              "No item ID"}
                          </p>

                        </td>

                        {/* RECEIVED QUANTITY */}

                        <td className="px-4 py-4 text-center">

                          <span className="text-sm font-semibold">

                            {receivedQuantity.toLocaleString(
                              "en-IN"
                            )}

                          </span>

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
                  })

                )}

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
            value={totalQuantity}
          />

          <SummaryRow
            label="Total Amount"
            value={totalAmount}
            currency
          />

        </div>

        <Divider sx={{ my: 3 }} />

        {/* ====================================================
            STATUS UPDATE
        ==================================================== */}

        <div className="rounded-lg border border-border p-4">

          <div className="flex items-center gap-2">

            <Package
              size={17}
              className="text-primary"
            />

            <p className="text-sm font-semibold">
              Update GRN Status
            </p>

          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">

            <FormControl
              size="small"
              sx={{
                minWidth: 220,
              }}
            >

              <InputLabel>
                Status
              </InputLabel>

              <Select
                value={selectedStatus}
                label="Status"
                onChange={(event) => {
                  setSelectedStatus(
                    event.target.value as GRNStatus
                  );
                }}
              >

                {/* Draft */}

                <MenuItem value="draft">
                  Draft
                </MenuItem>

                {/* Received */}

                <MenuItem value="received">
                  Received
                </MenuItem>

                {/* Cancelled */}

                <MenuItem value="cancelled">
                  Cancelled
                </MenuItem>

              </Select>

            </FormControl>

            <Button
              variant="contained"
              onClick={handleStatusUpdate}
              disabled={
                selectedStatus ===
                grn.status
              }
            >
              Update Status
            </Button>

          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            {getStatusDescription(
              selectedStatus
            )}
          </p>

          {grn.status === "received" && (
            <p className="mt-2 text-xs text-muted-foreground">
              To mark this GRN as Verified, use
              the Inspection / Verification
              action.
            </p>
          )}

        </div>

        {/* ====================================================
            REMARKS
        ==================================================== */}

        {grn.remarks && (

          <div className="mt-5 rounded-lg border border-border p-4">

            <p className="text-xs text-muted-foreground">
              Remarks
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
          Close
        </Button>

      </DialogActions>

    </Dialog>
  );
}

/* ============================================================
   INFO CARD
============================================================ */

function InfoCard({
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
  const safeValue = Number(value ?? 0);

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

