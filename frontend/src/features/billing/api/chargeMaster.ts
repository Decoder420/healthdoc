/**
 * Mock charge_master list/lookup — mirrors future tariff CRUD / accrual lookup.
 * Live BE has migration 0033 only; no HTTP yet. Keep this contract for easy swap.
 */

import {
  getChargeMasterStore,
  lookupChargeMaster,
} from "@/lib/mock/charge_master_data";
import type { ChargeMaster } from "../types";

function delay<T>(value: T, ms = 180): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

export type ChargeMasterListFilters = {
  query?: string;
  charge_category?: ChargeMaster["charge_category"] | "all";
  scheme_code?: string | null | "all";
  active_only?: boolean;
};

export async function listChargeMaster(
  filters: ChargeMasterListFilters = {},
): Promise<ChargeMaster[]> {
  const q = filters.query?.trim().toLowerCase() ?? "";
  let rows = getChargeMasterStore();
  if (filters.active_only !== false) {
    rows = rows.filter((r) => r.is_active);
  }
  if (filters.charge_category && filters.charge_category !== "all") {
    rows = rows.filter((r) => r.charge_category === filters.charge_category);
  }
  if (filters.scheme_code !== undefined && filters.scheme_code !== "all") {
    rows = rows.filter((r) => r.scheme_code === filters.scheme_code);
  }
  if (q) {
    rows = rows.filter((r) => {
      const hay = [r.charge_code, r.description, r.charge_category, r.scheme_code]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  return delay(rows);
}

export async function getChargeMaster(id: string): Promise<ChargeMaster | null> {
  return delay(getChargeMasterStore().find((r) => r.id === id) ?? null);
}

export async function resolveTariff(
  charge_code: string,
  scheme_code: string | null = null,
  asOf?: string,
): Promise<ChargeMaster | null> {
  return delay(lookupChargeMaster(charge_code, scheme_code, asOf));
}
