
"use client";

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";

import {
  Building2,
  CalendarDays,
  FileText,
  Package,
  Truck,
  User,
} from "lucide-react";

import { GRN } from "@/features/inventory/types/grn";

interface Props {
  open: boolean;
  grn: GRN | null;
  onClose: () => void;
}

export default function GRNViewDialog({
  open,
  grn,
  onClose,
}: Props) {
  if (!grn) return null;

  const getStatusColor = () => {
    switch (grn.status as string) {
      case "Draft":
        return "default";

      case "Pending Inspection":
        return "warning";

      case "Inspected":
        return "info";

      case "Completed":
        return "success";

      case "Rejected":
        return "error";

      default:
        return "default";
    }
  };

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
                {grn.grnNumber}
              </Typography>
            </div>

          </div>

          <Chip
            label={grn.status}
            size="small"
            color={getStatusColor() as any}
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
            value={grn.grnNumber}
          />

          <InfoCard
            icon={<FileText size={16} />}
            label="Purchase Order"
            value={grn.poNumber}
          />

          <InfoCard
            icon={<FileText size={16} />}
            label="Purchase Requisition"
            value={
              grn.requisitionNumber ??
              "Not specified"
            }
          />

          <InfoCard
            icon={<Truck size={16} />}
            label="Supplier"
            value={grn.supplierName}
          />

          <InfoCard
            icon={<Building2 size={16} />}
            label="Department"
            value={grn.departmentName}
          />

          <InfoCard
            icon={<CalendarDays size={16} />}
            label="Received Date"
            value={grn.receivedDate}
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

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

          <InfoCard
            icon={<FileText size={16} />}
            label="Supplier Invoice"
            value={
              grn.supplierInvoiceNumber ??
              "Not provided"
            }
          />

          <InfoCard
            icon={<CalendarDays size={16} />}
            label="Invoice Date"
            value={
              grn.supplierInvoiceDate ??
              "Not provided"
            }
          />

          <InfoCard
            icon={<Truck size={16} />}
            label="Delivery Challan"
            value={
              grn.deliveryChallanNumber ??
              "Not provided"
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

            <table className="w-full min-w-[900px]">

              <thead className="border-b bg-muted/60">

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
                    Received Now
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold">
                    Accepted
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold">
                    Rejected
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Batch
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Expiry
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold">
                    Amount
                  </th>

                </tr>

              </thead>

              <tbody>

                {grn.grnItems.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0"
                  >

                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">
                        {item.itemName}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-center text-sm">
                      {item.orderedQuantity}
                    </td>

                    <td className="px-4 py-3 text-center text-sm">
                      {item.previouslyReceivedQuantity}
                    </td>

                    <td className="px-4 py-3 text-center text-sm font-medium">
                      {item.receivedQuantity}
                    </td>

                    <td className="px-4 py-3 text-center text-sm">
                      {item.acceptedQuantity}
                    </td>

                    <td className="px-4 py-3 text-center text-sm">
                      {item.rejectedQuantity}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {item.batchNumber ?? "—"}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {item.expiryDate ?? "—"}
                    </td>

                    <td className="px-4 py-3 text-right text-sm font-medium">
                      ₹
                      {item.amount.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                  </tr>

                ))}

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
            value={grn.totalItems}
          />

          <SummaryRow
            label="Total Ordered Quantity"
            value={grn.totalOrderedQuantity}
          />

          <SummaryRow
            label="Total Received Quantity"
            value={grn.totalReceivedQuantity}
          />

          <SummaryRow
            label="Accepted Quantity"
            value={grn.acceptedQuantity}
          />

          <SummaryRow
            label="Rejected Quantity"
            value={grn.rejectedQuantity}
          />

        </div>

        <Divider sx={{ my: 3 }} />

        {/* ====================================================
            RECEIVING INFORMATION
            ==================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <InfoCard
            icon={<User size={16} />}
            label="Received By"
            value={grn.receivedBy}
          />

          <InfoCard
            icon={<Package size={16} />}
            label="Inspection"
            value={
              grn.inspectionRequired
                ? "Required"
                : "Not Required"
            }
          />

          <InfoCard
            icon={<CalendarDays size={16} />}
            label="Created At"
            value={grn.createdAt}
          />

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

      <DialogActions sx={{ px: 3, py: 2 }}>

        <Button onClick={onClose}>
          Close
        </Button>

      </DialogActions>

    </Dialog>
  );
}

/*
 * ============================================================
 * INFO CARD
 * ============================================================
 */

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

/*
 * ============================================================
 * SUMMARY ROW
 * ============================================================
 */

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex justify-between py-1">

      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="text-sm font-medium">
        {value}
      </span>

    </div>
  );
}

