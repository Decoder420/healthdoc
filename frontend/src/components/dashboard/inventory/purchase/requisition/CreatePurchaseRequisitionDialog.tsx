"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";

import { PurchaseRequisition } from "@/features/inventory/types/purchaseRequisition";
import type { IndentRequest } from "@/features/inventory/types/indent";

interface Props {
  open: boolean;
  onClose: () => void;

  onSave: (requisition: PurchaseRequisition) => void;

  onIndentLinked?: (
    indentId: string,
    requisitionId: string,
    requisitionNumber: string
  ) => void;

  editRequisition?: PurchaseRequisition | null;

  availableIndents: IndentRequest[];
}

export default function CreatePurchaseRequisitionDialog({
  open,
  onClose,
  onSave,
  onIndentLinked,
  editRequisition,
  availableIndents,
}: Props) {
  const isEditMode = Boolean(editRequisition);

  const [selectedIndentId, setSelectedIndentId] =
    useState("");

  const [supplierName, setSupplierName] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  /*
   * Find selected indent from available indents
   */
  const selectedIndent = useMemo(() => {
    return availableIndents.find(
      (indent) => indent.id === selectedIndentId
    );
  }, [availableIndents, selectedIndentId]);

  /*
   * Load form
   */
  useEffect(() => {
    if (!open) return;

    if (editRequisition) {
      setSelectedIndentId(
        editRequisition.indentId
      );

      setSupplierName(
        editRequisition.supplierName ?? ""
      );

      setRemarks(
        editRequisition.remarks ?? ""
      );
    } else {
      setSelectedIndentId("");
      setSupplierName("");
      setRemarks("");
    }
  }, [open, editRequisition]);

  /*
   * Indent selection
   */
  const handleIndentChange = (
    indentId: string
  ) => {
    setSelectedIndentId(indentId);

    if (!isEditMode) {
      setRemarks("");
    }
  };

  /*
   * Reset
   */
  const resetForm = () => {
    setSelectedIndentId("");
    setSupplierName("");
    setRemarks("");
  };

  /*
   * Save
   */
  const handleSubmit = () => {
    if (!selectedIndent) return;

    /*
     * EDIT
     */
    if (editRequisition) {
      const updatedRequisition: PurchaseRequisition = {
        ...editRequisition,

        indentId: selectedIndent.id,

        indentNumber:
          selectedIndent.requestNumber,

        departmentId:
          selectedIndent.departmentId,

        departmentName:
          selectedIndent.departmentName,

        requestedBy:
          selectedIndent.requestedBy,

        priority:
          selectedIndent.priority,

        supplierName:
          supplierName.trim() || undefined,

        items:
          selectedIndent.indentItems.length,

        totalQuantity:
          selectedIndent.indentItems.reduce(
            (sum, item) =>
              sum + item.quantity,
            0
          ),

        estimatedTotal:
          editRequisition.estimatedTotal ?? 0,

        remarks:
          remarks.trim() ||
          selectedIndent.remarks,

        requisitionItems:
          selectedIndent.indentItems.map(
            (item, index) => {
              const existingItem =
                editRequisition.requisitionItems[
                  index
                ];

              return {
                id:
                  existingItem?.id ??
                  crypto.randomUUID(),

                itemId:
                  item.itemId,

                itemName:
                  item.itemName,

                quantity:
                  item.quantity,

                estimatedRate:
                  existingItem?.estimatedRate,

                estimatedAmount:
                  existingItem?.estimatedAmount,
              };
            }
          ),

        /*
         * Editing requires approval again
         */
        status: "Pending Approval",

        approvalStatus: "Pending",

        approvalComment:
          undefined,

        approvedBy:
          undefined,

        approvedAt:
          undefined,

        rejectionReason:
          undefined,

        sentBackReason:
          undefined,
      };

      onSave(updatedRequisition);

      onIndentLinked?.(
        selectedIndent.id,
        updatedRequisition.id,
        updatedRequisition.requisitionNumber
      );

      resetForm();
      onClose();

      return;
    }

    /*
     * CREATE NEW PR
     */
    const requisition: PurchaseRequisition = {
      id: crypto.randomUUID(),

      requisitionNumber:
        `PR-${Date.now()}`,

      indentId:
        selectedIndent.id,

      indentNumber:
        selectedIndent.requestNumber,

      departmentId:
        selectedIndent.departmentId,

      departmentName:
        selectedIndent.departmentName,

      requestedBy:
        selectedIndent.requestedBy,

      priority:
        selectedIndent.priority,

      status:
        "Pending Approval",

      approvalStatus:
        "Pending",

      supplierName:
        supplierName.trim() ||
        undefined,

      items:
        selectedIndent.indentItems.length,

      totalQuantity:
        selectedIndent.indentItems.reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        ),

      estimatedTotal: 0,

      createdAt:
        new Date().toLocaleDateString(),

      remarks:
        remarks.trim() ||
        selectedIndent.remarks,

      requisitionItems:
        selectedIndent.indentItems.map(
          (item) => ({
            id:
              crypto.randomUUID(),

            itemId:
              item.itemId,

            itemName:
              item.itemName,

            quantity:
              item.quantity,
          })
        ),
    };

    onSave(requisition);

    onIndentLinked?.(
      selectedIndent.id,
      requisition.id,
      requisition.requisitionNumber
    );

    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <Typography
          component="span"
          variant="h6"
          fontWeight={600}
        >
          {isEditMode
            ? "Edit Purchase Requisition"
            : "Create Purchase Requisition"}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>

        {/* SOURCE INDENT */}

        <div className="mt-2">
          <TextField
            select
            fullWidth
            label="Source Indent"
            value={selectedIndentId}
            onChange={(e) =>
              handleIndentChange(
                e.target.value
              )
            }
          >
            {availableIndents.length === 0 ? (
              <MenuItem disabled value="">
                No approved indent requests available
              </MenuItem>
            ) : (
              availableIndents.map(
                (indent) => (
                  <MenuItem
                    key={indent.id}
                    value={indent.id}
                  >
                    {indent.requestNumber} —{" "}
                    {indent.departmentName}
                  </MenuItem>
                )
              )
            )}
          </TextField>
        </div>

        {/* SELECTED INDENT */}

        {selectedIndent && (
          <>
            {/* BASIC INFO */}

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

              <TextField
                fullWidth
                label="Department"
                value={
                  selectedIndent.departmentName
                }
                disabled
              />

              <TextField
                fullWidth
                label="Requested By"
                value={
                  selectedIndent.requestedBy
                }
                disabled
              />

              <TextField
                fullWidth
                label="Priority"
                value={
                  selectedIndent.priority
                }
                disabled
              />

              <TextField
                fullWidth
                label="Total Quantity"
                value={
                  selectedIndent.totalQuantity
                }
                disabled
              />

            </div>

            <Divider className="my-6" />

            {/* ITEMS */}

            <div>

              <Typography
                variant="subtitle1"
                fontWeight={600}
              >
                Items from Indent
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                className="mt-1"
              >
                These items will be added to
                the purchase requisition.
              </Typography>

              <div className="mt-3 overflow-hidden rounded-lg border">

                <table className="w-full text-sm">

                  <thead className="border-b bg-gray-50">

                    <tr>

                      <th className="px-4 py-3 text-left font-medium">
                        Item
                      </th>

                      <th className="px-4 py-3 text-left font-medium">
                        Item ID
                      </th>

                      <th className="px-4 py-3 text-center font-medium">
                        Available Stock
                      </th>

                      <th className="px-4 py-3 text-center font-medium">
                        Requested Qty
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {selectedIndent.indentItems.map(
                      (item) => (

                        <tr
                          key={item.id}
                          className="border-b last:border-0"
                        >

                          <td className="px-4 py-3 font-medium">
                            {item.itemName}
                          </td>

                          <td className="px-4 py-3 text-muted-foreground">
                            {item.itemId}
                          </td>

                          <td className="px-4 py-3 text-center">
                            {item.availableStock}
                          </td>

                          <td className="px-4 py-3 text-center font-medium">
                            {item.quantity}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

            <Divider className="my-6" />

            {/* SUMMARY */}

            <div>

              <Typography
                variant="subtitle1"
                fontWeight={600}
              >
                Indent Summary
              </Typography>

              <div className="mt-3 rounded-lg border p-4">

                <div className="flex justify-between">

                  <span className="text-sm text-muted-foreground">
                    Indent Number
                  </span>

                  <span className="font-medium">
                    {
                      selectedIndent.requestNumber
                    }
                  </span>

                </div>

                <div className="mt-3 flex justify-between">

                  <span className="text-sm text-muted-foreground">
                    Number of Items
                  </span>

                  <span className="font-medium">
                    {
                      selectedIndent.items
                    }
                  </span>

                </div>

                <div className="mt-3 flex justify-between">

                  <span className="text-sm text-muted-foreground">
                    Total Quantity
                  </span>

                  <span className="font-medium">
                    {
                      selectedIndent.totalQuantity
                    }
                  </span>

                </div>

              </div>

            </div>

            <Divider className="my-6" />

            {/* SUPPLIER */}

            <TextField
              fullWidth
              label="Supplier"
              placeholder="Enter supplier name"
              value={supplierName}
              onChange={(e) =>
                setSupplierName(
                  e.target.value
                )
              }
            />

            {/* REMARKS */}

            <div className="mt-4">

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Remarks"
                value={remarks}
                onChange={(e) =>
                  setRemarks(
                    e.target.value
                  )
                }
              />

            </div>

          </>
        )}

        {!selectedIndent && (
          <div className="mt-5 rounded-lg border border-dashed p-8 text-center">

            <Typography color="text.secondary">
              {availableIndents.length > 0
                ? "Select an approved indent to continue."
                : "No approved indent requests available."}
            </Typography>

          </div>
        )}

      </DialogContent>

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
          onClick={handleSubmit}
          disabled={!selectedIndent}
        >
          {isEditMode
            ? "Save Changes"
            : "Create Requisition"}
        </Button>

      </DialogActions>

    </Dialog>
  );
}