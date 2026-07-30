"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { PurchaseOrder } from "@/features/inventory/types/purchaseOrder";
import { PurchaseRequisition } from "@/features/inventory/types/purchaseRequisition";

interface Props {
  open: boolean;
  onClose: () => void;

  requisition: PurchaseRequisition | null;

  onSave: (purchaseOrder: PurchaseOrder) => void;
}

export default function CreatePurchaseOrderDialog({
  open,
  onClose,
  requisition,
  onSave,
}: Props) {
  const [expectedDeliveryDate, setExpectedDeliveryDate] =
    useState("");

  const [paymentTerms, setPaymentTerms] =
    useState("30 Days");

  const [deliveryTerms, setDeliveryTerms] =
    useState("Delivery at Hospital Store");

  const [remarks, setRemarks] =
    useState("");

  const [rates, setRates] =
    useState<Record<string, number>>({});

  /*
   * Load PR information whenever dialog opens
   */
  useEffect(() => {
    if (!open || !requisition) return;

    setExpectedDeliveryDate("");
    setPaymentTerms("30 Days");
    setDeliveryTerms("Delivery at Hospital Store");
    setRemarks(requisition.remarks ?? "");

    const initialRates: Record<string, number> = {};

    requisition.requisitionItems.forEach((item) => {
      initialRates[item.id] =
        item.estimatedRate ?? 0;
    });

    setRates(initialRates);
  }, [open, requisition]);

  /*
   * Calculate PO items
   */
  const orderItems = useMemo(() => {
    if (!requisition) return [];

    return requisition.requisitionItems.map(
      (item) => {
        const unitRate = rates[item.id] ?? 0;

        const amount =
          item.quantity * unitRate;

        return {
          id: item.id,
          itemId: item.itemId,
          itemName: item.itemName,
          orderedQuantity: item.quantity,
          unitRate,
          amount,
        };
      }
    );
  }, [requisition, rates]);

  /*
   * Calculate subtotal
   */
  const subtotal = useMemo(() => {
    return orderItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );
  }, [orderItems]);

  /*
   * Currently no tax/discount.
   * We can add these later.
   */
  const taxAmount = 0;
  const discountAmount = 0;

  const grandTotal =
    subtotal +
    taxAmount -
    discountAmount;

  /*
   * Update item rate
   */
  const handleRateChange = (
    itemId: string,
    value: string
  ) => {
    const rate = Number(value);

    setRates((prev) => ({
      ...prev,
      [itemId]: Number.isNaN(rate)
        ? 0
        : rate,
    }));
  };

  /*
   * Create PO
   */
  const handleSubmit = () => {
    if (!requisition) return;

    const purchaseOrder: PurchaseOrder = {
      id: crypto.randomUUID(),

      poNumber: `PO-${Date.now()}`,

      purchaseRequisitionId:
        requisition.id,

      requisitionNumber:
        requisition.requisitionNumber,

      supplierId:
        requisition.supplierId,

      supplierName:
        requisition.supplierName ??
        "Not Assigned",

      departmentId:
        requisition.departmentId,

      departmentName:
        requisition.departmentName,

      orderDate:
        new Date().toLocaleDateString(),

      expectedDeliveryDate:
        expectedDeliveryDate || undefined,

      status: "Draft",

      items:
        orderItems.length,

      totalQuantity:
        orderItems.reduce(
          (sum, item) =>
            sum + item.orderedQuantity,
          0
        ),

      subtotal,

      taxAmount,

      discountAmount,

      grandTotal,

      paymentTerms,

      deliveryTerms,

      remarks:
        remarks.trim() || undefined,

      createdBy:
        "Inventory Manager",

      createdAt:
        new Date().toLocaleDateString(),

      purchaseOrderItems:
        orderItems.map((item) => ({
          id: crypto.randomUUID(),

          itemId: item.itemId,

          itemName: item.itemName,

          orderedQuantity:
            item.orderedQuantity,

          unitRate:
            item.unitRate,

          taxPercent: 0,

          discount: 0,

          amount: item.amount,

          receivedQuantity: 0,
        })),
    };

    onSave(purchaseOrder);

    onClose();
  };

  if (!requisition) {
    return null;
  }

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
          Create Purchase Order
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {/* PR Information */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            fullWidth
            label="Purchase Requisition"
            value={
              requisition.requisitionNumber
            }
            disabled
          />

          <TextField
            fullWidth
            label="Supplier"
            value={
              requisition.supplierName ??
              "Not Assigned"
            }
            disabled
          />

          <TextField
            fullWidth
            label="Department"
            value={
              requisition.departmentName
            }
            disabled
          />

          <TextField
            fullWidth
            label="Priority"
            value={
              requisition.priority
            }
            disabled
          />
        </div>

        <Divider className="my-6" />

        {/* Delivery */}

        <Typography
          variant="subtitle1"
          fontWeight={600}
          className="mb-4"
        >
          Order Details
        </Typography>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            fullWidth
            type="date"
            label="Expected Delivery Date"
            InputLabelProps={{
              shrink: true,
            }}
            value={
              expectedDeliveryDate
            }
            onChange={(e) =>
              setExpectedDeliveryDate(
                e.target.value
              )
            }
          />

          <TextField
            select
            fullWidth
            label="Payment Terms"
            value={paymentTerms}
            onChange={(e) =>
              setPaymentTerms(
                e.target.value
              )
            }
          >
            <MenuItem value="Immediate">
              Immediate
            </MenuItem>

            <MenuItem value="15 Days">
              15 Days
            </MenuItem>

            <MenuItem value="30 Days">
              30 Days
            </MenuItem>

            <MenuItem value="60 Days">
              60 Days
            </MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Delivery Terms"
            value={deliveryTerms}
            onChange={(e) =>
              setDeliveryTerms(
                e.target.value
              )
            }
          />
        </div>

        <Divider className="my-6" />

        {/* Items */}

        <Typography
          variant="subtitle1"
          fontWeight={600}
          className="mb-4"
        >
          Purchase Order Items
        </Typography>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="p-3 text-left">
                  Item
                </th>

                <th className="p-3 text-center">
                  Quantity
                </th>

                <th className="p-3 text-right">
                  Unit Rate
                </th>

                <th className="p-3 text-right">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {orderItems.map(
                (item) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-0"
                  >
                    <td className="p-3 font-medium">
                      {item.itemName}
                    </td>

                    <td className="p-3 text-center">
                      {
                        item.orderedQuantity
                      }
                    </td>

                    <td className="p-3">
                      <TextField
                        size="small"
                        type="number"
                        value={
                          rates[
                            item.id
                          ] ?? 0
                        }
                        onChange={(e) =>
                          handleRateChange(
                            item.id,
                            e.target.value
                          )
                        }
                        inputProps={{
                          min: 0,
                        }}
                      />
                    </td>

                    <td className="p-3 text-right font-medium">
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

        {/* Totals */}

        <div className="mt-5 ml-auto max-w-sm space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Subtotal
            </span>

            <span className="font-medium">
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Tax
            </span>

            <span>
              ₹
              {taxAmount.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Discount
            </span>

            <span>
              ₹
              {discountAmount.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <Divider />

          <div className="flex justify-between text-lg font-semibold">
            <span>
              Grand Total
            </span>

            <span>
              ₹
              {grandTotal.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>
        </div>

        {/* Remarks */}

        <div className="mt-6">
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Remarks"
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
          />
        </div>
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
        >
          Create Purchase Order
        </Button>
      </DialogActions>
    </Dialog>
  );
}