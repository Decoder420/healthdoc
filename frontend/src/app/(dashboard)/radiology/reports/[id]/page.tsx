import { notFound } from "next/navigation";

import ReportViewer from "@/components/dashboard/radiology/Report/ReportViewer"
import { radiologyReports } from "@/components/dashboard/radiology/Report/dummyData"

interface ReportPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReportPage({
  params,
}: ReportPageProps) {
  const { id } = await params;

 const report = radiologyReports.find(
  (item) => item.id === id
);

  if (!report) {
    notFound();
  }

  return <ReportViewer report={report} />;
}