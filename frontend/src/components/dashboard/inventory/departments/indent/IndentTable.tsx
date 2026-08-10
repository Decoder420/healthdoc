"use client";

import { Eye, Check } from "lucide-react";

import type { IndentRequest } from "@/features/inventory/types/indent";

interface Props {
  indents: IndentRequest[];
  onView: (indent: IndentRequest) => void;
  onApprove?: (indent: IndentRequest) => void;
}

export default function IndentTable({
  indents,
  onView,
  onApprove,
}: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-4 py-3 text-sm font-semibold">
              Department
            </th>

            <th className="px-4 py-3 text-sm font-semibold">
              Items
            </th>

            <th className="px-4 py-3 text-sm font-semibold">
              Priority
            </th>

            <th className="px-4 py-3 text-sm font-semibold">
              Status
            </th>

            <th className="px-4 py-3 text-sm font-semibold text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {indents.map((indent) => (
            <tr
              key={indent.id}
              className="border-b border-border last:border-0"
            >
              {/* Department */}
              <td className="px-4 py-4">
                <div className="font-medium">
                  {indent.departmentName}
                </div>

                <div className="text-xs text-muted-foreground">
                  {indent.requestNumber}
                </div>
              </td>

              {/* Items */}
              <td className="px-4 py-4">
                {indent.items}
              </td>

              {/* Priority */}
              <td className="px-4 py-4">
                <span className="text-sm">
                  {indent.priority}
                </span>
              </td>

              {/* Status */}
              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    indent.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : indent.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {indent.status}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-4">
                <div className="flex items-center justify-end gap-2">
                  {/* View */}
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    onClick={() => onView(indent)}
                    title="View indent"
                  >
                    <Eye size={18} />
                  </button>

                  {/* Approve */}
                  {indent.status !== "Approved" &&
                    onApprove && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white"
                        style={{
                          backgroundColor: "#001f54",
                        }}
                        onClick={() => onApprove(indent)}
                      >
                        <Check size={16} />
                        Approve
                      </button>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {indents.length === 0 && (
        <div className="py-10 text-center text-sm text-muted-foreground">
          No indent requests found.
        </div>
      )}
    </div>
  );
}