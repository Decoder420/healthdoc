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
  Box,
} from "@mui/material";

import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  Building2,
  User,
  Package,
  CalendarDays,
  Truck,
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

  /*
   * --------------------------------------------------
   * TOTAL AMOUNT
   * --------------------------------------------------
   */

  const totalAmount =
    requisition.requisitionItems.reduce(
      (sum, item) =>
        sum + (item.estimatedAmount ?? 0),
      0
    );

  /*
   * --------------------------------------------------
   * STATUS
   * --------------------------------------------------
   */

  const isPending =
    requisition.approvalStatus === "Pending";

  /*
   * --------------------------------------------------
   * CLOSE
   * --------------------------------------------------
   */

  const handleClose = () => {
    setAction(null);
    setComment("");
    onClose();
  };

  /*
   * --------------------------------------------------
   * SUBMIT DECISION
   * --------------------------------------------------
   */

  const handleSubmit = () => {
    const value = comment.trim();

    if (!value || !action) return;

    if (action === "approve") {
      onApprove(requisition, value);
    }

    if (action === "reject") {
      onReject(requisition, value);
    }

    if (action === "sendBack") {
      onSendBack(requisition, value);
    }

    setAction(null);
    setComment("");
  };

  /*
   * --------------------------------------------------
   * ACTION LABEL
   * --------------------------------------------------
   */

  const actionLabel =
    action === "approve"
      ? "Approval Comment"
      : action === "reject"
      ? "Reason for Rejection"
      : "Correction Required";

  /*
   * --------------------------------------------------
   * ACTION PLACEHOLDER
   * --------------------------------------------------
   */

  const actionPlaceholder =
    action === "approve"
      ? "Add approval remarks..."
      : action === "reject"
      ? "Explain why this requisition is being rejected..."
      : "Explain what needs to be corrected...";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <DialogTitle sx={{ pb: 2 }}>
        <div className="flex items-start justify-between">

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
                Purchase Requisition Approval
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Review requisition before it proceeds
                to Purchase Order.
              </Typography>
            </div>

          </div>

          <Chip
            size="small"
            label={requisition.approvalStatus}
            color={
              requisition.approvalStatus ===
              "Approved"
                ? "success"
                : requisition.approvalStatus ===
                  "Rejected"
                ? "error"
                : requisition.approvalStatus ===
                  "Sent Back"
                ? "warning"
                : "default"
            }
          />

        </div>
      </DialogTitle>

      <DialogContent dividers>

        {/* =================================================
            PR HEADER INFORMATION
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <InfoCard
            icon={<FileText size={16} />}
            label="Requisition"
            value={requisition.requisitionNumber}
          />

          <InfoCard
            icon={<FileText size={16} />}
            label="Source Indent"
            value={requisition.indentNumber}
          />

          <InfoCard
            icon={<Building2 size={16} />}
            label="Department"
            value={requisition.departmentName}
          />

          <InfoCard
            icon={<User size={16} />}
            label="Requested By"
            value={requisition.requestedBy}
          />

          <InfoCard
            icon={<Truck size={16} />}
            label="Supplier"
            value={
              requisition.supplierName ||
              "Not Assigned"
            }
          />

          <InfoCard
            icon={<CalendarDays size={16} />}
            label="Created"
            value={requisition.createdAt}
          />

        </div>

        <Divider sx={{ my: 3 }} />

        {/* =================================================
            PRIORITY + REQUEST SUMMARY
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-border p-4">

            <p className="text-xs text-muted-foreground">
              Priority
            </p>

            <div className="mt-2">
              <Chip
                label={requisition.priority}
                size="small"
                color={
                  requisition.priority ===
                  "Emergency"
                    ? "error"
                    : requisition.priority ===
                      "Urgent"
                    ? "warning"
                    : "default"
                }
              />
            </div>

          </div>

          <div className="rounded-lg border border-border p-4">

            <div className="flex items-center gap-2">
              <Package size={16} />

              <p className="text-xs text-muted-foreground">
                Total Items
              </p>
            </div>

            <p className="mt-2 text-lg font-semibold">
              {requisition.items}
            </p>

          </div>

          <div className="rounded-lg border border-border p-4">

            <p className="text-xs text-muted-foreground">
              Total Quantity
            </p>

            <p className="mt-2 text-lg font-semibold">
              {requisition.totalQuantity}
            </p>

          </div>

        </div>

        <Divider sx={{ my: 3 }} />

        {/* =================================================
            REQUESTED ITEMS
        ================================================= */}

        <div className="mb-3">

          <Typography
            variant="subtitle1"
            fontWeight={600}
          >
            Requested Items
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Verify the requested quantities and
            estimated cost before approval.
          </Typography>

        </div>

        <div className="overflow-hidden rounded-lg border border-border">

          <div className="max-h-[280px] overflow-y-auto">

            <table className="w-full">

              <thead className="sticky top-0 z-10 border-b bg-muted/90">

                <tr>

                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Item
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold">
                    Quantity
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold">
                    Estimated Amount
                  </th>

                </tr>

              </thead>

              <tbody>

                {requisition.requisitionItems.map(
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
                        {item.quantity}
                      </td>

                      <td className="px-4 py-3 text-right text-sm font-medium">
                        {item.estimatedAmount !=
                        null
                          ? `₹${item.estimatedAmount.toLocaleString()}`
                          : "—"}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =================================================
            COST SUMMARY
        ================================================= */}

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

          <Divider sx={{ my: 1.5 }} />

          <div className="flex justify-between">

            <span className="font-semibold">
              Estimated Total
            </span>

            <span className="text-lg font-semibold">
              ₹{totalAmount.toLocaleString()}
            </span>

          </div>

        </div>

        <Divider sx={{ my: 3 }} />

        {/* =================================================
            APPROVAL DECISION
        ================================================= */}

        {isPending ? (
          <>
            <Typography
              variant="subtitle1"
              fontWeight={600}
            >
              Approval Decision
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Select what should happen to this
              purchase requisition.
            </Typography>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">

              {/* APPROVE */}

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
                onClick={() => {
                  setAction("approve");
                  setComment("");
                }}
              >
                Approve
              </Button>

              {/* SEND BACK */}

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
                onClick={() => {
                  setAction("sendBack");
                  setComment("");
                }}
              >
                Send Back
              </Button>

              {/* REJECT */}

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
                onClick={() => {
                  setAction("reject");
                  setComment("");
                }}
              >
                Reject
              </Button>

            </div>

            {/* DECISION COMMENT */}

            {action && (
              <div className="mt-5">

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  required
                  label={actionLabel}
                  placeholder={actionPlaceholder}
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                  error={
                    comment.length > 0 &&
                    !comment.trim()
                  }
                  helperText={
                    action === "approve"
                      ? "Add remarks for the approval record."
                      : action === "sendBack"
                      ? "Mention exactly what the requester needs to correct."
                      : "Provide a clear reason for rejection."
                  }
                />

              </div>
            )}
          </>
        ) : (
          /* =================================================
             EXISTING DECISION
          ================================================= */

          <div className="rounded-lg border border-border bg-muted/20 p-4">

            <div className="flex items-center justify-between">

              <div>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                >
                  Approval Decision
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  This requisition has already been
                  processed.
                </Typography>
              </div>

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
              <div className="mt-4 rounded-md border border-border bg-background p-3">

                <p className="text-xs text-muted-foreground">
                  Decision Comment
                </p>

                <p className="mt-1 text-sm">
                  {requisition.approvalComment}
                </p>

              </div>
            )}

            {requisition.approvedBy && (
              <div className="mt-3 flex justify-between text-sm">

                <span className="text-muted-foreground">
                  Approved By
                </span>

                <span className="font-medium">
                  {requisition.approvedBy}
                </span>

              </div>
            )}

            {requisition.approvedAt && (
              <div className="mt-2 flex justify-between text-sm">

                <span className="text-muted-foreground">
                  Decision Date
                </span>

                <span className="font-medium">
                  {requisition.approvedAt}
                </span>

              </div>
            )}

          </div>
        )}

      </DialogContent>

      {/* =================================================
          FOOTER
      ================================================= */}

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          justifyContent: "space-between",
        }}
      >

        <Typography
          variant="caption"
          color="text.secondary"
        >
          PR → Approval → Purchase Order
        </Typography>

        <div className="flex gap-2">

          <Button onClick={handleClose}>
            Close
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

        </div>

      </DialogActions>

    </Dialog>
  );
}

/*
 * ======================================================
 * INFO CARD
 * ======================================================
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