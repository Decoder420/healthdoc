"use client";

import { Eye } from "lucide-react";
import { topSuppliers } from "@/features/inventory/data/supplierData";

export default function TopSuppliersTable() {
  return (
    <>
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">
          Top Suppliers
        </h3>

        <p className="text-sm text-muted-foreground">
          Suppliers with the highest purchase activity
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr className="text-left">
              <th className="pb-3">Supplier</th>
              <th className="pb-3">Orders</th>
              <th className="pb-3">Last Delivery</th>
              <th className="pb-3">Performance</th>
              <th className="pb-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {topSuppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="border-b border-border last:border-0"
              >
                <td className="py-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {supplier.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {supplier.id}
                    </p>
                  </div>
                </td>

                <td className="py-4">{supplier.orders}</td>

                <td className="py-4">{supplier.lastDelivery}</td>

                <td className="py-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      supplier.status === "Excellent"
                        ? "bg-success-muted text-success"
                        : supplier.status === "Good"
                        ? "bg-info-muted text-info"
                        : "bg-warning-muted text-warning"
                    }`}
                  >
                    {supplier.status}
                  </span>
                </td>

                <td className="py-4">
                  <div className="flex justify-center">
                    <button className="btn btn-ghost btn-icon">
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}