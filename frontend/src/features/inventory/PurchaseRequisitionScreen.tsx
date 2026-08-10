"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";

import PurchaseRequisitionStats from "@/components/dashboard/inventory/purchase/requisition/PurchaseRequisitionStats";
import PurchaseRequisitionTable from "@/components/dashboard/inventory/purchase/requisition/PurchaseRequisitionTable";
import PurchaseRequisitionCreateDialog from "@/components/dashboard/inventory/purchase/requisition/CreatePurchaseRequisitionDialog";
import PurchaseRequisitionViewDialog from "@/components/dashboard/inventory/purchase/requisition/PurchaseRequisitionViewDialog";
import PurchaseRequisitionApprovalDialog from "@/components/dashboard/inventory/purchase/requisition/PurchaseRequisitionApprovalDialog";

import {
  getPurchaseRequisitions,
  savePurchaseRequisitions,
} from "./data/purchaseRequisitionData";

import type { PurchaseRequisition } from "./types/purchaseRequisition";
import type { PurchaseOrder } from "./types/purchaseOrder";

import {
  addPurchaseOrder,
} from "./data/purchaseOrderData";

import {
  getApprovedIndentRequests,
    updateIndentRequest,
} from "@/features/inventory/data/indentData";

type Filter =
  | "All"
  | "Pending Approval"
  | "Approved"
  | "Rejected"
  | "Sent Back"
  | "Converted to PO";

export default function PurchaseRequisitionScreen() {
  const { user } = useAuth();

  /*
   * ==========================================
   * STATE
   * ==========================================
   */

  const [requisitions, setRequisitions] =
    useState<PurchaseRequisition[]>([]);

  const [createOpen, setCreateOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [selectedRequisition, setSelectedRequisition] =
    useState<PurchaseRequisition | null>(null);

  const [approvalOpen, setApprovalOpen] =
    useState(false);

  const [approvalRequisition, setApprovalRequisition] =
    useState<PurchaseRequisition | null>(null);

  const [editOpen, setEditOpen] =
    useState(false);

  const [editRequisition, setEditRequisition] =
    useState<PurchaseRequisition | null>(null);

  const [filter, setFilter] =
    useState<Filter>("All");

  /*
   * ==========================================
   * LOAD PRs
   * ==========================================
   */

  const loadRequisitions = () => {
    setRequisitions(
      getPurchaseRequisitions()
    );
  };

  useEffect(() => {
    loadRequisitions();
  }, []);

  /*
   * ==========================================
   * AVAILABLE INDENTS
   *
   * Only:
   *
   * 1. Approved
   * 2. Not already linked to PR
   *
   * During edit, current indent remains
   * available.
   * ==========================================
   */
const availableIndents = (() => {
  const indents = getApprovedIndentRequests().filter(
    (indent) => !indent.purchaseRequisitionId
  );

  if (
    editRequisition &&
    !indents.some(
      (indent) =>
        indent.id === editRequisition.indentId
    )
  ) {
    const currentIndent =
      getApprovedIndentRequests().find(
        (indent) =>
          indent.id === editRequisition.indentId
      );

    if (currentIndent) {
      return [
        currentIndent,
        ...indents,
      ];
    }
  }

  return indents;
})();
 

  /*
   * ==========================================
   * VIEW
   * ==========================================
   */

  const handleView = (
    requisition: PurchaseRequisition
  ) => {
    setSelectedRequisition(
      requisition
    );

    setViewOpen(true);
  };

  /*
   * ==========================================
   * APPROVAL
   * ==========================================
   */

  const handleApproval = (
    requisition: PurchaseRequisition
  ) => {
    setApprovalRequisition(
      requisition
    );

    setApprovalOpen(true);
  };

  /*
   * ==========================================
   * EDIT
   * ==========================================
   */

  const handleEdit = (
    requisition: PurchaseRequisition
  ) => {
    setEditRequisition(
      requisition
    );

    setEditOpen(true);
  };

  /*
   * ==========================================
   * INDENT → PR LINK
   * ==========================================
   */

 const handleIndentLinked = (
  indentId: string,
  requisitionId: string,
  requisitionNumber: string
) => {
  updateIndentRequest(indentId, {
    purchaseRequisitionId: requisitionId,
    purchaseRequisitionNumber: requisitionNumber,
  });

  console.log(
    "Indent linked to Purchase Requisition",
    {
      indentId,
      requisitionId,
      requisitionNumber,
    }
  );
};
  /*
   * ==========================================
   * APPROVE
   * ==========================================
   */

  const handleApprove = (
    requisition: PurchaseRequisition,
    comment: string
  ) => {

    const updated =
      requisitions.map(
        (item) =>
          item.id === requisition.id
            ? {
                ...item,

                status:
                  "Approved" as const,

                approvalStatus:
                  "Approved" as const,

                approvalComment:
                  comment,

                approvedBy:
                  user?.name ??
                  "Inventory Manager",

                approvedAt:
                  new Date()
                    .toLocaleDateString(),
              }
            : item
      );

    setRequisitions(updated);

    savePurchaseRequisitions(
      updated
    );

    setApprovalOpen(false);

    setApprovalRequisition(null);
  };

  /*
   * ==========================================
   * REJECT
   * ==========================================
   */

  const handleReject = (
    requisition: PurchaseRequisition,
    reason: string
  ) => {

    const updated =
      requisitions.map(
        (item) =>
          item.id === requisition.id
            ? {
                ...item,

                status:
                  "Rejected" as const,

                approvalStatus:
                  "Rejected" as const,

                rejectionReason:
                  reason,

                approvalComment:
                  reason,
              }
            : item
      );

    setRequisitions(updated);

    savePurchaseRequisitions(
      updated
    );

    setApprovalOpen(false);

    setApprovalRequisition(null);
  };

  /*
   * ==========================================
   * SEND BACK
   * ==========================================
   */

  const handleSendBack = (
    requisition: PurchaseRequisition,
    reason: string
  ) => {

    const updated =
      requisitions.map(
        (item) =>
          item.id === requisition.id
            ? {
                ...item,

                status:
                  "Sent Back" as const,

                approvalStatus:
                  "Sent Back" as const,

                sentBackReason:
                  reason,

                approvalComment:
                  reason,
              }
            : item
      );

    setRequisitions(updated);

    savePurchaseRequisitions(
      updated
    );

    setApprovalOpen(false);

    setApprovalRequisition(null);
  };

  /*
   * ==========================================
   * SAVE PR
   * ==========================================
   */

  const handleSaveRequisition = (
    requisition: PurchaseRequisition
  ) => {

    const exists =
      requisitions.some(
        (item) =>
          item.id === requisition.id
      );

    const updated = exists
      ? requisitions.map(
          (item) =>
            item.id === requisition.id
              ? requisition
              : item
        )
      : [
          requisition,
          ...requisitions,
        ];

    setRequisitions(updated);

    savePurchaseRequisitions(
      updated
    );

    setCreateOpen(false);

    setEditOpen(false);

    setEditRequisition(null);

    loadRequisitions();
  };

  /*
   * ==========================================
   * CREATE PO
   * ==========================================
   */

  const handleCreatePO = (
    requisition: PurchaseRequisition
  ) => {

    if (
      requisition.status !==
      "Approved"
    ) {
      return;
    }

    const orderItems =
      requisition.requisitionItems.map(
        (item) => {

          const unitRate =
            item.estimatedRate ?? 0;

          const amount =
            item.quantity *
            unitRate;

          return {
            id:
              crypto.randomUUID(),

            itemId:
              item.itemId,

            itemName:
              item.itemName,

            orderedQuantity:
              item.quantity,

            unitRate,

            taxPercent: 0,

            discount: 0,

            amount,

            receivedQuantity: 0,
          };
        }
      );

    const subtotal =
      orderItems.reduce(
        (sum, item) =>
          sum + item.amount,
        0
      );

    const totalQuantity =
      orderItems.reduce(
        (sum, item) =>
          sum +
          item.orderedQuantity,
        0
      );

    const purchaseOrder:
      PurchaseOrder = {

      id:
        crypto.randomUUID(),

      poNumber:
        `PO-${Date.now()}`,

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
        new Date()
          .toLocaleDateString(),

      status:
        "Pending Approval",

      items:
        orderItems.length,

      totalQuantity,

      subtotal,

      taxAmount: 0,

      discountAmount: 0,

      grandTotal:
        subtotal,

      paymentTerms:
        "30 Days",

      deliveryTerms:
        "Delivery at Hospital Store",

      remarks:
        requisition.remarks,

      createdBy:
        user?.name ??
        "Inventory Manager",

      createdAt:
        new Date()
          .toLocaleDateString(),

      approvedBy:
        user?.name ??
        "Inventory Manager",

      approvedAt:
        new Date()
          .toLocaleDateString(),

      purchaseOrderItems:
        orderItems,
    };

    addPurchaseOrder(
      purchaseOrder
    );

    const updated =
      requisitions.map(
        (item) =>
          item.id === requisition.id
            ? {
                ...item,
                status:
                  "Converted to PO" as const,
              }
            : item
      );

    setRequisitions(updated);

    savePurchaseRequisitions(
      updated
    );

    window.location.href =
      "/inventory/purchase/PurchaseOrders";
  };

  /*
   * ==========================================
   * COUNTS
   * ==========================================
   */

  const pendingApproval =
    requisitions.filter(
      (item) =>
        item.status ===
        "Pending Approval"
    );

  const approved =
    requisitions.filter(
      (item) =>
        item.status ===
        "Approved"
    );

  const sentBack =
    requisitions.filter(
      (item) =>
        item.status ===
        "Sent Back"
    );

  /*
   * ==========================================
   * FILTER
   * ==========================================
   */

  const filteredRequisitions =
    filter === "All"
      ? requisitions
      : requisitions.filter(
          (item) =>
            item.status === filter
        );

  /*
   * ==========================================
   * UI
   * ==========================================
   */

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm font-medium text-primary">
            Purchase Management
          </p>

          <h1 className="text-2xl font-bold text-foreground">
            Purchase Requisitions
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage department requirements,
            approvals and purchase order creation.
          </p>

        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            setCreateOpen(true)
          }
        >
          Create Requisition
        </button>

      </div>

      {/* PIPELINE */}

      <section className="surface-card p-5">

        <div className="mb-5">

          <h2 className="text-base font-semibold text-foreground">
            Procurement Pipeline
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Track the progress of department
            requirements through procurement.
          </p>

        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">

          {[
            "Indent Request",
            "Purchase Requisition",
            "Approval",
            "Purchase Order",
            "GRN",
          ].map(
            (stage, index) => (

              <div
                key={stage}
                className="flex flex-1 items-center gap-2"
              >

                <div
                  className={`w-full rounded-lg border p-3 text-center ${
                    stage ===
                    "Purchase Requisition"
                      ? "border-primary/20 bg-primary/5"
                      : "border-border bg-muted/30"
                  }`}
                >

                  <p className="text-xs text-muted-foreground">
                    {index === 0
                      ? "Department Need"
                      : index === 1
                      ? "Current Stage"
                      : index === 4
                      ? "Final"
                      : "Next"}
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${
                      stage ===
                      "Purchase Requisition"
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {stage}
                  </p>

                </div>

                {index < 4 && (
                  <span className="hidden text-muted-foreground md:block">
                    →
                  </span>
                )}

              </div>

            )
          )}

        </div>

      </section>

      {/* NEEDS ATTENTION */}

      {(pendingApproval.length > 0 ||
        approved.length > 0 ||
        sentBack.length > 0) && (

        <section className="surface-card p-5">

          <div className="mb-4">

            <h2 className="text-base font-semibold">
              Needs Attention
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Requisitions waiting for the next
              procurement action.
            </p>

          </div>

          <div className="space-y-3">

            {pendingApproval
              .slice(0, 3)
              .map(
                (requisition) => (

                  <div
                    key={requisition.id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 md:flex-row md:items-center md:justify-between"
                  >

                    <div>

                      <div className="flex items-center gap-3">

                        <span className="font-semibold">
                          {
                            requisition.requisitionNumber
                          }
                        </span>

                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                          Pending Approval
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {
                          requisition.departmentName
                        }
                        {" • "}
                        {
                          requisition.items
                        }{" "}
                        items
                      </p>

                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleApproval(
                          requisition
                        )
                      }
                    >
                      Review Request
                    </button>

                  </div>

                )
              )}

            {approved
              .slice(0, 3)
              .map(
                (requisition) => (

                  <div
                    key={requisition.id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 md:flex-row md:items-center md:justify-between"
                  >

                    <div>

                      <div className="flex items-center gap-3">

                        <span className="font-semibold">
                          {
                            requisition.requisitionNumber
                          }
                        </span>

                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          Ready for PO
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {
                          requisition.departmentName
                        }
                        {" • "}
                        {
                          requisition.items
                        }{" "}
                        items
                      </p>

                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleCreatePO(
                          requisition
                        )
                      }
                    >
                      Create Purchase Order
                    </button>

                  </div>

                )
              )}

            {sentBack
              .slice(0, 3)
              .map(
                (requisition) => (

                  <div
                    key={requisition.id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 md:flex-row md:items-center md:justify-between"
                  >

                    <div>

                      <div className="flex items-center gap-3">

                        <span className="font-semibold">
                          {
                            requisition.requisitionNumber
                          }
                        </span>

                        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                          Sent Back
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Requires correction before approval.
                      </p>

                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleEdit(
                          requisition
                        )
                      }
                    >
                      Update Request
                    </button>

                  </div>

                )
              )}

          </div>

        </section>

      )}

      {/* STATS */}

      <PurchaseRequisitionStats
        requisitions={requisitions}
      />

      {/* FILTERS */}

      <section className="surface-card p-4">

        <div className="flex flex-wrap gap-2">

          {(
            [
              "All",
              "Pending Approval",
              "Approved",
              "Rejected",
              "Sent Back",
              "Converted to PO",
            ] as Filter[]
          ).map(
            (item) => (

              <button
                key={item}
                onClick={() =>
                  setFilter(item)
                }
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  filter === item
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {item}
              </button>

            )
          )}

        </div>

      </section>

      {/* TABLE */}

      <section>

        <div className="surface-card overflow-hidden p-5">

          <PurchaseRequisitionTable
            requisitions={
              filteredRequisitions
            }
            onView={handleView}
            onApproval={
              handleApproval
            }
            onEdit={
              handleEdit
            }
            onCreatePO={
              handleCreatePO
            }
          />

        </div>

      </section>

      {/* ==========================================
          CREATE PR DIALOG
          THIS WAS MISSING
      ========================================== */}

      <PurchaseRequisitionCreateDialog
        open={createOpen}

        onClose={() => {
          setCreateOpen(false);
        }}

        onSave={
          handleSaveRequisition
        }

        onIndentLinked={
          handleIndentLinked
        }

        availableIndents={
          availableIndents
        }
      />

      {/* ==========================================
          EDIT PR DIALOG
      ========================================== */}

      <PurchaseRequisitionCreateDialog
        open={editOpen}

        onClose={() => {
          setEditOpen(false);
          setEditRequisition(null);
        }}

        onSave={
          handleSaveRequisition
        }

        onIndentLinked={
          handleIndentLinked
        }

        editRequisition={
          editRequisition
        }

        availableIndents={
          availableIndents
        }
      />

      {/* VIEW */}

      <PurchaseRequisitionViewDialog
        open={viewOpen}
        requisition={
          selectedRequisition
        }
        onClose={() => {
          setViewOpen(false);
          setSelectedRequisition(null);
        }}
      />

      {/* APPROVAL */}

      <PurchaseRequisitionApprovalDialog
        open={approvalOpen}
        requisition={
          approvalRequisition
        }
        onClose={() => {
          setApprovalOpen(false);
          setApprovalRequisition(null);
        }}
        onApprove={
          handleApprove
        }
        onReject={
          handleReject
        }
        onSendBack={
          handleSendBack
        }
      />

    </div>
  );
}