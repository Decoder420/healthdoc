"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BarcodeDisplay from "@/components/shared/BarcodeDisplay";
import { getLabBarcodeSamples } from "@/lib/mock/lab_data";

export default function BarcodePage() {
  const samples = useMemo(() => getLabBarcodeSamples(48), []);
  const [value, setValue] = useState(samples[0]?.barcode ?? "LAB-2026-0018");

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col gap-6 px-6 py-16 bg-background text-foreground">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Barcode</h1>
        <p className="mt-1 text-muted-foreground">
          Preview laboratory barcodes for sample labeling ({samples.length}{" "}
          samples loaded).
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

      <div className="surface-card p-4">
        <p className="mb-3 text-sm font-medium text-foreground">
          Recent sample barcodes
        </p>
        <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
          {samples.map((sample) => (
            <button
              key={sample.barcode}
              type="button"
              onClick={() => setValue(sample.barcode)}
              className="rounded-md border border-border px-3 py-2 text-left text-sm hover:bg-muted"
            >
              <span className="font-medium text-foreground">
                {sample.barcode}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {sample.patientName} · {sample.uhid}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Link href="/lab/dashboard" className="link-primary text-sm">
        ← Back to Lab Dashboard
      </Link>
    </main>
  );
}
