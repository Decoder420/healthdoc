"use client";

import { useCallback, useState } from "react";

import { toast } from "@/components/ui/toast";
import { placeOrder } from "../api";
import { localOnly } from "../lib/mockMode";
import type { ActiveEncounter, DraftOrder, PlacedOrder } from "../types";

export function useOrders(encounter: ActiveEncounter) {
  const [orders, setOrders] = useState<DraftOrder[]>([]);
  /** What the department gave back — the doctor needs the accession number. */
  const [placed, setPlaced] = useState<PlacedOrder[]>([]);
  const [adding, setAdding] = useState(false);

  const addOrder = useCallback(
    async (draft: Omit<DraftOrder, "tempId">) => {
      setAdding(true);
      try {
        // Two calls: the order header, then the department detail row.
        const result = await placeOrder(draft, {
          encounter_id: encounter.id,
          patient_id: encounter.patient_id,
        });
        // Only append after the write came back — never optimistically.
        setOrders((prev) => [...prev, { tempId: crypto.randomUUID(), ...draft }]);
        setPlaced((prev) => [...prev, result]);
        toast.success(
          localOnly(
            `${result.item_label} ordered${
              result.accession_number ? ` · ${result.accession_number}` : ""
            }`,
          ),
        );
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

  return { orders, placed, adding, addOrder, removeOrder };
}
