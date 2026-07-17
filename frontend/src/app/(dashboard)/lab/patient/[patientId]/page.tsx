import PatientInfo from "@/components/dashboard/lab/PatientInfo";

export default async function PatientPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;

  return <PatientInfo patientId={patientId} />;
}
