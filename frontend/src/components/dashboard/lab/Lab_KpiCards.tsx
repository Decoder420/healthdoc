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
      style={{  minHeight: "95px", borderRadius: "16px" }}
    >
      <div className="card-body h-100">
        <div className="row h-100 align-items-center">
          {/* Icon */}
          <div className="col-auto d-flex align-items-center justify-content-center ml-3">
            <div className="theme-icon fs-1">
              {icon}
            </div>
          </div>

          {/* Content */}
          <div className="col d-flex flex-column justify-content-center ml-3">
            <small className="small-text mb-1">
              {title}
            </small>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h3 className="fw-bold mb-0">
                {text}
              </h3>

              {linkText && linkHref && (
                <Link
                  href={linkHref}
                  className="link-primary small-text"
                >
                  {linkText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}