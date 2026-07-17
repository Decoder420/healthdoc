"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface DynamicCardProps {
  title: string;
  text: string;
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
}: DynamicCardProps) {
  return (
    <div
      className="card dashboard-card shadow-sm border-0 h-100 w-100"
      style={{
        minHeight: "130px",
        borderRadius: "16px",
      }}
    >
      <div className="card-body h-100">
        <div className="row h-100 align-items-center">
          {/* Icon */}
          <div className="col-auto">
            <div className="theme-icon fs-1">
              {icon}
            </div>
          </div>

          {/* Content */}
          <div className="col">
            <small className="small-text d-block mb-1">
              {title}
            </small>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h3 className="fw-bold mb-0">
                {text}
              </h3>

              {linkText && linkHref ? (
  <Link
    href={linkHref}
    className="text-decoration-none small-text"
  >
    {linkText}
  </Link>
) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}