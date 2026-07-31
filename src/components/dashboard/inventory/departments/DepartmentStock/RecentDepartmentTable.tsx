"use client";

import { Eye, Pencil } from "lucide-react";
import { DepartmentStock } from "@/features/inventory/types/type";

interface Props {
  departments: DepartmentStock[];
  onView: (department: DepartmentStock) => void;
  onEdit: (department: DepartmentStock) => void;
}

export default function RecentDepartmentTable({
  departments,
  onView,
  onEdit,
}: Props) {
  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Department Stock
          </h3>

          <p className="text-sm text-muted-foreground">
            Inventory available across all hospital departments.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr className="text-left">
              <th className="pb-3">Department</th>
              <th className="pb-3">Type</th>
              
              <th className="pb-3 text-center">Items</th>
              <th className="pb-3 text-center">Low Stock</th>
             
              <th className="pb-3 text-center">Status</th>
              
              <th className="pb-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No Departments Found.
                </td>
              </tr>
            ) : (
              departments.map((department) => (
                <tr
                  key={department.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-4">
                    <div>
                      <p className="font-medium">
                        {department.departmentName}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {department.id}
                      </p>
                    </div>
                  </td>

                  <td className="py-4">
                    {department.departmentType}
                  </td>

                  

                  <td className="py-4 text-center">
                    {department.totalItems.toLocaleString()}
                  </td>

                  <td className="py-4 text-center">
                    <span
                      className={
                        department.lowStockItems > 5
                          ? "font-medium text-red-600"
                          : "font-medium text-amber-600"
                      }
                    >
                      {department.lowStockItems}
                    </span>
                  </td>

                  

                  <td className="py-4 text-center">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        department.active
                          ? "bg-success-muted text-success"
                          : "bg-danger-muted text-danger"
                      }`}
                    >
                      {department.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                 

                  <td className="py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                           onView(department)}  
                        
                        className="btn btn-ghost btn-icon"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => onEdit(department)}
                        className="btn btn-ghost btn-icon"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}