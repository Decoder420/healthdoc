"use client";

import {
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { PurchaseRequisition } from "@/features/inventory/types/purchaseRequisition";

interface Props {
  requisitions: PurchaseRequisition[];
}

export default function PurchaseRequisitionStats({
  requisitions,
}: Props) {
  const total = requisitions.length;

  const pendingApproval = requisitions.filter(
    (item) => item.status === "Pending Approval"
  ).length;

  const approved = requisitions.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejected = requisitions.filter(
    (item) => item.status === "Rejected"
  ).length;

  const stats = [
    {
      label: "Total Requisitions",
      value: total,
      icon: FileText,
    },
    {
      label: "Pending Approval",
      value: pendingApproval,
      icon: Clock3,
    },
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle2,
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="surface-card flex items-center justify-between p-5"
          >
            <div>
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>

              <p className="mt-2 text-2xl font-bold text-foreground">
                {stat.value}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
}