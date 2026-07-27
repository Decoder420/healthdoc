import PatientProfile from "@/components/dashboard/lab-technician/Patient_page/patient"

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