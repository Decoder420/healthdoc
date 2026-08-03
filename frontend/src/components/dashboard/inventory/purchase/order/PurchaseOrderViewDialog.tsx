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

import { PurchaseOrder } from "@/features/inventory/types/purchaseOrder";

interface Props {
  open: boolean;
  purchaseOrder: PurchaseOrder | null;
  onClose: () => void;
}

export default function PurchaseOrderViewDialog({
  open,
  purchaseOrder,
  onClose,
}: Props) {
  if (!purchaseOrder) return null;

  const getStatusColor = () => {
    switch (purchaseOrder.status) {
      case "Approved":
        return "success";

      case "Pending Approval":
        return "warning";

      case "Sent to Supplier":
        return "info";

      case "Partially Received":
        return "warning";

      case "Fully Received":
        return "success";

      case "Cancelled":
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
      <DialogTitle sx={{ pb: 2 }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <FileText
                size={21}
                className="text-primary"
              />
            </div>

            <div>
              <Typography
                variant="h6"
                fontWeight={600}
              >
                Purchase Order
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {purchaseOrder.poNumber}
              </Typography>
            </div>
          </div>

          <Chip
            label={purchaseOrder.status}
            size="small"
            color={getStatusColor() as any}
          />
        </div>
      </DialogTitle>

      <DialogContent dividers>
        {/* PO INFORMATION */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <InfoCard
            icon={<FileText size={16} />}
            label="Purchase Order"
            value={purchaseOrder.poNumber}
          />

          <InfoCard
            icon={<FileText size={16} />}
            label="Purchase Requisition"
            value={purchaseOrder.requisitionNumber}
          />

          <InfoCard
            icon={<CalendarDays size={16} />}
            label="Order Date"
            value={purchaseOrder.orderDate}
          />

          <InfoCard
            icon={<Truck size={16} />}
            label="Supplier"
            value={purchaseOrder.supplierName}
          />

          <InfoCard
            icon={<Building2 size={16} />}
            label="Department"
            value={purchaseOrder.departmentName}
          />

          <InfoCard
            icon={<CalendarDays size={16} />}
            label="Expected Delivery"
            value={
              purchaseOrder.expectedDeliveryDate ??
              "Not specified"
            }
          />
        </div>

        <Divider sx={{ my: 3 }} />

        {/* ITEMS */}

        <Typography
          variant="subtitle1"
          fontWeight={600}
        >
          Ordered Items
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Items generated from the approved purchase
          requisition.
        </Typography>

        <div className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Item
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold">
                    Ordered Qty
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold">
                    Received Qty
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold">
                    Unit Rate
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {purchaseOrder.purchaseOrderItems.map(
                  (item) => (
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
                        {item.receivedQuantity ?? 0}
                      </td>

                      <td className="px-4 py-3 text-right text-sm">
                        ₹
                        {item.unitRate.toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="px-4 py-3 text-right text-sm font-medium">
                        ₹
                        {item.amount.toLocaleString(
                          "en-IN"
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SUMMARY */}

        <div className="mt-5 ml-auto max-w-sm rounded-lg bg-muted/40 p-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Total Items
            </span>

            <span className="font-medium">
              {purchaseOrder.items}
            </span>
          </div>

          <div className="mt-2 flex justify-between">
            <span className="text-sm text-muted-foreground">
              Total Quantity
            </span>

            <span className="font-medium">
              {purchaseOrder.totalQuantity}
            </span>
          </div>

          <div className="mt-2 flex justify-between">
            <span className="text-sm text-muted-foreground">
              Subtotal
            </span>

            <span>
              ₹
              {purchaseOrder.subtotal.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <div className="mt-2 flex justify-between">
            <span className="text-sm text-muted-foreground">
              Tax
            </span>

            <span>
              ₹
              {purchaseOrder.taxAmount.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <Divider sx={{ my: 1.5 }} />

          <div className="flex justify-between text-lg font-semibold">
            <span>Grand Total</span>

            <span>
              ₹
              {purchaseOrder.grandTotal.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>
        </div>

        <Divider sx={{ my: 3 }} />

        {/* TERMS */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <InfoCard
            icon={<Package size={16} />}
            label="Payment Terms"
            value={
              purchaseOrder.paymentTerms ??
              "Not specified"
            }
          />

          <InfoCard
            icon={<Truck size={16} />}
            label="Delivery Terms"
            value={
              purchaseOrder.deliveryTerms ??
              "Not specified"
            }
          />

          <InfoCard
            icon={<User size={16} />}
            label="Created By"
            value={purchaseOrder.createdBy}
          />
        </div>

        {purchaseOrder.remarks && (
          <div className="mt-5 rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">
              Remarks
            </p>

            <p className="mt-1 text-sm">
              {purchaseOrder.remarks}
            </p>
          </div>
        )}

        {purchaseOrder.approvedBy && (
          <div className="mt-4 rounded-lg border border-border p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Approved By
              </span>

              <span className="font-medium">
                {purchaseOrder.approvedBy}
              </span>
            </div>

            {purchaseOrder.approvedAt && (
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Approved At
                </span>

                <span className="font-medium">
                  {purchaseOrder.approvedAt}
                </span>
              </div>
            )}
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

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