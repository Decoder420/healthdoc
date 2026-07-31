"use client";

import {
  Eye,
  Pencil,
  Package,
} from "lucide-react";

interface InventoryItem {
  id: number;
  itemName: string;
  category: string;
  brand: string;
  supplier: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string;
}

interface RecentInventoryTableProps {
  inventory: InventoryItem[];
}

export default function RecentInventoryTable({
  inventory,
}: RecentInventoryTableProps) {
  return (
    <div className="surface-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Recent Inventory
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Latest inventory available in Radiology
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                Item
              </th>
              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                Category
              </th>
              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                Quantity
              </th>
              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                Batch
              </th>
              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                Expiry
              </th>
              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-3 text-center font-semibold text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {inventory.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No matching inventory items found.
                </td>
              </tr>
            ) : (
              inventory.map((item) => {
                const status =
                  item.quantity <= 0
                    ? "Out of Stock"
                    : item.quantity <= item.minimumStock
                    ? "Low Stock"
                    : "Available";

                const badgeClass =
                  status === "Available"
                    ? "bg-success-muted text-success"
                    : status === "Low Stock"
                    ? "bg-warning-muted text-warning"
                    : "bg-danger-muted text-danger";

                return (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                          <Package
                            size={18}
                            className="text-primary"
                          />
                        </div>

                        <span className="font-medium text-foreground">
                          {item.itemName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-foreground">
                      {item.category}
                    </td>

                    <td className="px-6 py-4 font-medium text-primary">
                      {item.quantity} {item.unit}
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {item.batchNumber}
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {item.expiryDate}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          className="btn btn-outline btn-icon"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          className="btn btn-outline btn-icon"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}