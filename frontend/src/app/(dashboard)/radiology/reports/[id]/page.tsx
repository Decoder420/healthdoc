import { notFound } from "next/navigation";

import ReportViewer from "@/components/dashboard/radiology/Report/ReportViewer";

import {
  appointmentQueue,
} from "@/components/dashboard/radiology/test_queue/DummyData";

import {
  buildReport,
} from "@/components/dashboard/radiology/Report/ReportBuilder";


interface ReportPageProps {
  params: Promise<{
    accessionNo: string;
  }>;
}


export default async function ReportPage({
  params,
}: ReportPageProps) {


  const {
    accessionNo,
  } = await params;



  const queueItem =
    appointmentQueue.find(

      (item) =>

        item.accessionNumber === accessionNo

    );



  if (!queueItem) {

    notFound();

  }



  const report =
    buildReport(
      queueItem
    );



  return (

    <ReportViewer

      report={report}

    />

  );

}