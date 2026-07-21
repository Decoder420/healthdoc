import { AdmissionStatusProps } from "./AdmissionStatus.types";

export default function AdmissionStatus({
  patient,
  records,
}: AdmissionStatusProps) {
  if (!patient) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          Select a patient to view admission status.
        </p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          No admission status available.
        </p>
      </div>
    );
  }

  return (
    <section className="surface-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Admission Status
        </h2>

        <p className="text-sm text-muted-foreground">
          Current admission workflow and latest status.
        </p>
      </div>

      <div className="space-y-5">
        {records.map((record) => (
          <div
            key={record.id}
            className="rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {record.status}
              </h3>

              <span className="text-xs text-muted-foreground">
                {record.updatedAt}
              </span>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  Updated By
                </p>

                <p className="font-medium">
                  {record.updatedBy}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Remarks
                </p>

                <p className="font-medium">
                  {record.remarks}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}