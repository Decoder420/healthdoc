"use client";

import { Eye, ClipboardCheck, SlidersHorizontal } from "lucide-react";

import type { PhysicalVerificationItem } from "@/features/inventory/types/physicalVerification";

interface Props {
  items: PhysicalVerificationItem[];
  onStart: (item: PhysicalVerificationItem) => void;
  onView: (item: PhysicalVerificationItem) => void;
  onCreateAdjustment: (item: PhysicalVerificationItem) => void;
}

export default function PhysicalVerificationTable({
  items,
  onStart,
  onView,
  onCreateAdjustment,
}: Props) {
  return (
    <div className="surface-card overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-[#001F54] text-white">
          <tr>
            <th className="px-4 py-3 text-left">Item</th>
            <th className="px-4 py-3 text-left">Batch</th>
            <th className="px-4 py-3 text-center">System Qty</th>
            <th className="px-4 py-3 text-center">Physical Qty</th>
            <th className="px-4 py-3 text-center">Variance</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Result</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-8 text-center text-gray-500"
              >
                No physical verification records found.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-[#001F54]">
                      {item.item_name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {item.item_id}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-3">
                  {item.batch_id ?? "--"}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.system_quantity}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.physical_quantity ?? "--"}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.variance ?? "--"}
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  {item.result ? (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.result === "Matched"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.result}
                    </span>
                  ) : (
                    "--"
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {item.status === "Pending" && (
                      <button
                        type="button"
                        onClick={() => onStart(item)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#001F54] px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                      >
                        <ClipboardCheck size={15} />
                        Start
                      </button>
                    )}

                    {item.status === "Completed" && (
                      <button
                        type="button"
                        onClick={() => onView(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#001F54] bg-white px-3 py-2 text-xs font-semibold text-[#001F54] hover:bg-gray-50"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    )}

                    {item.status === "Completed" &&
                      item.result === "Variance Found" && (
                        <button
                          type="button"
                          onClick={() => onCreateAdjustment(item)}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          <SlidersHorizontal size={15} />
                          Adjustment
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
  );
}