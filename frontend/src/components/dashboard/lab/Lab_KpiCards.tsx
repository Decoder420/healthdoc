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

        <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">
          {text}
        </h2>

        {/* Optional Subtitle */}
        {subtitle && (
          <p className="mt-0.5 text-xs text-muted-foreground">
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
            className="link-primary mt-1.5 inline-flex items-center gap-1 text-xs"
          >
            {linkText}
            <ArrowRight size={13} />
          </Link>
        )}
      </div>

      {/* Icon */}
      {icon && (
        <div
          className="
            flex h-7 w-7 shrink-0
            items-center justify-center
            rounded-md
            bg-primary/10
            !text-primary
            transition-all
            duration-200
            group-hover:bg-primary
            group-hover:!text-primary-foreground
          "
        >
          <span className="[&>svg]:h-[18px] [&>svg]:w-[18px]">
            {icon}
          </span>
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
          min-h-[90px]
          w-full
          items-start
          justify-between
          gap-3
          rounded-xl
          border
          border-border
          bg-card
          p-3
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
        min-h-[90px]
        w-full
        items-start
        justify-between
        gap-3
        rounded-xl
        border
        border-border
        bg-card
        p-3
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
