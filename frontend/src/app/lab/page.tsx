"use client";

import { useEffect, useState } from "react";

import { ModuleCapabilityGate } from "@/components/common/ModuleCapabilityGate";
import { api, formatDateTime } from "@/lib/api";

interface LabOrderItem {
  id: string;
  accession_number: string;
  test_name: string;
  sample_type: string;
  barcode?: string | null;
  status: string;
  created_at: string;
}

interface LabOrderItemList {
  items: LabOrderItem[];
  total: number;
}

function LabPage() {
  const [rows, setRows] = useState<LabOrderItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<LabOrderItemList>("/pathology/order-items?page=1&page_size=100")
      .then((response) => {
        if (cancelled) return;
        setRows(response.items);
        setTotal(response.total);
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Failed to load lab worklist");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ModuleCapabilityGate module="lab">
      <main style={{ padding: "2rem" }}>
        <h1>Lab worklist</h1>
        <p>{loading ? "Loading live orders…" : `${total} live order${total === 1 ? "" : "s"}`}</p>
        {error ? <p role="alert">{error}</p> : null}
        {!loading && !error && rows.length === 0 ? <p>No lab orders are waiting.</p> : null}
        {rows.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {['Accession', 'Test', 'Sample', 'Barcode', 'Status', 'Ordered'].map((label) => (
                    <th key={label} scope="col" style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid #d7dde5" }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #eef1f4" }}>{row.accession_number}</td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #eef1f4" }}>{row.test_name}</td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #eef1f4" }}>{row.sample_type}</td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #eef1f4" }}>{row.barcode ?? "Not collected"}</td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #eef1f4" }}>{row.status.replaceAll("_", " ")}</td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #eef1f4" }}>{formatDateTime(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </main>
    </ModuleCapabilityGate>
  );
}

export default LabPage;
