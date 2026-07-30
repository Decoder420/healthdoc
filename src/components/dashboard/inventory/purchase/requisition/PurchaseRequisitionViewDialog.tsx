"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Chip,
  Typography,
} from "@mui/material";

import { PurchaseRequisition } from "@/features/inventory/types/purchaseRequisition";

interface Props {
  open: boolean;
  requisition: PurchaseRequisition | null;
  onClose: () => void;
}

export default function PurchaseRequisitionViewDialog({
  open,
  requisition,
  onClose,
}: Props) {
  if (!requisition) return null;

  const totalAmount =
    requisition.requisitionItems.reduce(
      (sum, item) =>
        sum + (item.estimatedAmount ?? 0),
      0
    );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <div>
          <Typography
            variant="h6"
            fontWeight={600}
          >
            Purchase Requisition Details
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {requisition.requisitionNumber}
          </Typography>
        </div>
      </DialogTitle>

      <DialogContent dividers>
        {/* Basic Information */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">
              Requisition Number
            </p>

            <p className="mt-1 font-medium">
              {requisition.requisitionNumber}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Source Indent
            </p>

            <p className="mt-1 font-medium">
              {requisition.indentNumber}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Department
            </p>

            <p className="mt-1 font-medium">
              {requisition.departmentName}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Requested By
            </p>

            <p className="mt-1 font-medium">
              {requisition.requestedBy}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Supplier
            </p>

            <p className="mt-1 font-medium">
              {requisition.supplierName ??
                "Not Assigned"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Created Date
            </p>

            <p className="mt-1 font-medium">
              {requisition.createdAt}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Priority
            </p>

            <div className="mt-1">
              <Chip
                label={requisition.priority}
                size="small"
                color={
                  requisition.priority === "Emergency"
                    ? "error"
                    : requisition.priority === "Urgent"
                    ? "warning"
                    : "default"
                }
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Status
            </p>

            <div className="mt-1">
              <Chip
                label={requisition.status}
                size="small"
                color={
                  requisition.status === "Approved"
                    ? "success"
                    : requisition.status === "Rejected"
                    ? "error"
                    : requisition.status ===
                      "Converted to PO"
                    ? "info"
                    : "warning"
                }
              />
            </div>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Requested Items */}

        <div>
          <div className="mb-4">
            <Typography
              variant="h6"
              fontWeight={600}
            >
              Requested Items
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Items included in this purchase requisition.
            </Typography>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead className="border-b bg-muted/40">
                <tr className="text-left">
                  <th className="px-4 py-3 text-sm">
                    Item
                  </th>

                  <th className="px-4 py-3 text-center text-sm">
                    Quantity
                  </th>

                  <th className="px-4 py-3 text-right text-sm">
                    Est. Rate
                  </th>

                  <th className="px-4 py-3 text-right text-sm">
                    Est. Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {requisition.requisitionItems.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium">
                          {item.itemName}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {item.itemId}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-center">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {item.estimatedRate != null
                          ? `₹${item.estimatedRate.toLocaleString()}`
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-right font-medium">
                        {item.estimatedAmount != null
                          ? `₹${item.estimatedAmount.toLocaleString()}`
                          : "—"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}

          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-sm rounded-lg bg-muted/40 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Items
                </span>

                <span className="font-medium">
                  {requisition.items}
                </span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Quantity
                </span>

                <span className="font-medium">
                  {requisition.totalQuantity}
                </span>
              </div>

              <Divider className="my-3" />

              <div className="flex justify-between">
                <span className="font-semibold">
                  Estimated Total
                </span>

                <span className="font-semibold">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Remarks */}

        {requisition.remarks && (
          <>
            <Divider className="my-6" />

            <div>
              <Typography
                variant="subtitle1"
                fontWeight={600}
              >
                Remarks
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                className="mt-1"
              >
                {requisition.remarks}
              </Typography>
            </div>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="contained"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}