"use client";

import { cn } from "@/lib/utils/cn";

export type IpdTabId = "requests" | "raise" | "resources" | "nurse";

type TabItem = {
  id: IpdTabId;
  label: string;
  badge?: number;
};

type IpdTabsProps = {
  tabs: TabItem[];
  active: IpdTabId;
  onChange: (tab: IpdTabId) => void;
};

export function IpdTabs({ tabs, active, onChange }: IpdTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-border pb-3">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-accent",
            )}
          >
            {tab.label}
            {typeof tab.badge === "number" && tab.badge > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-primary/10 text-primary",
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
