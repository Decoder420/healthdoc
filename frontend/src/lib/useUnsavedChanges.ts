"use client";

import { useEffect } from "react";

/**
 * Protect an in-memory clinical draft until its server save has completed.
 * Nothing is copied to local/session storage: SOAP notes are PHI.
 */
export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;

    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);
}
