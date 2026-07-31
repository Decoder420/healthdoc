"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";

import DepartmentStats from "@/components/dashboard/inventory/departments/DepartmentStock/DepartmentStats";
import DepartmentActivityChart from "@/components/dashboard/inventory/departments/DepartmentStock/DepartmentActivityChart";
import DepartmentDistributionChart from "@/components/dashboard/inventory/departments/DepartmentStock/DepartmentDistributionChart";
import RecentDepartmentTable from "@/components/dashboard/inventory/departments/DepartmentStock/RecentDepartmentTable";
import TopDepartmentTable from "@/components/dashboard/inventory/departments/DepartmentStock/TopDepartmentTable";
import AddDepartmentDialog from "@/components/dashboard/inventory/departments/DepartmentStock/AddDepartmentDialog";
import DepartmentViewDialog from "@/components/dashboard/inventory/departments/DepartmentStock/DepartmentViewDialog";

import { recentDepartments } from "@/features/inventory/data/departmentStockData";
import { DepartmentStock } from "@/features/inventory/types/type";

export default function DepartmentStockScreen() {
  const { user } = useAuth();

  const [departments, setDepartments] =
  useState<DepartmentStock[]>(recentDepartments);

const [openDialog, setOpenDialog] = useState(false);

const [viewOpen, setViewOpen] = useState(false);

const [selectedDepartment, setSelectedDepartment] =
  useState<DepartmentStock | null>(null);

const [editingDepartment, setEditingDepartment] =
  useState<DepartmentStock | null>(null);


const handleEdit = (department: DepartmentStock) => {
  setEditingDepartment(department);
  setOpenDialog(true);
};

const handleView = (department: DepartmentStock) => {
  setSelectedDepartment(department);
  setViewOpen(true);
};

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {user?.name ?? "Inventory Manager"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage department inventories and stock across the hospital.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingDepartment(null);
            setOpenDialog(true);
          }}
        >
          Add Department
        </button>
      </div>

      {/* Stats */}

      <DepartmentStats />

      {/* Charts */}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="surface-card p-5">
          <DepartmentActivityChart />
        </div>

        <div className="surface-card p-5">
          <DepartmentDistributionChart />
        </div>
      </section>

      {/* Tables */}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="surface-card overflow-hidden p-5">
          <RecentDepartmentTable
            departments={departments}
            onView={handleView}
            onEdit={handleEdit}
          />
        </div>

        <div className="surface-card overflow-hidden p-5">
          <TopDepartmentTable />
        </div>
      </section>

      {/* Add / Edit Dialog */}

      <AddDepartmentDialog
        open={openDialog}
        department={editingDepartment}
        onClose={() => {
          setOpenDialog(false);
          setEditingDepartment(null);
        }}
        onSave={(department) => {
          if (editingDepartment) {
            setDepartments((prev) =>
              prev.map((item) =>
                item.id === department.id ? department : item
              )
            );
          } else {
            setDepartments((prev) => [department, ...prev]);
          }

          setOpenDialog(false);
          setEditingDepartment(null);
        }}
      />

      <DepartmentViewDialog
 open={viewOpen}
 department={selectedDepartment}
 onClose={()=>
    {setViewOpen(false)
 setSelectedDepartment(null);
    }}
/>



     
    </div>
  );
}