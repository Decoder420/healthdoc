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

  const handleDownload = async () => {
    if (!reportId) {
      alert("Report ID not found.");
      return;
    }

    setLoading(true);

    try {
      console.log("Downloading:", reportId);

      const response = await fetch(
        `/api/reports/${encodeURIComponent(reportId)}/pdf`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${reportNumber || reportId}.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      alert("Unable to download PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="report-download-btn inline-flex items-center gap-2 rounded-xl bg-[#001f54] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#003070] disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download PDF
        </>
      )}
    </button>
  );
}