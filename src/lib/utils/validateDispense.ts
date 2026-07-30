import { DispenseMedicine } from "@/features/pharmacy/types/types";

export function validateDispense(
  medicine: DispenseMedicine,
  quantity: number
) {
  if (quantity === 0) {
    return "Out of Stock";
  }

  if (quantity < medicine.prescribedQty) {
    return "Partial";
  }

  return "Available";
}