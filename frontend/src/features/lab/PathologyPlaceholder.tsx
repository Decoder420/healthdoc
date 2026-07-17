import ModulePage from "@/components/shared/ModulePage";

/** Lab pathology stub screen. */
export default function PathologyPlaceholder({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return <ModulePage title={title} description={description} />;
}
