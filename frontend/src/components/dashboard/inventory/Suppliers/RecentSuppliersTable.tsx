"use client";

import {
  Eye,
  Pencil,
} from "lucide-react";

import type { Supplier } from "@/features/inventory/types/supplier";

interface Props {
  suppliers: Supplier[];
  onEdit?: (supplier: Supplier) => void;
  onView?: (supplier: Supplier) => void;
}

export default function RecentSuppliersTable({
  suppliers,
  onEdit,
  onView,
}: Props) {
  return (
    <div className="surface-card overflow-hidden">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="border-b border-border p-5">

        <h3 className="font-semibold text-foreground">
          Supplier Master
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Suppliers available for purchase requisitions
          and purchase orders.
        </p>

      </div>

      {/* =====================================================
          TABLE
          ===================================================== */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[760px]">

          <thead className="border-b border-border bg-muted/30">

            <tr>

              <th className="px-5 py-3 text-left text-xs font-semibold">
                Supplier
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold">
                Contact Information
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold">
                Status
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold">
                Procurement
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {suppliers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center"
                >
                  <p className="text-sm font-medium text-foreground">
                    No suppliers found
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Add a supplier to start procurement.
                  </p>
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20"
                >

                  {/* SUPPLIER */}

                  <td className="px-5 py-4">

                    <p className="text-sm font-medium text-foreground">
                      {supplier.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {supplier.id}
                    </p>

                  </td>

                  {/* CONTACT */}

                  <td className="px-5 py-4">

                    <p className="text-sm text-foreground">
                      {supplier.contact_info ||
                        "No contact information"}
                    </p>

                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4 text-center">

                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        supplier.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {supplier.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                  {/* PROCUREMENT */}

                  <td className="px-5 py-4 text-center">

                    {supplier.is_active ? (
                      <span className="text-xs font-medium text-green-700">
                        Available
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground">
                        Not Available
                      </span>
                    )}

                  </td>

                  {/* ACTIONS */}

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      {onView && (
                        <button
                          type="button"
                          onClick={() =>
                            onView(supplier)
                          }
                          className="rounded-md border border-border p-2 text-muted-foreground transition hover:bg-muted"
                          title="View Supplier"
                        >
                          <Eye size={16} />
                        </button>
                      )}

                      {onEdit && (
                        <button
                          type="button"
                          onClick={() =>
                            onEdit(supplier)
                          }
                          className="rounded-md border border-border p-2 text-muted-foreground transition hover:bg-muted"
                          title="Edit Supplier"
                        >
                          <Pencil size={16} />
                        </button>
                      )}

                    </div>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}