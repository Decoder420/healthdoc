"use client";

import { Printer, Download, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { useSearchParams } from "next/navigation";

export function ReceiptPreviewScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const receiptNo = searchParams.get("receipt");

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/pharmacy/receipt?receipt=${receiptNo}`);

      if (!response.ok) {
        throw new Error("Failed to generate receipt.");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "pharmacy-receipt.pdf";

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      // Redirect to a fresh dispense page
      router.replace("/pharmacy/dispense");
    } catch (error) {
      console.error(error);
      alert("Failed to download receipt.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="surface-card p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="btn btn-outline"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h2 className="text-xl font-semibold text-[#001F54]">
              Pharmacy Receipt
            </h2>

            <p className="text-sm text-gray-500">
  {receiptNo ?? "Current Receipt"}
</p>

            <p className="text-sm text-gray-500">
              Preview before printing
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            <Printer size={18} />
            Print
          </button>

          <button
            onClick={handleDownload}
            className="btn btn-primary"
          >
            <Download size={18} />
            Download
          </button>
        </div>
      </div>

      <div className="surface-card p-4">
        <iframe
          src={`/api/pharmacy/receipt?receipt=${receiptNo}`}
          className="w-full h-[900px] rounded-lg border"
        />
      </div>
    </div>
  );
}