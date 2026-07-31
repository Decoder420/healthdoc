"use client";

import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  TextField,
  Chip,
} from "@mui/material";

import {
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

import { PurchaseRequisition } from "@/features/inventory/types/purchaseRequisition";

type ApprovalAction =
  | "approve"
  | "reject"
  | "sendBack"
  | null;

interface Props {
  open: boolean;
  requisition: PurchaseRequisition | null;
  onClose: () => void;

  onApprove: (
    requisition: PurchaseRequisition,
    comment: string
  ) => void;

  onReject: (
    requisition: PurchaseRequisition,
    reason: string
  ) => void;

  onSendBack: (
    requisition: PurchaseRequisition,
    reason: string
  ) => void;
}

export default function PurchaseRequisitionApprovalDialog({
  open,
  requisition,
  onClose,
  onApprove,
  onReject,
  onSendBack,
}: Props) {
  const [action, setAction] =
    useState<ApprovalAction>(null);

  const [comment, setComment] = useState("");

  if (!requisition) return null;

  const totalAmount =
    requisition.requisitionItems.reduce(
      (sum, item) =>
        sum + (item.estimatedAmount ?? 0),
      0
    );

  const handleClose = () => {
    setAction(null);
    setComment("");
    onClose();
  };

  const handleSubmit = () => {
    if (!comment.trim()) return;

    if (action === "approve") {
      onApprove(
        requisition,
        comment.trim()
      );
    }

    if (action === "reject") {
      onReject(
        requisition,
        comment.trim()
      );
    }

    if (action === "sendBack") {
      onSendBack(
        requisition,
        comment.trim()
      );
    }

    setAction(null);
    setComment("");
  };

  const isPending =
    requisition.approvalStatus === "Pending";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <div>
          <Typography
            variant="h6"
            fontWeight={600}
          >
            Purchase Requisition Approval
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
              Indent Number
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
              Priority
            </p>

            <div className="mt-1">
              <Chip
                label={requisition.priority}
                size="small"
              />
            </div>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Items */}

        <Typography
          variant="subtitle1"
          fontWeight={600}
        >
          Requested Items
        </Typography>

        <div className="mt-3 overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-sm">
                  Item
                </th>

                <th className="px-4 py-3 text-center text-sm">
                  Quantity
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
                      {item.itemName}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {item.quantity}
                    </td>

                    <td className="px-4 py-3 text-right">
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

        <div className="mt-4 rounded-lg bg-muted/40 p-4">
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

          <div className="mt-2 flex justify-between">
            <span className="font-semibold">
              Estimated Total
            </span>

            <span className="font-semibold">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Approval */}

        {isPending && (
          <>
            <Typography
              variant="subtitle1"
              fontWeight={600}
            >
              Approval Decision
            </Typography>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <Button
                variant={
                  action === "approve"
                    ? "contained"
                    : "outlined"
                }
                color="success"
                startIcon={
                  <CheckCircle2 size={18} />
                }
                onClick={() =>
                  setAction("approve")
                }
              >
                Approve
              </Button>

              <Button
                variant={
                  action === "reject"
                    ? "contained"
                    : "outlined"
                }
                color="error"
                startIcon={
                  <XCircle size={18} />
                }
                onClick={() =>
                  setAction("reject")
                }
              >
                Reject
              </Button>

              <Button
                variant={
                  action === "sendBack"
                    ? "contained"
                    : "outlined"
                }
                color="warning"
                startIcon={
                  <RotateCcw size={18} />
                }
                onClick={() =>
                  setAction("sendBack")
                }
              >
                Send Back
              </Button>
            </div>

            {action && (
              <div className="mt-5">
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  required
                  label={
                    action === "approve"
                      ? "Approval Comment"
                      : action === "reject"
                      ? "Reason for Rejection"
                      : "Correction Required"
                  }
                  placeholder={
                    action === "approve"
                      ? "Add approval remarks..."
                      : action === "reject"
                      ? "Enter reason for rejecting this requisition..."
                      : "Explain what needs to be corrected..."
                  }
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                />
              </div>
            )}
          </>
        )}

        {/* Existing decision */}

        {!isPending && (
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Typography fontWeight={600}>
                Approval Status
              </Typography>

              <Chip
                label={requisition.approvalStatus}
                color={
                  requisition.approvalStatus ===
                  "Approved"
                    ? "success"
                    : requisition.approvalStatus ===
                      "Rejected"
                    ? "error"
                    : "warning"
                }
                size="small"
              />
            </div>

            {requisition.approvalComment && (
              <Typography
                variant="body2"
                color="text.secondary"
                className="mt-3"
              >
                {requisition.approvalComment}
              </Typography>
            )}
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        {action && (
          <Button
            variant="contained"
            color={
              action === "approve"
                ? "success"
                : action === "reject"
                ? "error"
                : "warning"
            }
            onClick={handleSubmit}
            disabled={!comment.trim()}
          >
            {action === "approve"
              ? "Approve Requisition"
              : action === "reject"
              ? "Reject Requisition"
              : "Send Back"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}