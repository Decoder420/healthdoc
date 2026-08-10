import { FormSectionProps } from "./FormSection.types";

export default function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="surface-card p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}

      </div>

      {children}

    </section>
  );
}