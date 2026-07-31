import { DispenseMedicine } from "@/features/pharmacy/types/types";

export function selectFEFOBatch(
  medicine: DispenseMedicine
): string {
  return medicine.batchNumber;
}