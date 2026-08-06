
"use client";

import {
  Package,
  CheckCircle2,
  XCircle,
  Layers3,
} from "lucide-react";

interface Props {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  categories: number;
}

export default function ItemMasterStats({
  totalItems,
  activeItems,
  inactiveItems,
  categories,
}: Props) {
  const stats = [
    {
      title: "Total Items",
      value: totalItems,
      icon: Package,
    },
    {
      title: "Active Items",
      value: activeItems,
      icon: CheckCircle2,
    },
    {
      title: "Inactive Items",
      value: inactiveItems,
      icon: XCircle,
    },
    {
      title: "Categories",
      value: categories,
      icon: Layers3,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <p className="mt-2 text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

