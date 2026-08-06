"use client";

import { useEffect, useState } from "react";

import SupplierStats from "@/components/dashboard/inventory/Suppliers/SupplierStats";
import AddSupplierDialog from "@/components/dashboard/inventory/Suppliers/AddSupplierDrawer";
import RecentSuppliersTable from "@/components/dashboard/inventory/Suppliers/RecentSuppliersTable";

import {
  getStoredSuppliers,
  saveSuppliers,
} from "@/features/inventory/data/supplierData";

import type { Supplier } from "@/features/inventory/types/supplier";

export default function SupplierScreen() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const [addSupplierOpen, setAddSupplierOpen] =
    useState(false);

  const [editingSupplier, setEditingSupplier] =
    useState<Supplier | null>(null);

  /*
   * ============================================================
   * LOAD SUPPLIERS
   * ============================================================
   */

  useEffect(() => {
    const storedSuppliers =
      getStoredSuppliers();

    setSuppliers(storedSuppliers);
    setLoading(false);
  }, []);

  /*
   * ============================================================
   * OPEN ADD
   * ============================================================
   */

  const handleAddClick = () => {
    setEditingSupplier(null);
    setAddSupplierOpen(true);
  };

  /*
   * ============================================================
   * SAVE / UPDATE SUPPLIER
   * ============================================================
   */

  const handleSaveSupplier = (
    supplier: Supplier
  ) => {
    setSuppliers((currentSuppliers) => {
      const exists = currentSuppliers.some(
        (item) => item.id === supplier.id
      );

      const updatedSuppliers = exists
        ? currentSuppliers.map((item) =>
            item.id === supplier.id
              ? supplier
              : item
          )
        : [
            supplier,
            ...currentSuppliers,
          ];

      saveSuppliers(updatedSuppliers);

      return updatedSuppliers;
    });

    setAddSupplierOpen(false);
    setEditingSupplier(null);
  };

  /*
   * ============================================================
   * EDIT SUPPLIER
   * ============================================================
   */

  const handleEditSupplier = (
    supplier: Supplier
  ) => {
    setEditingSupplier(supplier);
    setAddSupplierOpen(true);
  };

  /*
   * ============================================================
   * VIEW SUPPLIER
   * ============================================================
   */

  const handleViewSupplier = (
    supplier: Supplier
  ) => {
    alert(
      `Supplier: ${supplier.name}\n\nID: ${supplier.id}\nContact: ${
        supplier.contact_info || "Not provided"
      }\nStatus: ${
        supplier.is_active
          ? "Active"
          : "Inactive"
      }`
    );
  };

  /*
   * ============================================================
   * CLOSE DIALOG
   * ============================================================
   */

  const handleCloseDialog = () => {
    setAddSupplierOpen(false);
    setEditingSupplier(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-primary">
            Inventory Management
          </p>

          <h1 className="text-2xl font-bold text-foreground">
            Suppliers
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage approved suppliers used in the
            hospital procurement workflow.
          </p>
        </div>

        <div className="surface-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Loading suppliers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-medium text-primary">
            Inventory Management
          </p>

          <h1 className="text-2xl font-bold text-foreground">
            Suppliers
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage suppliers used for purchase
            requisitions, purchase orders and goods
            receiving.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddClick}
          className="btn btn-primary"
        >
          Add Supplier
        </button>

      </div>

      {/* =====================================================
          STATS
          ===================================================== */}

      <SupplierStats
        suppliers={suppliers}
      />

      {/* =====================================================
          PROCUREMENT FLOW
          ===================================================== */}

      <div className="surface-card p-5">

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Supplier Procurement Flow
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Suppliers are selected during procurement and
            linked to the purchase order before goods are
            received.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

          <FlowStep
            number="01"
            title="Supplier"
            description="Maintain supplier master"
            active
          />

          <FlowStep
            number="02"
            title="Purchase Requisition"
            description="Select supplier for procurement"
          />

          <FlowStep
            number="03"
            title="Purchase Order"
            description="Generate order for supplier"
          />

          <FlowStep
            number="04"
            title="GRN"
            description="Receive goods against PO"
          />

        </div>

      </div>

      {/* =====================================================
          SUPPLIER TABLE
          ===================================================== */}

      <RecentSuppliersTable
        suppliers={suppliers}
        onView={handleViewSupplier}
        onEdit={handleEditSupplier}
      />

      {/* =====================================================
          ADD / EDIT SUPPLIER
          ===================================================== */}

      <AddSupplierDialog
        open={addSupplierOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveSupplier}
        supplier={editingSupplier}
      />

    </div>
  );
}

/*
 * ============================================================
 * FLOW STEP
 * ============================================================
 */

function FlowStep({
  number,
  title,
  description,
  active = false,
}: {
  number: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        active
          ? "border-primary/30 bg-primary/5"
          : "border-border"
      }`}
    >
      <div className="flex items-center gap-3">

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
            active
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {number}
        </div>

        <div>
          <p className="text-sm font-semibold">
            {title}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

      </div>
    </div>
  );
}