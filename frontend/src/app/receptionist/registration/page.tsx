"use client";

import { useState } from "react";

import { PatientSearch } from "@/features/receptionist/PatientSearch";
import { RegistrationForm } from "@/features/receptionist/RegistrationForm";

/**
 * Registration (#170).
 *
 * Search first, register second — in that order on the page, deliberately.
 * Registration is the step that creates duplicates, and a duplicate chart takes
 * a supervisor-approved merge to undo. Putting the search above the form makes
 * the cheap check the default rather than a discipline.
 */
export default function Page() {
  const [confirmedNew, setConfirmedNew] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Register patient</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Check whether this patient already has a record before creating one.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">1. Search for an existing record</h2>
        <PatientSearch
          selectLabel="Use this patient"
          onSelect={(patient) => {
            // Deliberately not silently navigating away. The receptionist has
            // found an existing chart; what happens next (start a visit,
            // request a merge) is the next screen's job, and guessing here
            // would take the decision away from them.
            window.alert(
              `Existing record: ${patient.full_name} (${patient.uhid ?? "no UHID"}).\n` +
                `Use this chart instead of registering a new one.`,
            );
          }}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">2. Register a new patient</h2>

        {!confirmedNew ? (
          <div className="surface-card space-y-3 p-6">
            <p className="text-sm text-muted-foreground">
              Only continue if the search above returned no match for this
              person.
            </p>
            <button
              type="button"
              onClick={() => setConfirmedNew(true)}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium"
            >
              No existing record — register new
            </button>
          </div>
        ) : (
          <RegistrationForm />
        )}
      </section>
    </div>
  );
}
