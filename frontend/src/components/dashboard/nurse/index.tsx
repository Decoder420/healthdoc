type NurseDashboardProps = {
  userName?: string;
};

export function NurseDashboard({ userName = "Nurse" }: NurseDashboardProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-foreground">
        Welcome, {userName}
      </h1>
      <p className="text-sm text-muted-foreground">
        Ward assignments, vitals, and patient care tasks.
      </p>
      <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Nurse dashboard content will be implemented here.
      </div>
    </div>
  );
}
