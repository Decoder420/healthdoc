"use client";

export type ReportTab =
  | "overview"
  | "low-stock"
  | "near-expiry"
  | "valuation"
  | "movement";

interface Props {
  activeTab: ReportTab;
  onChange: (tab: ReportTab) => void;
}

const tabs: {
  id: ReportTab;
  label: string;
}[] = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "low-stock",
    label: "Low Stock",
  },
  {
    id: "near-expiry",
    label: "Near Expiry",
  },
  
  {
    id: "movement",
    label: "Stock Movement",
  },
];

export default function ReportTabs({
  activeTab,
  onChange,
}: Props) {
  return (
    <div className="surface-card overflow-x-auto">
      <div className="flex min-w-max border-b border-border">
        {tabs.map((tab) => {
          const isActive =
            activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                onChange(tab.id)
              }
              className={`relative px-5 py-3 text-sm font-medium transition ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}

              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}