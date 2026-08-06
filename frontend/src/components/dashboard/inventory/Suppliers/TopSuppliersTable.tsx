"use client";

import { Eye } from "lucide-react";

import type { Supplier } from "@/features/inventory/types/supplier";

interface Props {
  suppliers: Supplier[];

  onView?: (
    supplier: Supplier
  ) => void;
}

export default function TopSuppliersTable({
  suppliers,
  onView,
}: Props) {

  /*
   * Until purchase-order statistics are stored
   * against suppliers, display the active suppliers
   * first.
   */
  const topSuppliers = [...suppliers]
    .sort((a, b) => {
      if (
        a.is_active === b.is_active
      ) {
        return a.name.localeCompare(
          b.name
        );
      }

      return a.is_active ? -1 : 1;
    })
    .slice(0, 5);

  return (
    <div className="surface-card overflow-hidden">

      {/* HEADER */}

      <div className="border-b border-border p-5">

        <h3 className="text-lg font-semibold text-foreground">
          Top Suppliers
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Currently active suppliers
        </p>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[650px]">

          <thead className="border-b border-border bg-muted/30">

            <tr>

              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                Supplier
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                Contact
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {topSuppliers.length === 0 ? (

              <tr>

                <td
                  colSpan={4}
                  className="px-5 py-12 text-center"
                >

                  <p className="text-sm font-medium">
                    No suppliers available
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Supplier data will appear here.
                  </p>

                </td>

              </tr>

            ) : (

              topSuppliers.map(
                (supplier) => (

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

                      <span className="text-sm">
                        {supplier.contact_info ||
                          "—"}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4 text-center">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          supplier.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {supplier.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end">

                        {onView && (
                          <button
                            type="button"
                            onClick={() =>
                              onView(
                                supplier
                              )
                            }
                            className="btn btn-ghost btn-icon"
                            title="View Supplier"
                          >
                            <Eye size={16} />
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}