"use client";

import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-2 flex items-center gap-2 text-sm font-mono text-muted-foreground"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.label} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <a
                href={item.href}
                className="transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={
                  isLast
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                }
              >
                {item.label}
              </span>
            )}

            {!isLast && <ChevronRight size={16} />}
          </div>
        );
      })}
    </nav>
  );
}