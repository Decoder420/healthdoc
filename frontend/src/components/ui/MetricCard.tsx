"use client";

import type { ReactNode } from "react";
import { Skeleton } from "@mui/material";

type MetricCardProps = {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon?: ReactNode;
  loading?: boolean;
};

export function MetricCard({
  label,
  value,
  delta,
  deltaPositive,
  icon,
  loading,
}: MetricCardProps) {
  return (
    <div className="surface-card flex flex-col h-full gap-3 p-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {icon && (
          <span className="text-muted-foreground [&>svg]:h-5 [&>svg]:w-5">
            {icon}
          </span>
        )}
      </div>
      {loading ? (
        <Skeleton variant="text" width="60%" height={36} />
      ) : (
        <p className="font-sans text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
      )}
      {delta && !loading && (
        <p
          className={`text-xs font-medium ${
            deltaPositive === undefined
              ? "text-muted-foreground"
              : deltaPositive
                ? "text-success"
                : "text-danger"
          }`}
        >
          {delta}
        </p>
      )}
    </div>
  );
}
