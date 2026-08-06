import { notFound } from "next/navigation";

import ReportViewer from "@/components/dashboard/radiology/Report/ReportViewer";
import { buildReport } from "@/components/dashboard/radiology/Report/ReportBuilder";
import { appointmentQueue } from "@/components/dashboard/radiology/test_queue/DummyData";

interface ReportPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReportPage({
  params,
}: ReportPageProps) {
  const { id } = await params;

  const queueItem = appointmentQueue.find(
    (item) =>
      item.accessionNumber === id ||
      String(item.id) === id ||
      item.orderId === id
  );

  if (!queueItem) {
    notFound();
  }

  const report = buildReport(queueItem);

  return (
    <ReportViewer
      report={report}
      accessionNumber={queueItem.accessionNumber}
    />
  );
}