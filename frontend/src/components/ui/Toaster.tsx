"use client";

import { useToasts } from "./toast";

const typeClasses = {
  success: "border-success/30 bg-success-muted text-success",
  error: "border-danger/30 bg-danger-muted text-danger",
  info: "border-info/30 bg-info-muted text-info",
  warning: "border-warning/30 bg-warning-muted text-warning",
};

export function Toaster() {
  const toasts = useToasts();

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[9999] flex flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${typeClasses[item.type]}`}
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
