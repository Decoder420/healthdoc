"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconBg = "bg-primary/10",
  iconColor = "text-primary",
}: StatCardProps) {
  return (
    <div className="surface-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon
            size={24}
            className={iconColor}
          />
        </div>
      </div>
    </div>
  );
}