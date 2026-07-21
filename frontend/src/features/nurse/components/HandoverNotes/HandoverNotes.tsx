import { HandoverNotesProps } from "./HandoverNotes.types";

export default function HandoverNotes({
  patient,
  notes,
}: HandoverNotesProps) {
  if (!patient) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          Select a patient to view handover notes.
        </p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          No handover notes available.
        </p>
      </div>
    );
  }

  return (
    <section className="surface-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Handover Notes
        </h2>

        <p className="text-sm text-muted-foreground">
          Shift handover information for the selected patient.
        </p>
      </div>

      <div className="space-y-5">
        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {note.fromShift} → {note.toShift}
              </h3>

              <span className="text-xs text-muted-foreground">
                {note.handedOverAt}
              </span>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  Outgoing Nurse
                </p>

                <p className="font-medium">
                  {note.outgoingNurse}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Incoming Nurse
                </p>

                <p className="font-medium">
                  {note.incomingNurse}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">
                Summary
              </p>

              <p className="mt-2 text-sm leading-6">
                {note.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}