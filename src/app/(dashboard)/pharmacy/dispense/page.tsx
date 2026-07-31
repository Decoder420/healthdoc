import { Suspense } from "react";
import { PharmacyDispenseScreen } from "@/features/pharmacy/PharmacyDispenseScreen";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PharmacyDispenseScreen />
    </Suspense>
  );
} 


















































