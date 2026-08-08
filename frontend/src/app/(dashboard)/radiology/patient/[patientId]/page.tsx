import PatientProfile from "@/components/dashboard/radiology/PatientPage/Patient";

interface Props {
  params: Promise<{
    patientId: string;
  }>;
}

export default async function Page({
  params,
}: Props) {
  const { patientId } = await params;

  return (
    <PatientProfile patientId={patientId} />
  );
}