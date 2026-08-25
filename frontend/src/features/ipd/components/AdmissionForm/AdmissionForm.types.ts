import type { Ward } from "@/features/nurse/components/WardSelector/WardSelector.types";
import type { Bed } from "@/components/BedGrid/BedGrid.types";
import type { AddAdmissionSchema } from "./validation";

export interface AdmissionFormProps {
  wards: Ward[];
  beds: Bed[]; 

  isSubmitting?: boolean;

  onSubmit: (data: AddAdmissionSchema) => Promise<boolean> | boolean;
}