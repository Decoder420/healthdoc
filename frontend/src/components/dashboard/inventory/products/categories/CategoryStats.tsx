"use client";

import {
  Layers3,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";

import type { Category } from "@/features/inventory/types/category";

interface Props {
  categories: Category[];
}

export default function CategoryStats({
  categories,
}: Props) {
  const total = categories.length;

  const active = categories.filter(
    (category) => category.isActive
  ).length;

  const inactive = categories.filter(
    (category) => !category.isActive
  ).length;

  const totalItems = categories.reduce(
    (total, category) =>
      total + category.itemCount,
    0
  );

  const stats = [
    {
      title: "Total Categories",
      value: total,
      icon: Layers3,
    },
    {
      title: "Active",
      value: active,
      icon: CheckCircle2,
    },
    {
      title: "Inactive",
      value: inactive,
      icon: XCircle,
    },
    {
      title: "Total Items",
      value: totalItems,
      icon: Package,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="surface-card p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {stat.value}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-3">
                <Icon
                  size={20}
                  className="text-primary"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}