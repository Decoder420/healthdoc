"use client";

import { Eye, Pencil } from "lucide-react";

import { PurchaseRequisition } from "@/features/inventory/types/purchaseRequisition";

interface Props {
requisitions: PurchaseRequisition[];
onView: (requisition: PurchaseRequisition) => void;
onApproval: (requisition: PurchaseRequisition) => void;
onEdit: (requisition: PurchaseRequisition) => void;
onCreatePO: (requisition: PurchaseRequisition) => void;
}

export default function PurchaseRequisitionTable({
requisitions,
onView,
onApproval,
onEdit,
onCreatePO,
}: Props) {
return ( <div> <div className="mb-5"> <h3 className="text-lg font-semibold text-foreground">
Purchase Requisitions </h3>

```
    <p className="text-sm text-muted-foreground">
      Purchase requisitions generated from department indent requests.
    </p>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="border-b border-border">
        <tr className="text-left">
          <th className="pb-3">Requisition No</th>
          <th className="pb-3">Indent No</th>
          <th className="pb-3">Department</th>
          <th className="pb-3">Supplier</th>
          <th className="pb-3 text-center">Items</th>
          <th className="pb-3 text-center">Priority</th>
          <th className="pb-3 text-center">Status</th>
          <th className="pb-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {requisitions.length === 0 ? (
          <tr>
            <td
              colSpan={8}
              className="py-10 text-center text-muted-foreground"
            >
              No Purchase Requisitions Found.
            </td>
          </tr>
        ) : (
          requisitions.map((requisition) => {
            const canEdit =
              requisition.status === "Pending Approval" ||
              requisition.status === "Sent Back" ||
              requisition.status === "Rejected";

            const canApprove =
              requisition.approvalStatus === "Pending";

            return (
              <tr
                key={requisition.id}
                className="border-b border-border last:border-0"
              >
                {/* Requisition */}

                <td className="py-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {requisition.requisitionNumber}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {requisition.createdAt}
                    </p>
                  </div>
                </td>

                {/* Indent */}

                <td className="py-4">
                  <span className="text-sm">
                    {requisition.indentNumber}
                  </span>
                </td>

                {/* Department */}

                <td className="py-4">
                  <div>
                    <p className="font-medium">
                      {requisition.departmentName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {requisition.requestedBy}
                    </p>
                  </div>
                </td>

                {/* Supplier */}

                <td className="py-4">
                  {requisition.supplierName ? (
                    <span>
                      {requisition.supplierName}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Not Assigned
                    </span>
                  )}
                </td>

                {/* Items */}

                <td className="py-4 text-center">
                  {requisition.items}
                </td>

                {/* Priority */}

                <td className="py-4 text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      requisition.priority === "Emergency"
                        ? "bg-red-100 text-red-700"
                        : requisition.priority === "Urgent"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {requisition.priority}
                  </span>
                </td>

                {/* Status */}

                <td className="py-4 text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      requisition.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : requisition.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : requisition.status === "Converted to PO"
                        ? "bg-blue-100 text-blue-700"
                        : requisition.status === "Cancelled"
                        ? "bg-gray-100 text-gray-600"
                        : requisition.status === "Sent Back"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {requisition.status}
                  </span>
                </td>

                {/* Actions */}

               <td className="py-4 text-center">
  <div className="flex items-center justify-center gap-2">

    {/* View */}
    <button
      type="button"
      className="btn btn-ghost btn-icon"
      onClick={() => onView(requisition)}
      title="View Requisition"
    >
      <Eye size={16} />
    </button>

    {/* Edit */}
    {(requisition.approvalStatus === "Pending" ||
      requisition.approvalStatus === "Sent Back" ||
      requisition.approvalStatus === "Rejected") && (
      <button
        type="button"
        className="btn btn-ghost btn-icon"
        onClick={() => onEdit(requisition)}
        title="Edit Requisition"
      >
        <Pencil size={16} />
      </button>
    )}

    {/* Review & Approve */}
    {requisition.approvalStatus === "Pending" && (
      <button
        type="button"
        className="rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100"
        onClick={() => onApproval(requisition)}
      >
        Review & Approve
      </button>
    )}

    {/* Create PO */}
    {requisition.status === "Approved" && (
      <button
        type="button"
        className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
        onClick={() => onCreatePO(requisition)}
      >
        Create PO
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
