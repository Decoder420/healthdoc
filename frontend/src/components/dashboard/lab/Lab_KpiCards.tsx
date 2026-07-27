"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface DynamicCardProps {
  title: string;
  text: string | number;
  icon?: ReactNode;
  linkText?: string;
  linkHref?: string;
  onClick?: () => void;
}

export default function DynamicCard({
  title,
  text,
  icon,
  linkText,
  linkHref,
  onClick,
}: DynamicCardProps) {
  return (
    <div
      onClick={onClick}
      className="surface-card h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between p-6">
        {/* Left Content */}
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-3 text-xl font-bold tracking-tight text-foreground">
            {text}
          </h2>

          {linkHref && linkText && (
            <Link
              href={linkHref}
              className="link-primary mt-5 inline-flex items-center gap-2 text-sm"
            >
              {linkText}
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* Icon */}
{icon && (
  <div className="surface-muted ml-6 flex h-14 w-14 items-center justify-center rounded-2xl">
    <div className="text-[#001F54]">
      {icon}
    </div>
  </div>
)}
      </div>
    </div>
  );
}