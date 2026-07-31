import type { RecentRegistration } from "@/features/dashboard/types";

export function RecentRegistrations({
  registrations,
}: {
  registrations: RecentRegistration[];
}) {
  return (
    <div className="surface-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">Recent Registrations</h2>
        <p className="text-xs text-muted-foreground">Patients registered today</p>
      </div>
      <ul className="divide-y divide-border">
        {registrations.map((reg) => (
          <li key={reg.id} className="px-5 py-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-sans text-sm font-medium text-foreground">
                  {reg.patientName}
                </p>
                <p className="text-xs text-muted-foreground">{reg.patientId}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {reg.registeredAt}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{reg.contact}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
