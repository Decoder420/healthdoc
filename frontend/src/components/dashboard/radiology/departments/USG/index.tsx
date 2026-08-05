"use client";

import { useRouter } from "next/navigation";

import DepartmentDashboard from "../dashboard/layout";

import GraphicEqOutlinedIcon from "@mui/icons-material/GraphicEqOutlined";

import {
  appointmentQueue,
  getRadiologyQueueStats,
  getRadiologyImagingTrend,
} from "@/components/dashboard/radiology/test_queue/DummyData";

export default function USGDashboard() {
  const router = useRouter();

  // Only USG studies
  const rows = appointmentQueue.filter(
    (item) => item.modality === "USG"
  );

  const statsData = getRadiologyQueueStats(rows);

  const trend = getRadiologyImagingTrend(rows);

  return (
    <DepartmentDashboard
      title="USG Dashboard"
      subtitle="Today's Ultrasound Workflow"
      description="Manage ultrasound studies, verification and reports."
      icon={<GraphicEqOutlinedIcon />}

      stats={[
        {
          title: "Total USG Studies",
          text: statsData.total,
        },
        {
          title: "Queue",
          text: statsData.inQueue,
        },
        {
          title: "Processing",
          text: statsData.inProgress,
        },
        {
          title: "Verified",
          text: statsData.verified,
        },
      ]}

      trendData={trend.todayData.map((item) => ({
        label: item.hour,
        value: item.scans,
      }))}

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
        trendTitle: "USG Study Volume",
        trendSubtitle: "Today's ultrasound studies",

        statusTitle: "USG Workflow Status",
        statusSubtitle: "Queue → Processing → Verified",

        reportingTitle: "USG Reporting Time",
        reportingSubtitle: "Last 7 days",
      }}

      rows={rows}

      onVerify={(row) => {
        console.log("Verify USG Report", row.id);
      }}

      onViewReport={(row) => {
        router.push(`/radiology/reports/${row.id}`);
      }}

      onRefresh={() => {
        console.log("Refresh USG Dashboard");
      }}

      onExport={() => {
        console.log("Export USG Reports");
      }}
    />
  );
}