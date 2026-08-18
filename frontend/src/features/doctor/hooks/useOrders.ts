"use client";

import { useCallback, useState } from "react";

import { toast } from "@/components/ui/toast";
import { createOrder } from "../api";
import type { ActiveEncounter, DraftOrder } from "../types";

export function useOrders(encounter: ActiveEncounter) {
  const [orders, setOrders] = useState<DraftOrder[]>([]);
  const [adding, setAdding] = useState(false);

  const addOrder = useCallback(
    async (draft: Omit<DraftOrder, "tempId">) => {
      setAdding(true);
      try {
        await createOrder({
          encounter_id: encounter.id,
          patient_id: encounter.patient_id,
          ...draft,
        });
        setOrders((prev) => [
          ...prev,
          {
            tempId: crypto.randomUUID(),
            ...draft,
          },
        ]);
        toast.success(`${""} ordered`);
        return true;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to place order");
        return false;
      } finally {
        setAdding(false);
      }
    },
    [encounter],
  );

  const removeOrder = useCallback(
    (tempId: string) => setOrders((prev) => prev.filter((o) => o.tempId !== tempId)),
    [],
  );

  return { orders, adding, addOrder, removeOrder };
}
