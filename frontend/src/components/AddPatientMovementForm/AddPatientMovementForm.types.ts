import type { Ward } from "@/features/nurse/components/WardSelector/WardSelector.types";
import type { Bed } from "@/components/BedGrid/BedGrid.types";
import type { AddPatientMovementSchema } from "./validation";

export interface AddPatientMovementFormProps {
  admissionId: string;
  wards: Ward[];
  beds: Bed[];

  isSubmitting?: boolean;

  onSubmit: (data: AddPatientMovementSchema) => Promise<boolean> | boolean;
}
