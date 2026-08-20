import type { Ward } from "@/features/nurse/components/WardSelector/WardSelector.types";
import type { Bed } from "@/components/BedGrid/BedGrid.types";
import type { AddPatientMovementSchema } from "./validation";

export interface AddPatientMovementFormProps {
  admissionId: string;
  currentWardId: string | null;
  currentBedId: string | null;
  wards: Ward[];
  beds: Bed[];
  movedBy: string;
  
  isSubmitting?: boolean;

  onSubmit: (data: AddPatientMovementSchema) => Promise<boolean> | boolean;
}