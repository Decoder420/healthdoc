import { PatientMovementProps } from "./PatientMovement.types";

export default function PatientMovement({
  patient,
  records,
}: PatientMovementProps) {
  if (!patient) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          Select a patient to view movement history.
        </p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          No movement records available.
        </p>
      </div>
    );
  }

  return (
    <section className="surface-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Patient Movement
        </h2>

        <p className="text-sm text-muted-foreground">
          Bed changes, ward transfers and movement history.
        </p>
      </div>

      <div className="space-y-5">
        {records.map((record) => (
          <div
            key={record.id}
            className="rounded-xl border border-border p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold">
                  {record.movementType}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {record.movedAt}
                </p>
              </div>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {record.movementType}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  From
                </p>

                <p className="font-medium">
                  {record.fromLocation}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  To
                </p>

                <p className="font-medium">
                  {record.toLocation}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Approved By
                </p>

                <p className="font-medium">
                  {record.approvedBy}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Reason
                </p>

                <p className="font-medium">
                  {record.reason}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}