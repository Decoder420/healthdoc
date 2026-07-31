"use client";

import { Eye, Pencil } from "lucide-react";

import { PurchaseOrder } from "@/features/inventory/types/purchaseOrder";

interface Props {
  purchaseOrders: PurchaseOrder[];

  onView: (purchaseOrder: PurchaseOrder) => void;

  onEdit: (purchaseOrder: PurchaseOrder) => void;
}

export default function PurchaseOrderTable({
  purchaseOrders,
  onView,
  onEdit,
}: Props) {
  const getStatusClass = (
    status: PurchaseOrder["status"]
  ) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";

      case "Pending Approval":
        return "bg-amber-100 text-amber-700";

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
          Manage purchase orders generated from approved purchase
          requisitions.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr className="text-left">
              <th className="pb-3">
                PO Number
              </th>

              <th className="pb-3">
                Requisition
              </th>

              <th className="pb-3">
                Supplier
              </th>

              <th className="pb-3">
                Department
              </th>

              <th className="pb-3 text-center">
                Items
              </th>

              <th className="pb-3 text-right">
                Total
              </th>

              <th className="pb-3 text-center">
                Status
              </th>

              <th className="pb-3 text-center">
                Actions
              </th>
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
              purchaseOrders.map(
                (purchaseOrder) => (
                  <tr
                    key={purchaseOrder.id}
                    className="border-b border-border last:border-0"
                  >
                    {/* PO */}

                    <td className="py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {
                            purchaseOrder.poNumber
                          }
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {
                            purchaseOrder.orderDate
                          }
                        </p>
                      </div>
                    </td>

                    {/* PR */}

                    <td className="py-4">
                      <span className="text-sm">
                        {
                          purchaseOrder.requisitionNumber
                        }
                      </span>
                    </td>

                    {/* Supplier */}

                    <td className="py-4">
                      <span className="font-medium">
                        {
                          purchaseOrder.supplierName
                        }
                      </span>
                    </td>

                    {/* Department */}

                    <td className="py-4">
                      <span>
                        {
                          purchaseOrder.departmentName
                        }
                      </span>
                    </td>

                    {/* Items */}

                    <td className="py-4 text-center">
                      {
                        purchaseOrder.items
                      }
                    </td>

                    {/* Total */}

                    <td className="py-4 text-right font-medium">
                      ₹
                      {purchaseOrder.grandTotal.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    {/* Status */}

                    <td className="py-4 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          purchaseOrder.status
                        )}`}
                      >
                        {
                          purchaseOrder.status
                        }
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon"
                          onClick={() =>
                            onView(
                              purchaseOrder
                            )
                          }
                          title="View Purchase Order"
                        >
                          <Eye size={16} />
                        </button>

                        {purchaseOrder.status !==
                          "Closed" &&
                          purchaseOrder.status !==
                            "Fully Received" &&
                          purchaseOrder.status !==
                            "Cancelled" && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-icon"
                              onClick={() =>
                                onEdit(
                                  purchaseOrder
                                )
                              }
                              title="Edit Purchase Order"
                            >
                              <Pencil
                                size={16}
                              />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}