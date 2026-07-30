"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";

import SupplierStats from "@/components/dashboard/inventory/Suppliers/SupplierStats";
import SupplierActivityChart from "@/components/dashboard/inventory/Suppliers/SupplierActivityChart";
import SupplierStatusChart from "@/components/dashboard/inventory/Suppliers/SupplierStatusChart";
import RecentSuppliersTable from "@/components/dashboard/inventory/Suppliers/RecentSuppliersTable";
import TopSuppliersTable from "@/components/dashboard/inventory/Suppliers/TopSuppliersTable";
import AddSupplierDialog from "@/components/dashboard/inventory/Suppliers/AddSupplierDrawer";

import { recentSuppliers } from "@/features/inventory/data/supplierData";

export function SuppliersScreen() {
  const { user } = useAuth();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);

  const [suppliers, setSuppliers] = useState<any[]>(recentSuppliers);

  const handleEdit = (supplier: any) => {
  setEditingSupplier(supplier);
  setOpenDrawer(true);
};

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {user?.name ?? "Inventory Manager"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage suppliers, procurement partners and vendor performance.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setOpenDrawer(true)}
        >
          Add Supplier
        </button>
      </div>

      <SupplierStats />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="surface-card p-5">
          <SupplierActivityChart />
        </div>

        <div className="surface-card p-5">
          <SupplierStatusChart />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="surface-card overflow-hidden p-5">
          <RecentSuppliersTable suppliers={suppliers} 
           onEdit={handleEdit}/>
        </div>

        <div className="surface-card overflow-hidden p-5">
          <TopSuppliersTable />
        </div>
      </section>

      <AddSupplierDialog
  open={openDrawer}
  supplier={editingSupplier}
  onClose={() => {
    setOpenDrawer(false);
    setEditingSupplier(null);
  }}
  onSave={(supplier) => {
    setSuppliers((prev) => {
      if (editingSupplier) {
        // Update existing supplier
        return prev.map((item) =>
          item.id === supplier.id ? supplier : item
        );
      }

      // Add new supplier
      return [supplier, ...prev];
    });

    setOpenDrawer(false);
    setEditingSupplier(null);
  }}
/>
    </div>
  );
}