"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

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
  onClick,
}: DynamicCardProps) {
  return (
    <div
      onClick={onClick}
      className="card border-0 shadow-sm h-100 overflow-hidden transition-all"
      style={{
        borderRadius: 20,
        cursor: onClick ? "pointer" : "default",
        transition: "all .3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 18px 35px rgba(0,31,84,.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start">

          {/* Left */}
          <div className="flex-grow-1">

           <div
  className="fw-semibold"
  style={{
    fontSize: 13,
    letterSpacing: ".4px",
    textTransform: "uppercase",
    color: "inherit", // Uses your global/theme text color
  }}
>
  {title}
</div>

            <h2
              className="fw-bold mb-2 mt-2"
              style={{
                fontSize: "1.5rem",
                lineHeight: 1,
              }}
            >
              {text}
            </h2>

            {linkHref && linkText && (
              <Link
                href={linkHref}
                className="text-decoration-none fw-semibold d-inline-flex align-items-center gap-1"
                style={{
                  fontSize: 13,
                }}
              >
                {linkText}
                <ArrowRight size={15} />
              </Link>
            )}
          </div>

          {/* Icon */}
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background:
                "linear-gradient(135deg,#EAF4FF,#D8EAFF)",
              color: "#0B5ED7",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>

        </div>
      </div>
    </div>
  );
}