"use client";

import { useRouter } from "next/navigation";

import DepartmentDashboard from "../dashboard/layout";

import ViewInArOutlinedIcon from "@mui/icons-material/ViewInArOutlined";

import {
  appointmentQueue,
  getRadiologyQueueStats,
  getRadiologyImagingTrend,
} from "@/components/dashboard/radiology/test_queue/DummyData";


export default function CTDashboard() {

  const router = useRouter();


  // Only CT studies
  const rows = appointmentQueue.filter(
    (item) => item.modality === "CT"
  );


  const statsData =
    getRadiologyQueueStats(rows);


  const trend =
    getRadiologyImagingTrend(rows);



  return (

    <DepartmentDashboard

      title="CT Dashboard"

      subtitle="Today's CT Workflow"

      description="Manage CT studies, scanning workflow and reports."

      icon={
        <ViewInArOutlinedIcon />
      }



      stats={[

        {
          title: "Total CT Scans",
          text: statsData.total,
        },

        {
          title: "In Queue",
          text: statsData.inQueue,
        },

        {
          title: "Processing",
          text: statsData.inProgress,
        },

        {
          title: "Verified Reports",
          text: statsData.verified,
        },

      ]}





      trendData={
        trend.todayData.map((item) => ({

          label: item.hour,

          value: item.scans,

        }))
      }






      statusData={[

        {
          name: "Queue",
          value: statsData.inQueue,
        },

        {
          name: "Processing",
          value: statsData.inProgress,
        },

        {
          name: "Verified",
          value: statsData.verified,
        },
      ]}





      reportingData={[

        {
          day: "Mon",
          minutes: 35,
        },

        {
          day: "Tue",
          minutes: 40,
        },

        {
          day: "Wed",
          minutes: 32,
        },

        {
          day: "Thu",
          minutes: 28,
        },

        {
          day: "Fri",
          minutes: 38,
        },

        {
          day: "Sat",
          minutes: 30,
        },

        {
          day: "Sun",
          minutes: 25,
        },

      ]}






      chartConfig={{

        trendTitle: "CT Study Volume",

        trendSubtitle: "Today's CT studies",


        statusTitle: "CT Workflow Status",

        statusSubtitle: "Current CT workflow",


        reportingTitle: "CT Reporting Time",

        reportingSubtitle: "Last 7 days",

      }}






      rows={rows}






      onVerify={(row) => {

        console.log(
          "Verify CT Report",
          row.id
        );

      }}






      onViewReport={(row) => {
        router.push(
          `/radiology/reports/${row.accessionNumber}`
        );
      }}




      onRefresh={() => {

        console.log(
          "Refresh CT Dashboard"
        );

      }}






      onExport={() => {

        console.log(
          "Export CT Reports"
        );

      }}



    />

  );

}