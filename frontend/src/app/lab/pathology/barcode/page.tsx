"use client";

import { useState } from "react";
import Link from "next/link";
import BarcodeDisplay from "@/components/pathology/week1/barcodeDisplay";

export default function BarcodePage() {
  const [value, setValue] = useState("LAB-2026-0018");

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Barcode</h1>
        <p className="mt-1 text-slate-600">
          Preview laboratory barcodes for sample labeling.
        </p>
      </div>

      <label className="flex flex-col gap-2 text-sm text-slate-700">
        Barcode value
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="rounded border border-slate-300 px-3 py-2"
        />
      </label>

      <div className="rounded border border-slate-200 bg-white p-6">
        <BarcodeDisplay value={value} />
      </div>

      <Link
        href="/dashboard/pathology"
        className="text-sm font-medium text-blue-700 underline-offset-2 hover:underline"
      >
        ← Back to Pathology Dashboard
      </Link>
    </main>
  );
}
