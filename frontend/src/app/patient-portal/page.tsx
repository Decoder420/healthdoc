export default function Page() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Patient portal</p>
        <h1 className="mt-2 text-3xl font-semibold">Identity verification required</h1>
        <p className="mt-3 text-muted-foreground">
          Your signed-in account is not yet cryptographically linked to one HealthDoc patient
          record. Clinical records stay unavailable until that relationship is provisioned.
        </p>
      </div>

      <section className="surface-card space-y-3 p-5">
        <h2 className="text-lg font-medium">Why access is paused</h2>
        <p className="text-sm text-muted-foreground">
          A portal role alone cannot prove which patient you are. HealthDoc will not ask for a
          patient ID or let an account browse facility records as a workaround.
        </p>
        <p className="text-sm text-muted-foreground">
          Portal activation requires an account-to-patient binding created after verified ABHA
          OTP or an approved in-person identity check. Contact the registration desk to complete
          verification.
        </p>
      </section>

      <p role="status" className="rounded-md border border-success/30 bg-success-muted p-4 text-sm text-success">
        No patient data has been requested or displayed on this screen.
      </p>
    </div>
  );
}
