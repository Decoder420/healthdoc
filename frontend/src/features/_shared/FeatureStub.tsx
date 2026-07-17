export default function FeatureStub({
  title = "Coming soon",
}: {
  title?: string;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-2 text-muted-foreground">
        This module is scaffolded and ready for implementation.
      </p>
    </main>
  );
}
