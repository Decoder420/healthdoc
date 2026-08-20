import { Suspense } from "react";
import { LoginScreen } from "@/features/login/LoginScreen";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="surface-card p-8 text-sm text-muted-foreground">
          Loading sign in…
        </div>
      }
    >
      <LoginScreen />
    </Suspense>
  );
}
