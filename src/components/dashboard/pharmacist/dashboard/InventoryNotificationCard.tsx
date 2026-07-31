"use client";

import {
  AlertTriangle,
  Package,
  Clock3,
} from "lucide-react";

import { InventoryNotification } from "@/features/pharmacy/types/dashboard";

interface Props {
  notification: InventoryNotification;
}

export default function InventoryNotificationCard({
  notification,
}: Props) {
  const icon =
    notification.type === "low-stock" ? (
      <AlertTriangle className="h-5 w-5 text-red-500" />
    ) : notification.type === "expiry" ? (
      <Clock3 className="h-5 w-5 text-yellow-500" />
    ) : (
      <Package className="h-5 w-5 text-blue-500" />
    );

  return (
    <div className="flex items-start gap-4 rounded-lg border p-4">
      {icon}

      <div className="flex-1">
        <h3 className="font-medium">
          {notification.medicineName}
        </h3>

        <p className="text-sm text-muted-foreground">
          {notification.message}
        </p>
      </div>

      <span className="text-xs text-muted-foreground">
        {notification.createdAt}
      </span>
    </div>
  );
}