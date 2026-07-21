import { PatientTimelineProps } from "./PatientTimeline.types";

export default function PatientTimeline({
  patient,
  events,
}: PatientTimelineProps) {
  if (!patient) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          Select a patient to view timeline.
        </p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          No timeline events available.
        </p>
      </div>
    );
  }

  return (
    <section className="surface-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Patient Timeline
        </h2>

        <p className="text-sm text-muted-foreground">
          Complete activity timeline for the selected patient.
        </p>
      </div>

      <div className="relative border-l-2 border-border ml-3 space-y-8">

        {events.map((event) => (

          <div
            key={event.id}
            className="relative pl-8"
          >

            <div className="absolute -left-[11px] top-2 h-5 w-5 rounded-full bg-primary border-4 border-background" />

            <div className="rounded-xl border border-border p-5">

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                <div>

                  <h3 className="font-semibold">
                    {event.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {event.recordedAt}
                  </p>

                </div>

                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {event.type}
                </span>

              </div>

              <div className="mt-4">

                <p className="text-xs text-muted-foreground">
                  Description
                </p>

                <p className="mt-1 text-sm leading-6">
                  {event.description}
                </p>

              </div>

              <div className="mt-4">

                <p className="text-xs text-muted-foreground">
                  Recorded By
                </p>

                <p className="font-medium">
                  {event.recordedBy}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}