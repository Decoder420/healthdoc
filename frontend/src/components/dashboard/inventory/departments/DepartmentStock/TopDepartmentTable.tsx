"use client";

import { topDepartments } from "@/features/inventory/data/departmentStockData";

export default function TopDepartmentsTable() {
  return (
    <>
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">
          Top Departments
        </h3>

        <p className="text-sm text-muted-foreground">
          Departments with the highest inventory value.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr className="text-left">
              <th className="pb-3">Department</th>
              <th className="pb-3">Type</th>
              <th className="pb-3 text-center">Items</th>
              <th className="pb-3 text-center">Stock Value</th>
              <th className="pb-3">Manager</th>
              <th className="pb-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {topDepartments.map((department) => (
              <tr
                key={department.id}
                className="border-b border-border last:border-0"
              >
                <td className="py-4">
                  <div>
                    <p className="font-medium text-foreground">
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

                <td className="py-4 text-center font-medium">
                  ₹ {(department.stockValue / 100000).toFixed(2)} L
                </td>

                <td className="py-4">
                  {department.manager}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}