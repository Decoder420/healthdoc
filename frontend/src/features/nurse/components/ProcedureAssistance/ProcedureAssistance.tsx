import { ProcedureAssistanceProps } from "./ProcedureAssistance.types";

export default function ProcedureAssistance({
  patient,
  procedures,
}: ProcedureAssistanceProps) {
  if (!patient) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          Select a patient to view procedures.
        </p>
      </div>
    );
  }

  if (procedures.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          No procedures available.
        </p>
      </div>
    );
  }

  return (
    <section className="surface-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Procedure Assistance
        </h2>

        <p className="text-sm text-muted-foreground">
          Procedures assigned for the selected patient.
        </p>
      </div>

      <div className="space-y-5">
        {procedures.map((procedure) => (
          <div
            key={procedure.id}
            className="rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {procedure.procedureName}
              </h3>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {procedure.status}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  Doctor
                </p>

                <p className="font-medium">
                  {procedure.doctorName}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Assisted By
                </p>

                <p className="font-medium">
                  {procedure.assistedBy}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Scheduled At
                </p>

                <p className="font-medium">
                  {procedure.scheduledAt}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Remarks
                </p>

                <p className="font-medium">
                  {procedure.remarks}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}