"use client";

import { Suspense, useEffect, useState } from "react";

import { ApiError } from "@/lib/api";
import { ModuleCapabilityGate } from "@/components/common/ModuleCapabilityGate";
import { searchMedicines } from "@/features/pharmacy/api";
import { ExpiryTracker } from "@/features/pharmacy/ExpiryTracker";
import type { MedicineSearchResult } from "@/features/pharmacy/types";

/**
 * Dispense (#195, #212).
 *
 * This screen is stock lookup and expiry oversight. Recording a dispense is
 * POST /pharmacy/dispenses and is deliberately NOT wired here yet: it consumes
 * stock, may need substitution sign-off, and its schema has enough shape
 * (batch selection, partial quantities, dual approval) that guessing at it is
 * how the eMAR and bed-grid rework happened. Built against the contract in a
 * follow-up rather than half-built now.
 */
function BatchList({ medicine }: { medicine: MedicineSearchResult }) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="font-medium">
            {medicine.name}
            {medicine.strength ? ` ${medicine.strength}` : ""}
            {medicine.form ? ` · ${medicine.form}` : ""}
          </p>
          {medicine.generic_name && (
            <p className="text-sm text-muted-foreground">{medicine.generic_name}</p>
          )}
        </div>
        {medicine.is_controlled_drug && (
          <span className="rounded-full bg-danger-muted px-2 py-1 text-xs font-medium text-danger">
            Controlled drug
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        {medicine.total_available_quantity} available across {medicine.batches.length}{" "}
        batch{medicine.batches.length === 1 ? "" : "es"}
      </p>

      {medicine.batches.length > 0 && (
        <ul className="mt-3 space-y-2">
          {medicine.batches.map((batch, index) => (
            <li
              key={batch.batch_id}
              className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                index === 0 ? "border-success bg-success-muted" : "border-border"
              }`}
            >
              <span className="font-mono">{batch.batch_number}</span>
              <span>exp {batch.expiry_date}</span>
              <span className="tabular-nums">{batch.quantity}</span>
              {/* The server returns batches FEFO — earliest expiry first — so
                  the first row IS the one to use. Marked rather than silently
                  relied upon, and never re-sorted client-side: a different
                  order on screen from the server's is how expired stock leaves
                  the counter. */}
              {index === 0 && (
                <span className="rounded-full bg-success-muted px-2 py-0.5 text-xs font-medium text-success">
                  FEFO — use this batch
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Dispense() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<MedicineSearchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const trimmed = term.trim();
    if (trimmed.length < 2) {
      setResults(null);
      return;
    }

    // Debounced: a request per keystroke against a stock query would hammer the
    // pharmacy database from every counter at once.
    let cancelled = false;
    const timer = setTimeout(() => {
      setBusy(true);
      searchMedicines(trimmed)
        .then((response) => {
          if (!cancelled) {
            setResults(response.items);
            setError(null);
          }
        })
        .catch((reason: unknown) => {
          if (!cancelled) {
            setError(reason instanceof ApiError ? reason.message : "Medicine search failed");
          }
        })
        .finally(() => {
          if (!cancelled) setBusy(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [term]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dispense</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stock lookup with FEFO batch order, and batches nearing expiry.
        </p>
      </div>

      <section className="space-y-4">
        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Search medicines</span>
          <input
            className="w-full rounded-md border border-border px-3 py-2"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Name or generic — at least two characters"
            autoComplete="off"
          />
        </label>

        {busy && <p className="text-sm text-muted-foreground">Searching…</p>}

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}

        {results && results.length === 0 && (
          <p className="text-sm text-muted-foreground">No medicines match that search.</p>
        )}

        {results && results.length > 0 && (
          <div className="space-y-3">
            {results.map((medicine) => (
              <BatchList key={medicine.item_id} medicine={medicine} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Expiry tracker</h2>
        <ExpiryTracker />
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <ModuleCapabilityGate module="pharmacy">
      <Suspense fallback={null}>
        <Dispense />
      </Suspense>
    </ModuleCapabilityGate>
  );
}
