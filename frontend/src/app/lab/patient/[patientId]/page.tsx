import PatientInfo from "@/components/ui/PatientInfo";

export default async function PatientPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;


  return <PatientInfo patientId={patientId} />;
}