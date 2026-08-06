"use client";

import {
  Eye,
  Pencil,
  Layers3,
} from "lucide-react";

import type { Category } from "@/features/inventory/types/category";

interface Props {
  categories: Category[];

  onView: (category: Category) => void;

  onEdit: (category: Category) => void;
}

export default function CategoryTable({
  categories,
  onView,
  onEdit,
}: Props) {
  return (
    <section className="surface-card overflow-hidden">

      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-primary/10 p-2">
            <Layers3
              size={18}
              className="text-primary"
            />
          </div>

          <div>
            <h2 className="text-base font-semibold">
              Categories
            </h2>

            <p className="text-sm text-muted-foreground">
              Manage inventory categories
            </p>
          </div>

        </div>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full min-w-[850px]">

          <thead>
            <tr className="border-b border-border bg-muted/30">

              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                Code
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                Category
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                Description
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                Items
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm text-muted-foreground"
                >
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20"
                >

                  <td className="px-5 py-4">
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold">
                      {category.code}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold">
                      {category.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {category.id}
                    </p>
                  </td>

                  <td className="max-w-[350px] px-5 py-4">
                    <p className="truncate text-sm text-muted-foreground">
                      {category.description || "-"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-semibold">
                      {category.itemCount}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        category.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {category.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          onView(category)
                        }
                        className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onEdit(category)
                        }
                        className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Edit"
                      >
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
    </section>
  );
}