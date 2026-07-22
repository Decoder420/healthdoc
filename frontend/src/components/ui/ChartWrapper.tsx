"use client";

import type { ReactNode } from "react";
import { CircularProgress } from "@mui/material";

type ChartWrapperProps = {
  title: string;
  description?: string;
  height?: number;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function ChartWrapper({
  title,
  description,
  height = 280,
  loading,
  empty,
  emptyMessage = "No data available.",
  actions,
  children,
}: ChartWrapperProps) {
  return (
    <div className="surface-card p-5 h-full">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {actions}
      </div>

      {loading ? (
        <div
          className="flex items-center justify-center"
          style={{ height }}
        >
          <CircularProgress size={28} />
        </div>
      ) : empty ? (
        <div
          className="flex items-center justify-center text-sm text-muted-foreground"
          style={{ height }}
        >
          {emptyMessage}
        </div>
      ) : (
        <div style={{ height, width: "100%", minHeight: height, minWidth: 0 }}>
          {children}
        </div>
      )}
    </div>
  );
}
