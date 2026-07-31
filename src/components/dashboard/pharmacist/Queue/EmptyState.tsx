export default function EmptyState() {
  return (
    <div className="surface-card p-12 text-center">
      <h3 className="text-lg font-semibold text-foreground">
        No Prescriptions Found
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        There are no prescriptions matching the current filters.
      </p>
    </div>
  );
}