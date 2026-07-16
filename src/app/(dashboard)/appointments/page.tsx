import { Suspense } from "react";
import { AppointmentsModule } from "@/components/appointments";

export default function AppointmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="surface-card p-8 text-sm text-muted-foreground">
          Loading appointments…
        </div>
      }
    >
      <AppointmentsModule />
    </Suspense>
  );
}
