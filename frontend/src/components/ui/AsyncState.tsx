type RetryProps = { onRetry?: () => void };

export function LoadingState({ label = "Loading live data…" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="surface-card space-y-3 p-6">
      <span className="sr-only">{label}</span>
      {["75%", "100%", "60%"].map((width) => (
        <div
          key={width}
          aria-hidden="true"
          className="h-4 animate-pulse rounded bg-muted"
          style={{ width }}
        />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string } & RetryProps) {
  return (
    <div role="alert" className="surface-card border-danger bg-danger-muted p-6 text-sm text-danger">
      <p className="font-semibold">Unable to load live data</p>
      <p className="mt-1">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="mt-3 rounded-md border border-danger px-3 py-2 font-semibold">
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div role="status" className="surface-card p-6 text-sm">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-muted-foreground">{description}</p>
    </div>
  );
}
