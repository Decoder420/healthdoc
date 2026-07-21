import { NursingNotesProps } from "./NursingNotes.types";

export default function NursingNotes({
  patient,
  notes,
}: NursingNotesProps) {
  if (!patient) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          Select a bed to view nursing notes.
        </p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          No nursing notes available for this patient.
        </p>
      </div>
    );
  }

  return (
    <section className="surface-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Nursing Notes
        </h2>

        <p className="text-sm text-muted-foreground">
          Nursing observations for the selected patient.
        </p>
      </div>

      <div className="space-y-6">
        {notes.map((note) => (
          <div
            key={note.id}
            className="relative border-l-2 border-border pl-6"
          >
            <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary"></span>

            <div className="rounded-xl border border-border p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {note.recordedBy}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {note.recordedAt}
                  </p>
                </div>
              </div>

              <p className="mt-4 leading-7">
                {note.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}