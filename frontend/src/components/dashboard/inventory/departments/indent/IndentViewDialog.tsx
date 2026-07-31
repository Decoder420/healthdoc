"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { IndentRequest } from "@/features/inventory/types/indent";

interface Props {
  open: boolean;
  indent: IndentRequest | null;
  onClose: () => void;
}

export default function IndentViewDialog({ open, indent, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !indent || !mounted) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(0, 31, 84, 0.45)",
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: "100%",
          maxWidth: "28rem",
          borderRadius: "1rem",
          border: "1px solid #d6dee8",
          backgroundColor: "#ffffff",
          color: "#001f54",
          boxShadow: "0 24px 48px rgba(0, 31, 84, 0.2)",
          overflow: "hidden",
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #d6dee8",
            backgroundColor: "#f4f6f9",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
            Indent Details
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              width: 40,
              height: 40,
              borderRadius: "0.5rem",
              border: "1px solid #d6dee8",
              backgroundColor: "#ffffff",
              color: "#4a6282",
              cursor: "pointer",
            }}
          >
            <X size={18} style={{ margin: "0 auto", display: "block" }} />
          </button>
        </div>

        <div style={{ padding: "1.5rem", display: "grid", gap: "1rem" }}>
          {[
            ["Request Number", indent.requestNumber],
            ["Department", indent.departmentName],
            ["Requested By", indent.requestedBy],
            [
              "Items Required",
              `${indent.items} items (${indent.totalQuantity} qty)`,
            ],
            ["Status", indent.status],
          ].map(([label, value]) => (
            <div key={label}>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.75rem",
                  color: "#4a6282",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  margin: "0.35rem 0 0",
                  fontWeight: 600,
                  color: "#001f54",
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid #d6dee8",
            backgroundColor: "#f4f6f9",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              minHeight: "2.5rem",
              padding: "0.625rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #001f54",
              backgroundColor: "#001f54",
              color: "#ffffff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
