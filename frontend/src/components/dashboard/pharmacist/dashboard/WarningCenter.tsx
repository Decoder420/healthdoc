"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import WarningCards from "@/components/dashboard/pharmacist/dashboard/WarningCard";

import InteractionDialog from "@/components/dashboard/pharmacist/dashboard/InteractionDialog";
import NearExpiryDialog from "@/components/dashboard/pharmacist/dashboard/NearExpiryyDialog";
import LowStockDialog from "@/components/dashboard/pharmacist/dashboard/LowStockDialog";

export default function WarningCenter() {
  const router = useRouter();

  const [interactionOpen, setInteractionOpen] = useState(false);
  const [expiryOpen, setExpiryOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);

  const handleAction = (title: string) => {
    switch (title) {
      case "Drug Interaction Alerts":
        setInteractionOpen(true);
        break;

      case "Near Expiry Medicines":
        setExpiryOpen(true);
        break;

      case "Low Stock Medicines":
        setStockOpen(true);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <div className="surface-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#001F54]">
            Warning Center
          </h2>
        </div>

        <WarningCards {...({ onAction: handleAction } as any)} />
      </div>

      <InteractionDialog
        open={interactionOpen}
        onClose={() => setInteractionOpen(false)}
        {...({
          onReview: () => {
            setInteractionOpen(false);
            router.push("/pharmacy/prescription-queue");
          },
        } as any)}
      />

      <NearExpiryDialog
        open={expiryOpen}
        onClose={() => setExpiryOpen(false)}
        {...({
          onViewExpiry: () => {
            setExpiryOpen(false);
            router.push("/inventory/audit/stock-ledger");
          },
        } as any)}
      />

      <LowStockDialog
        open={stockOpen}
        onClose={() => setStockOpen(false)}
        {...({
          onViewStock: () => {
            setStockOpen(false);
            router.push("/inventory/stock-list");
          },
        } as any)}
      />
    </>
  );
}