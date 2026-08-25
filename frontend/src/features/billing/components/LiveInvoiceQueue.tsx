"use client";

import { useEffect, useState } from "react";

import { api, formatDateTime, formatMoney } from "@/lib/api";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/AsyncState";

interface InvoiceListItem {
  id: string;
  invoice_number: string;
  patient_full_name: string;
  patient_identifier: string;
  status: string;
  gross_amount: string;
  net_amount: string;
  scheme_code?: string | null;
  created_at: string;
}

interface InvoiceListResponse {
  items: InvoiceListItem[];
  total: number;
}

export function LiveInvoiceQueue() {
  const [rows, setRows] = useState<InvoiceListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<InvoiceListResponse>("/billing/invoices?page=1&page_size=100")
      .then((response) => {
        if (cancelled) return;
        setRows(response.items);
        setTotal(response.total);
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Failed to load invoices");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section aria-labelledby="billing-queue-heading" style={{ padding: "2rem" }}>
      <h1 id="billing-queue-heading">Billing work queue</h1>
      <p>{loading ? "Loading live invoices…" : `${total} invoice${total === 1 ? "" : "s"}`}</p>
      <p>Invoice editing and payment mutations stay disabled until their live detail contracts replace the remaining mock stores.</p>
      {loading ? <LoadingState label="Loading live invoices" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && rows.length === 0 ? (
        <EmptyState title="No invoices" description="No invoices have been created at this facility." />
      ) : null}
      {rows.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <caption className="sr-only">Live billing invoices</caption>
            <thead>
              <tr>
                {['Invoice', 'Patient', 'Identifier', 'Status', 'Gross', 'Net', 'Scheme', 'Created'].map((label) => (
                  <th key={label} scope="col" style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid #d7dde5" }}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #eef1f4" }}>{row.invoice_number}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #eef1f4" }}>{row.patient_full_name}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #eef1f4" }}>{row.patient_identifier}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #eef1f4" }}>{row.status.replaceAll("_", " ")}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #eef1f4" }}>{formatMoney(row.gross_amount)}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #eef1f4" }}>{formatMoney(row.net_amount)}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #eef1f4" }}>{row.scheme_code ?? "Self pay"}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #eef1f4" }}>{formatDateTime(row.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
