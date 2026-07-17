type DoctorDashboardProps = {
  userName?: string;
};

export function DoctorDashboard({ userName = "Doctor" }: DoctorDashboardProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-foreground">
        Welcome, Dr. {userName}
      </h1>
      <p className="text-sm text-muted-foreground">
        Today&apos;s appointments, patients, and clinical tasks.
      </p>
      <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Doctor dashboard content will be implemented here.
      </div>
    </div>
  );
}
