"use client";

import { useRef, useState } from "react";
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

  const controllerRef = useRef<AbortController | null>(null);

  const handleDownload = async () => {
    if (loading) return;

    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/reports/${encodeURIComponent(reportId)}/pdf`,
        {
          method: "GET",
          signal: controller.signal,
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Download failed (${response.status})`
        );
      }

      const blob = await response.blob();

      const disposition = response.headers.get(
        "Content-Disposition"
      );

      const filename =
        disposition?.match(/filename="?([^"]+)"?/)?.[1] ??
        `${reportNumber}.pdf`;

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = filename;
      link.style.display = "none";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error(error);

      alert("Failed to download the PDF. Please try again.");
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl bg-[#001f54] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#003070] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Downloading...
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