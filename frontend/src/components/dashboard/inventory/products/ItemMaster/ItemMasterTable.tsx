
"use client";

import { Eye } from "lucide-react";

import type { ItemMaster } from "@/features/inventory/types/itemMaster";

interface Props {
  items: ItemMaster[];
  onView: (item: ItemMaster) => void;
}

export default function ItemMasterTable({
  items,
  onView,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-5 py-4 text-sm font-semibold">
                Item
              </th>

              <th className="px-5 py-4 text-sm font-semibold">
                Category
              </th>

              <th className="px-5 py-4 text-sm font-semibold">
                Brand
              </th>

              <th className="px-5 py-4 text-sm font-semibold">
                Unit
              </th>

              <th className="px-5 py-4 text-sm font-semibold">
                Min Stock
              </th>

              <th className="px-5 py-4 text-sm font-semibold">
                Reorder Level
              </th>

              <th className="px-5 py-4 text-sm font-semibold">
                Supplier
              </th>

              <th className="px-5 py-4 text-sm font-semibold">
                Status
              </th>

              <th className="px-5 py-4 text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-10 text-center text-sm text-muted-foreground"
                >
                  No items found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {item.itemName}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.itemCode}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm">
                        {item.category}
                      </p>

                      {item.subcategory && (
                        <p className="text-xs text-muted-foreground">
                          {item.subcategory}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {item.brand || "-"}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {item.unit}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {item.minimumStock}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {item.reorderLevel}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {item.supplierName || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        onView(item)
                      }
                      className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-primary"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
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
