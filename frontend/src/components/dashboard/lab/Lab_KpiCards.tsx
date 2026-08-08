"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface DynamicCardProps {
  title: string;
  text: string | number;
  subtitle?: string;
  icon?: ReactNode;
  linkText?: string;
  linkHref?: string;
  onClick?: () => void;
}

export default function DynamicCard({
  title,
  text,
  subtitle,
  icon,
  linkText,
  linkHref,
  onClick,
}: DynamicCardProps) {
  const content = (
    <>
      {/* Left Content */}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-muted-foreground">
          {title}
        </p>

        <h2 className="mt-3 text-xl font-bold tracking-tight text-foreground">
          {text}
        </h2>

        {/* Optional Subtitle */}

        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}

        {/* Optional Link */}

        {linkHref && linkText && (
          <Link
            href={linkHref}
            onClick={(event) => {
              event.stopPropagation();
            }}
            className="link-primary mt-4 inline-flex items-center gap-2 text-sm"
          >
            {linkText}
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* Icon */}

      {icon && (
        <div
          className="
            flex h-11 w-11 shrink-0
            items-center justify-center
            rounded-xl
            bg-primary/10
            !text-primary
            transition-all
            duration-200
            group-hover:bg-primary
            group-hover:!text-primary-foreground
          "
        >
          {icon}
        </div>
      )}
    </>
  );

  /* =========================================
     CLICKABLE CARD
     ========================================= */

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="
          group
          flex
          min-h-[140px]
          w-full
          items-start
          justify-between
          gap-4
          rounded-2xl
          border
          border-border
          bg-card
          p-5
          text-left
          shadow-sm
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:shadow-md
          focus:outline-none
          focus:ring-2
          focus:ring-primary/20
        "
      >
        {content}
      </button>
    );
  }

  /* =========================================
     NORMAL CARD
     ========================================= */

  return (
    <div
      className="
        group
        flex
        min-h-[140px]
        w-full
        items-start
        justify-between
        gap-4
        rounded-2xl
        border
        border-border
        bg-card
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      {content}
    </div>
  );
}
