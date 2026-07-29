import type { Ward } from "@/features/nurse/components/WardSelector/WardSelector.types";
import type { Bed } from "@/components/BedGrid/BedGrid.types";
import type { AddPatientMovementSchema } from "./validation";

export interface AddPatientMovementFormProps {
  admissionId: string;

  // Patient's current location — pre-filled from the selected bed, not chosen
  // by the nurse in this form.
  currentWardId: string | null;
  currentBedId: string | null;

  wards: Ward[];
  beds: Bed[]; // full beds list; form filters to destination ward + vacant status

  // Should come from the logged-in nurse's session (auth context), not typed
  // manually. Kept as a plain prop until session/auth wiring exists.
  movedBy: string;

  isSubmitting?: boolean;

  onSubmit: (data: AddPatientMovementSchema) => Promise<boolean> | boolean;
}