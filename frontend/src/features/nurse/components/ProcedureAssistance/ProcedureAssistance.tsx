import { ProcedureAssistanceProps, ProcedureSetting } from "./ProcedureAssistance.types";

const SETTING_LABELS: Record<ProcedureSetting, string> = {
  opd_minor: "OPD Minor Procedure",
  bedside: "Bedside",
  emergency: "Emergency",
  ot: "Operation Theatre",
};

export default function ProcedureAssistance({
  patientId,
  records,
}: ProcedureAssistanceProps) {
  if (!patientId) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          Select a patient to view procedures.
        </p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          No procedure records available.
        </p>
      </div>
    );
  }

  return (
    <section className="surface-card overflow-hidden">
      <div className="border-b border-border p-6">
        <h2 className="text-xl font-semibold">Procedure Assistance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Procedures performed for this patient, with assisting nurse.
        </p>
      </div>

      <div className="space-y-4 p-6">
        {records.map((record) => (
          <div key={record.id} className="rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{record.procedure_name}</h3>
              <span className="rounded-full bg-info-muted px-2 py-1 text-xs font-medium text-info">
                {SETTING_LABELS[record.setting]}
              </span>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Performed By</p>
                <p className="font-medium">{record.performed_by}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Assisted By (Nurse)</p>
                <p className="font-medium">{record.assisted_by ?? "-"}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Started</p>
                <p className="font-medium" suppressHydrationWarning>
                  {new Date(record.started_at).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Ended</p>
                <p className="font-medium" suppressHydrationWarning>
                  {record.ended_at ? new Date(record.ended_at).toLocaleString() : "-"}
                </p>
              </div>
            </div>

            {record.outcome && (
              <div className="mt-4 rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">Outcome</p>
                <p className="mt-1 text-sm">{record.outcome}</p>
              </div>
            )}

            {record.complications && (
              <div className="mt-3 rounded-lg bg-danger-muted p-3">
                <p className="text-xs text-danger">Complications</p>
                <p className="mt-1 text-sm text-danger">{record.complications}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
