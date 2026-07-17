type ModulePageProps = {
  title: string;
  description?: string;
};

export function ModulePage({ title, description }: ModulePageProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Module content will be implemented here.
      </div>
    </div>
  );
}
