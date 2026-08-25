"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError } from "@/lib/api";

import { expiryTracker } from "./api";
import {
  BUCKET_LABELS,
  bucketFor,
  type ExpiringBatch,
  type ExpiryBucket,
} from "./types";

const ORDER: ExpiryBucket[] = ["expired", "30", "60", "90"];

const TONE: Record<ExpiryBucket, string> = {
  expired: "bg-danger-muted text-danger",
  "30": "bg-warning-muted text-warning",
  "60": "bg-info-muted text-info",
  "90": "bg-muted text-muted-foreground",
};

/**
 * Expiry tracker, bucketed 30/60/90 (#212).
 *
 * One request at threshold_days=90; the server filters and the client groups.
 * Three requests for three buckets would race each other across a midnight
 * boundary and could show a batch in two buckets at once.
 */
export function ExpiryTracker() {
  const [batches, setBatches] = useState<ExpiringBatch[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    expiryTracker(90)
      .then((response) => {
        if (!cancelled) setBatches(response.items);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof ApiError ? reason.message : "Could not load expiry data");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const groups: Record<ExpiryBucket, ExpiringBatch[]> = {
      expired: [],
      "30": [],
      "60": [],
      "90": [],
    };
    for (const batch of batches ?? []) {
      groups[bucketFor(batch.days_to_expiry)].push(batch);
    }
    // Soonest first inside each bucket — the order stock should be used in.
    for (const bucket of ORDER) {
      groups[bucket].sort((a, b) => a.days_to_expiry - b.days_to_expiry);
    }
    return groups;
  }, [batches]);

  if (error) {
    return (
      <p role="alert" className="text-sm text-danger">
        {error}
      </p>
    );
  }

  if (batches === null) {
    return <p className="text-sm text-muted-foreground">Loading expiry data…</p>;
  }

  return (
    <div className="space-y-4">
      {ORDER.map((bucket) => {
        const rows = grouped[bucket];
        if (rows.length === 0) return null;

        return (
          <section key={bucket} className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="text-base font-semibold">{BUCKET_LABELS[bucket]}</h3>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${TONE[bucket]}`}>
                {rows.length} batch{rows.length === 1 ? "" : "es"}
              </span>
            </div>

            <table className="min-w-full border-collapse">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Medicine</th>
                  <th className="px-4 py-3 text-left">Batch</th>
                  <th className="px-4 py-3 text-left">Expires</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                  <th className="px-4 py-3 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((batch) => (
                  <tr key={batch.batch_id} className="border-b border-border last:border-none">
                    <td className="px-4 py-3 font-medium">{batch.item_name}</td>
                    <td className="px-4 py-3 font-mono text-sm">{batch.batch_number}</td>
                    <td className="px-4 py-3 text-sm">
                      {batch.expiry_date}
                      <span className="ml-2 text-muted-foreground">
                        {batch.days_to_expiry < 0
                          ? `${Math.abs(batch.days_to_expiry)}d ago`
                          : `in ${batch.days_to_expiry}d`}
                      </span>
                    </td>
                    {/* Quantity stays a string — it is a Decimal on the wire and
                        parseFloat would lose fractional units on liquids. */}
                    <td className="px-4 py-3 text-sm tabular-nums">{batch.quantity}</td>
                    <td className="px-4 py-3 text-sm">{batch.stock_location_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}

      {batches.length === 0 && (
        <div className="surface-card p-6">
          <p className="text-sm text-muted-foreground">
            No batches expiring within 90 days.
          </p>
        </div>
      )}
    </div>
  );
}

export default ExpiryTracker;
