"use client";

import { PatientSearch } from "@/features/receptionist/PatientSearch";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Patient search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search before registering. A duplicate chart splits a patient&apos;s
          history across two records and takes a supervisor-approved merge to
          undo.
        </p>
      </div>

      <PatientSearch />
    </div>
  );
}
