import type { DispenseBatch } from "@/features/pharmacy/types/types";

export function selectFEFOBatch(
  batches: DispenseBatch[]
): DispenseBatch | null {
  if (!batches.length) {
    return null;
  }

  const validBatches = batches.filter(
    (batch) => batch.availableStock > 0
  );

  if (!validBatches.length) {
    return null;
  }

  return [...validBatches].sort(
    (a, b) =>
      new Date(a.expiryDate).getTime() -
      new Date(b.expiryDate).getTime()
  )[0];
}