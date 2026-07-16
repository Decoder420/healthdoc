import type { DashboardStat } from "@/features/dashboard/types";
import { cn } from "@/lib/utils/cn";

const trendStyles = {
  up: "text-success",
  down: "text-danger",
  neutral: "text-muted-foreground",
};

export function StatCard({ label, value, change, trend = "neutral" }: DashboardStat) {
  return (
    <div className="surface-card p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {change && (
        <p className={cn("mt-2 text-xs font-medium", trendStyles[trend])}>{change}</p>
      )}
    </div>
  );
}
