import { Suspense } from "react";
import { ReceptionistPatientSearchScreen } from "@/features/receptionist/ReceptionistPatientSearchScreen";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="surface-card p-8 text-sm text-muted-foreground">
          Loading patient search…
        </div>
      }
    >
      <ReceptionistPatientSearchScreen />
    </Suspense>
  );
}
