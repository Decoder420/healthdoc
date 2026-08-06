"use client";

import {
  Users,
  UserCheck,
  UserX,
  Percent,
} from "lucide-react";

import type { Supplier } from "@/features/inventory/types/supplier";

interface Props {
  suppliers: Supplier[];
}

export default function SupplierStats({
  suppliers,
}: Props) {
  const totalSuppliers =
    suppliers.length;

  const activeSuppliers =
    suppliers.filter(
      (supplier) =>
        supplier.is_active
    ).length;

  const inactiveSuppliers =
    suppliers.filter(
      (supplier) =>
        !supplier.is_active
    ).length;

  const activeRate =
    totalSuppliers > 0
      ? Math.round(
          (activeSuppliers /
            totalSuppliers) *
            100
        )
      : 0;

  const stats = [
    {
      label: "Total Suppliers",
      value: totalSuppliers,
      icon: Users,
      description:
        "Registered supplier accounts",
    },
    {
      label: "Active Suppliers",
      value: activeSuppliers,
      icon: UserCheck,
      description:
        "Available for procurement",
    },
    {
      label: "Inactive Suppliers",
      value: inactiveSuppliers,
      icon: UserX,
      description:
        "Currently unavailable",
    },
    {
      label: "Active Rate",
      value: `${activeRate}%`,
      icon: Percent,
      description:
        "Suppliers available for purchasing",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="surface-card p-5"
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-foreground">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-2.5">
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