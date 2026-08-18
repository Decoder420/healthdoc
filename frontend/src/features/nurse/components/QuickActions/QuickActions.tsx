import { QUICK_ACTIONS } from "./constants";
import { QuickActionsProps } from "./QuickActions.types";

export default function QuickActions({
  onAction,
}: QuickActionsProps) {
  return (
    <section className="surface-card p-6">

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Quick Actions
        </h2>

        <p className="text-sm text-muted-foreground">
          Frequently used nursing actions.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 xl:grid-cols-3">

        {QUICK_ACTIONS.map((action) => (

          <button
            key={action.id}
            onClick={() => onAction?.(action.id)}
            className="rounded-xl border border-border p-5 text-left transition hover:-translate-y-1 hover:shadow-md"
          >

            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-xl ${action.color}`}
            >
              {action.icon}
            </div>

            <h3 className="mt-4 font-semibold">
              {action.label}
            </h3>

          </button>

        ))}

      </div>

    </section>
  );
}