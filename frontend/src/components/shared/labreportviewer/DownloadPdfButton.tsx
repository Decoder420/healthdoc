"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface DownloadPdfButtonProps {
  reportId: string;
  reportNumber: string;
}

export default function DownloadPdfButton({
  reportId,
  reportNumber,
}: DownloadPdfButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/reports/${encodeURIComponent(reportId)}/pdf`
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? "Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${reportNumber || reportId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to download PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="report-download-btn inline-flex items-center gap-2 rounded-xl bg-[#001f54] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,31,84,0.28)] transition hover:-translate-y-0.5 hover:bg-[#003070] hover:shadow-[0_16px_36px_rgba(0,31,84,0.34)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {loading ? "Generating PDF…" : "Download PDF"}
      </button>
      {error && <p className="max-w-[220px] text-right text-xs text-red-600">{error}</p>}
    </div>
  );
}
