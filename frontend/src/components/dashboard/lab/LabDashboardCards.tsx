"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  Beaker,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FlaskConical,
  Hourglass,
} from "lucide-react";

import { patients } from "@/lib/mock/lab_data";

type Tone = "primary" | "warning" | "info" | "danger" | "success" | "critical";

type KpiCard = {
  title: string;
  value: number;
  hint: string;
  tone: Tone;
  icon: ReactNode;
  href?: string;
};

const TONE_STYLES: Record<
  Tone,
  { icon: string; value: string; bar: string }
> = {
  primary: {
    icon: "bg-primary/10 text-primary",
    value: "text-foreground",
    bar: "bg-primary",
  },
  warning: {
    icon: "bg-warning-muted text-warning",
    value: "text-foreground",
    bar: "bg-warning",
  },
  info: {
    icon: "bg-info-muted text-info",
    value: "text-foreground",
    bar: "bg-info",
  },
  danger: {
    icon: "bg-danger-muted text-danger",
    value: "text-danger",
    bar: "bg-danger",
  },
  success: {
    icon: "bg-success-muted text-success",
    value: "text-success",
    bar: "bg-success",
  },
  critical: {
    icon: "bg-danger-muted text-danger",
    value: "text-danger",
    bar: "bg-danger",
  },
};

function countByStatus(...statuses: string[]) {
  const set = new Set(statuses);
  return patients.filter((patient) => set.has(patient.status)).length;
}

function countEmergency() {
  return patients.filter(
    (patient) => patient.order.priority.toLowerCase() === "emergency",
  ).length;
}

export default function DashboardCards() {
  const cards: KpiCard[] = [
    {
      title: "Pending queue",
      value: countByStatus("QUEUE"),
      hint: "Awaiting collection",
      tone: "warning",
      icon: <Hourglass size={20} />,
    },
    {
      title: "Samples collected",
      value: countByStatus("COLLECTED"),
      hint: "Ready for intake",
      tone: "info",
      icon: <Beaker size={20} />,
    },
    {
      title: "In process",
      value: countByStatus("PROCESSING", "RECEIVED"),
      hint: "Currently running",
      tone: "primary",
      icon: <FlaskConical size={20} />,
    },
    {
      title: "Rejected",
      value: countByStatus("RECOLLECTION_REQUIRED", "REJECTED", "REMOVED"),
      hint: "Needs recollection",
      tone: "danger",
      icon: <ClipboardList size={20} />,
    },
    {
      title: "Reports released",
      value: countByStatus("VERIFIED", "READY"),
      hint: "Verified & ready",
      tone: "success",
      icon: <FileCheck2 size={20} />,
    },
    {
      title: "Critical alerts",
      value: countEmergency(),
      hint: "Emergency priority",
      tone: "critical",
      icon: <AlertTriangle size={20} />,
      href: "/lab/test_queue",
    },
  ];

  const totalOrders = patients.length;

  return (
    <section className="space-y-4 px-4 pb-2 pt-1" aria-label="Lab KPI summary">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Operations
          </p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">
            Today&apos;s pathology snapshot
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground sm:self-auto">
          <CheckCircle2 size={14} className="text-primary" />
          <span>{totalOrders} total orders tracked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {cards.map((card) => {
          const tone = TONE_STYLES[card.tone];
          const content = (
            <>
              <div className={`absolute inset-x-0 top-0 h-1 ${tone.bar}`} />
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}
                >
                  {card.icon}
                </span>
                {card.href ? (
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                    Open →
                  </span>
                ) : null}
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p
                  className={`mt-1 text-3xl font-bold tracking-tight ${tone.value}`}
                >
                  {card.value.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
              </div>
            </>
          );

          if (card.href) {
            return (
              <Link
                key={card.title}
                href={card.href}
                className="surface-card relative block overflow-hidden p-5 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {content}
              </Link>
            );
          }

          return (
            <article
              key={card.title}
              className="surface-card relative overflow-hidden p-5 transition-shadow duration-200 hover:shadow-md"
            >
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}
