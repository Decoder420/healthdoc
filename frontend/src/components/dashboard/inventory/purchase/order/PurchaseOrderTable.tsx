"use client";

import {
  Eye,
  Send,
  XCircle,
  ClipboardPlus,
} from "lucide-react";

import { PurchaseOrder } from "@/features/inventory/types/purchaseOrder";

interface Props {
  purchaseOrders: PurchaseOrder[];

  onView: (
    purchaseOrder: PurchaseOrder
  ) => void;

  onApprove: (
    purchaseOrder: PurchaseOrder
  ) => void;

  onSendToSupplier: (
    purchaseOrder: PurchaseOrder
  ) => void;

  onCreateGRN: (
    purchaseOrder: PurchaseOrder
  ) => void;

  onCancel: (
    purchaseOrder: PurchaseOrder
  ) => void;
}

export default function PurchaseOrderTable({
  purchaseOrders,
  onView,
  onApprove,
  onSendToSupplier,
  onCreateGRN,
  onCancel,
}: Props) {
  const getStatusClass = (
    status: PurchaseOrder["status"]
  ) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700";

      case "Pending Approval":
        return "bg-amber-100 text-amber-700";

      case "Approved":
        return "bg-green-100 text-green-700";

      case "Sent to Supplier":
        return "bg-blue-100 text-blue-700";

      case "Partially Received":
        return "bg-orange-100 text-orange-700";

      case "Fully Received":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Closed":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">
          Purchase Orders
        </h3>

        <p className="text-sm text-muted-foreground">
          Manage purchase orders generated from approved
          purchase requisitions.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead className="border-b border-border">
            <tr className="text-left">
              <th className="pb-3">PO Number</th>
              <th className="pb-3">Requisition</th>
              <th className="pb-3">Supplier</th>
              <th className="pb-3">Department</th>
              <th className="pb-3 text-center">Items</th>
              <th className="pb-3 text-right">Total</th>
              <th className="pb-3 text-center">Status</th>
              <th className="pb-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {purchaseOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-10 text-center text-muted-foreground"
                >
                  No Purchase Orders Found.
                </td>
              </tr>
            ) : (
              purchaseOrders.map((purchaseOrder) => {
                const canCreateGRN =
                  purchaseOrder.status ===
                    "Sent to Supplier" ||
                  purchaseOrder.status ===
                    "Partially Received";

                return (
                  <tr
                    key={purchaseOrder.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-4">
                      <p className="font-medium">
                        {purchaseOrder.poNumber}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {purchaseOrder.orderDate}
                      </p>
                    </td>

                    <td className="py-4 text-sm">
                      {purchaseOrder.requisitionNumber}
                    </td>

                    <td className="py-4">
                      <span className="font-medium">
                        {purchaseOrder.supplierName}
                      </span>
                    </td>

                    <td className="py-4">
                      {purchaseOrder.departmentName}
                    </td>

                    <td className="py-4 text-center">
                      {purchaseOrder.items}
                    </td>

                    <td className="py-4 text-right font-medium">
                      ₹
                      {purchaseOrder.grandTotal.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="py-4 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          purchaseOrder.status
                        )}`}
                      >
                        {purchaseOrder.status}
                      </span>
                    </td>

                    <td className="py-4">
                      <div className="flex items-center justify-center gap-1">

                        {/* VIEW */}

                        <button
                          type="button"
                          className="btn btn-ghost btn-icon"
                          onClick={() =>
                            onView(purchaseOrder)
                          }
                          title="View Purchase Order"
                        >
                          <Eye size={16} />
                        </button>

                        {/* APPROVE */}

                        {purchaseOrder.status ===
                          "Pending Approval" && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-icon"
                            onClick={() =>
                              onApprove(purchaseOrder)
                            }
                            title="Approve Purchase Order"
                          >
                            ✓
                          </button>
                        )}

                        {/* SEND */}

                        {purchaseOrder.status ===
                          "Approved" && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-icon"
                            onClick={() =>
                              onSendToSupplier(
                                purchaseOrder
                              )
                            }
                            title="Send to Supplier"
                          >
                            <Send size={16} />
                          </button>
                        )}

                        {/* CREATE GRN */}

                        {canCreateGRN && (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/10"
                            onClick={() =>
                              onCreateGRN(
                                purchaseOrder
                              )
                            }
                            title="Create GRN"
                          >
                            <ClipboardPlus size={14} />
                            Create GRN
                          </button>
                        )}

                        {/* CANCEL */}

                        {purchaseOrder.status !==
                          "Fully Received" &&
                          purchaseOrder.status !==
                            "Closed" &&
                          purchaseOrder.status !==
                            "Cancelled" &&
                          purchaseOrder.status !==
                            "Partially Received" && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-icon"
                              onClick={() =>
                                onCancel(
                                  purchaseOrder
                                )
                              }
                              title="Cancel Purchase Order"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}