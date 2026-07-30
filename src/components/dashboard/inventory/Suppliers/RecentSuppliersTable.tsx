"use client";

import { Eye, Pencil } from "lucide-react";

interface Supplier {
  id: string;
  supplierCode: string;
  supplierName: string;
  contactPerson: string;
  phone: string;
  email: string;
  active: boolean;
  joined?: string;
}

interface Props {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
}

export default function RecentSuppliersTable({
  suppliers,onEdit,
}: Props) {
  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Recent Suppliers
          </h3>

          <p className="text-sm text-muted-foreground">
            
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr className="text-left">
              <th className="pb-3">Supplier</th>
              <th className="pb-3">Contact</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Joined</th>
              <th className="pb-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No suppliers found.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {supplier.supplierName}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {supplier.id}
                      </p>
                    </div>
                  </td>

                  <td className="py-4 text-sm">
                    <div>{supplier.contactPerson}</div>
                    <div className="text-xs text-muted-foreground">
                      {supplier.phone}
                    </div>
                  </td>

                  <td className="py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        supplier.active
                          ? "bg-success-muted text-success"
                          : "bg-danger-muted text-danger"
                      }`}
                    >
                      {supplier.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="py-4 text-sm">
                    {supplier.joined ?? "Today"}
                  </td>

                  <td className="py-4">
                    <div className="flex justify-center gap-2">
                      

                      <button
                       onClick={() => onEdit(supplier)}
                      className="btn btn-ghost btn-icon">
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