import { DoctorInstructionsProps } from "./DoctorInstructions.types";

export default function DoctorInstructions({
  patient,
  instructions,
}: DoctorInstructionsProps) {
  if (!patient) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          Select a patient to view doctor instructions.
        </p>
      </div>
    );
  }

  if (instructions.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          No doctor instructions available.
        </p>
      </div>
    );
  }

  return (
    <section className="surface-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Doctor Instructions
        </h2>

        <p className="text-sm text-muted-foreground">
          Active medical orders for the selected patient.
        </p>
      </div>

      <div className="space-y-4">
        {instructions.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  {item.doctorName}
                </h3>

                <p className="text-xs text-muted-foreground">
                  {item.orderedAt}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  item.status === "Completed"
                    ? "bg-success-muted text-success"
                    : "bg-warning-muted text-warning"
                }`}
              >
                {item.status}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6">
              {item.instruction}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}