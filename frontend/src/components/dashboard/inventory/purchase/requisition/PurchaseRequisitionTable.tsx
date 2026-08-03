"use client";

import {
  Eye,
  Pencil,
  ClipboardCheck,
  ShoppingCart,
} from "lucide-react";

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
  return (
    <div>
      {/* HEADER */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Purchase Requisitions
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Department requirements moving through the procurement workflow.
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          {requisitions.length} requisition
          {requisitions.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead className="border-b border-border">
            <tr className="text-left">
              <th className="pb-3 text-sm font-medium">
                Requisition
              </th>

              <th className="pb-3 text-sm font-medium">
                Source Indent
              </th>

              <th className="pb-3 text-sm font-medium">
                Department
              </th>

              <th className="pb-3 text-sm font-medium">
                Supplier
              </th>

              <th className="pb-3 text-center text-sm font-medium">
                Items
              </th>

              <th className="pb-3 text-center text-sm font-medium">
                Priority
              </th>

              <th className="pb-3 text-center text-sm font-medium">
                Status
              </th>

              <th className="pb-3 text-center text-sm font-medium">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {requisitions.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-14 text-center"
                >
                  <div className="flex flex-col items-center">
                    <ClipboardCheck
                      size={32}
                      className="mb-3 text-muted-foreground"
                    />

                    <p className="font-medium text-foreground">
                      No purchase requisitions found
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Approved department indents will appear here.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              requisitions.map((requisition) => {
                const status = requisition.status;

                const pendingApproval =
                  status === "Pending Approval";

                const approved =
                  status === "Approved";

                const sentBack =
                  status === "Sent Back";

                const rejected =
                  status === "Rejected";

                const converted =
                  status === "Converted to PO";

                const cancelled =
                  status === "Cancelled";

                let statusClass =
                  "bg-muted text-foreground";

                if (pendingApproval) {
                  statusClass =
                    "bg-amber-100 text-amber-700";
                }

                if (approved) {
                  statusClass =
                    "bg-green-100 text-green-700";
                }

                if (rejected) {
                  statusClass =
                    "bg-red-100 text-red-700";
                }

                if (sentBack) {
                  statusClass =
                    "bg-orange-100 text-orange-700";
                }

                if (converted) {
                  statusClass =
                    "bg-blue-100 text-blue-700";
                }

                if (cancelled) {
                  statusClass =
                    "bg-gray-100 text-gray-600";
                }

                let priorityClass =
                  "bg-muted text-foreground";

                if (
                  requisition.priority === "Emergency"
                ) {
                  priorityClass =
                    "bg-red-100 text-red-700";
                }

                if (
                  requisition.priority === "Urgent"
                ) {
                  priorityClass =
                    "bg-amber-100 text-amber-700";
                }

                return (
                  <tr
                    key={requisition.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    {/* REQUISITION */}

                    <td className="py-4">
                      <p className="font-semibold text-foreground">
                        {requisition.requisitionNumber}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Created {requisition.createdAt}
                      </p>
                    </td>

                    {/* INDENT */}

                    <td className="py-4">
                      <p className="text-sm font-medium">
                        {requisition.indentNumber}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Department requirement
                      </p>
                    </td>

                    {/* DEPARTMENT */}

                    <td className="py-4">
                      <p className="font-medium">
                        {requisition.departmentName}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {requisition.requestedBy}
                      </p>
                    </td>

                    {/* SUPPLIER */}

                    <td className="py-4">
                      {requisition.supplierName ? (
                        <p className="text-sm font-medium">
                          {requisition.supplierName}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Not assigned
                        </p>
                      )}
                    </td>

                    {/* ITEMS */}

                    <td className="py-4 text-center">
                      <span className="font-medium">
                        {requisition.items}
                      </span>
                    </td>

                    {/* PRIORITY */}

                    <td className="py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${priorityClass}`}
                      >
                        {requisition.priority}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td className="py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}
                      >
                        {status}
                      </span>
                    </td>

                    {/* ACTION */}

                    <td className="py-4">
                      <div className="flex items-center justify-center gap-2">

                        {/* VIEW */}

                        <button
                          type="button"
                          className="btn btn-ghost btn-icon"
                          onClick={() =>
                            onView(requisition)
                          }
                          title="View requisition"
                        >
                          <Eye size={16} />
                        </button>

                        {/* PENDING APPROVAL */}

                        {pendingApproval && (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100"
                            onClick={() =>
                              onApproval(requisition)
                            }
                          >
                            <ClipboardCheck size={14} />
                            Review
                          </button>
                        )}

                        {/* APPROVED */}

                        {approved && (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                            onClick={() =>
                              onCreatePO(requisition)
                            }
                          >
                            <ShoppingCart size={14} />
                            Create PO
                          </button>
                        )}

                        {/* SENT BACK */}

                        {sentBack && (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-md border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700 transition hover:bg-orange-100"
                            onClick={() =>
                              onEdit(requisition)
                            }
                          >
                            <Pencil size={14} />
                            Update
                          </button>
                        )}

                        {/* REJECTED */}

                        {rejected && (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                            onClick={() =>
                              onEdit(requisition)
                            }
                          >
                            <Pencil size={14} />
                            Revise
                          </button>
                        )}

                        {/* CONVERTED */}

                        {converted && (
                          <span className="text-xs font-medium text-blue-600">
                            PO Created
                          </span>
                        )}

                        {/* CANCELLED */}

                        {cancelled && (
                          <span className="text-xs text-muted-foreground">
                            No action
                          </span>
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