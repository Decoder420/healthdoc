"use client";

import { useRouter } from "next/navigation";

import DepartmentDashboard from "../dashboard/layout";

import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";

import {
  appointmentQueue,
  getRadiologyQueueStats,
  getRadiologyImagingTrend,
} from "@/components/dashboard/radiology/test_queue/DummyData";


export default function ECGDashboard() {

  const router = useRouter();


  // Only ECG studies
  const rows = appointmentQueue.filter(
    (item) => item.modality === "ECG"
  );


  const stats =
    getRadiologyQueueStats(rows);


  const trend =
    getRadiologyImagingTrend(rows);



  return (

    <DepartmentDashboard

      title="ECG Dashboard"

      subtitle="Today's ECG Workflow"

      description="Manage ECG studies, processing and reports."

      icon={
        <MonitorHeartOutlinedIcon />
      }



      stats={[

        {
          title: "Total ECG Studies",
          text: stats.total,
        },

        {
          title: "In Queue",
          text: stats.inQueue,
        },

        {
          title: "Processing",
          text: stats.inProgress,
        },

        {
          title: "Verified Reports",
          text: stats.verified,
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
          value: stats.inQueue,
        },

        {
          name: "Processing",
          value: stats.inProgress,
        },

        {
          name: "Verified",
          value: stats.verified,
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

        trendTitle: "ECG Study Volume",

        trendSubtitle: "Today's ECG studies",


        statusTitle: "ECG Workflow Status",

        statusSubtitle:
          "Queue → Processing → Verified",


        reportingTitle:
          "ECG Reporting Time",

        reportingSubtitle:
          "Last 7 days",

      }}



      rows={rows}



      onVerify={(row) => {

        console.log(
          "Verify ECG Report",
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
          "Refresh ECG Dashboard"
        );

      }}



      onExport={() => {

        console.log(
          "Export ECG Reports"
        );

      }}


    />

  );
}