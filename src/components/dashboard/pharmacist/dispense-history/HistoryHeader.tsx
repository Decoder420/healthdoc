"use client";

import { History, Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HistoryHeader() {
  const router = useRouter();

  return (
    <div className="surface-card p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
          <History className="text-[#001F54]" size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-[#001F54]">
            Dispense History
          </h1>

          <p className="text-sm text-gray-500">
            View completed dispenses, download receipts and reprint them.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="btn btn-outline"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={18} />
          Refresh
        </button>

        <button
          className="btn btn-primary"
          onClick={() => router.push("/pharmacy/prescription-queue")}
        >
          <Plus size={18} />
          New Dispense
        </button>
      </div>
    </div>
  );
}