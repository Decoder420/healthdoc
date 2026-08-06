"use client";

import { Eye } from "lucide-react";
import type { WarehouseStock } from "@/features/inventory/types/warehouseStock";

interface Props {
  stocks: WarehouseStock[];
  onView: (stock: WarehouseStock) => void;
}

export default function StockListTable({
  stocks,
  onView,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                Item
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                Category
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                Batch
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                Warehouse
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                Quantity
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                Expiry
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                Status
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {stocks.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-sm text-gray-500"
                >
                  No warehouse stock found.
                </td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr
                  key={stock.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {stock.itemName}
                      </p>

                      {stock.brand && (
                        <p className="text-xs text-gray-500">
                          {stock.brand}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {stock.category}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {stock.batchNumber}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {stock.warehouseName}
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-medium text-gray-900">
                      {stock.availableQuantity}
                    </span>

                    <span className="ml-1 text-xs text-gray-500">
                      {stock.unit}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {stock.expiryDate || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        stock.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : stock.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-700"
                          : stock.status === "Near Expiry"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {stock.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onView(stock)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
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