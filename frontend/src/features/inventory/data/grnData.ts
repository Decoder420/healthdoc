import type { GRN } from "../types/grn";

const GRN_STORAGE_KEY = "hospital_grns";

export const getStoredGRNs = (): GRN[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(GRN_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load GRNs:", error);
    return [];
  }
};

export const saveGRNs = (grns: GRN[]) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    GRN_STORAGE_KEY,
    JSON.stringify(grns)
  );
};

export const createGRN = (grn: GRN) => {
  const existingGRNs = getStoredGRNs();

  const updatedGRNs = [
    ...existingGRNs,
    grn,
  ];

  saveGRNs(updatedGRNs);

  return grn;
};