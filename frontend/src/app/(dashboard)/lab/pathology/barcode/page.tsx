"use client";

import { useState } from "react";
import Link from "next/link";
import BarcodeDisplay from "@/components/shared/BarcodeDisplay";

export default function BarcodePage() {
  const [value, setValue] = useState("LAB-2026-0018");

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col gap-6 px-6 py-16 bg-background text-foreground">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Barcode</h1>
        <p className="mt-1 text-muted-foreground">
          Preview laboratory barcodes for sample labeling.
        </p>
      </div>

      <label className="flex flex-col gap-2 text-sm text-muted-foreground">
        Barcode value
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="file-input"
        />
      </label>

      <div className="surface-card p-6">
        <BarcodeDisplay value={value} />
      </div>

      <Link
        href="/dashboard/pathology"
        className="link-primary text-sm underline-offset-2 hover:underline"
      >
        ← Back to Pathology Dashboard
      </Link>
    </main>
  );
}
