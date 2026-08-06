"use client";

import { useRouter } from "next/navigation";

import DepartmentDashboard from "../dashboard/layout";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

import {
  appointmentQueue,
  getRadiologyQueueStats,
  getRadiologyImagingTrend,
} from "@/components/dashboard/radiology/test_queue/DummyData";

export default function MammographyDashboard() {
  const router = useRouter();

  // Only Mammography studies
  const rows = appointmentQueue.filter(
    (item) => item.modality === "Mammography"
  );

  const statsData = getRadiologyQueueStats(rows);

  const trend = getRadiologyImagingTrend(rows);

  return (
    <DepartmentDashboard
      title="Mammography Dashboard"
      subtitle="Today's Mammography Workflow"
      description="Manage mammography studies, verification and reports."
      icon={<FavoriteBorderOutlinedIcon />}

      stats={[
        {
          title: "Total Mammography Studies",
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
        { day: "Mon", minutes: 35 },
        { day: "Tue", minutes: 40 },
        { day: "Wed", minutes: 32 },
        { day: "Thu", minutes: 28 },
        { day: "Fri", minutes: 38 },
        { day: "Sat", minutes: 30 },
        { day: "Sun", minutes: 25 },
      ]}

      chartConfig={{
        trendTitle: "Mammography Study Volume",
        trendSubtitle: "Today's mammography studies",

        statusTitle: "Mammography Workflow Status",
        statusSubtitle: "Queue → Processing → Verified",

        reportingTitle: "Mammography Reporting Time",
        reportingSubtitle: "Last 7 days",
      }}

      rows={rows}

      onVerify={(row) => {
        console.log("Verify Mammography Report", row.id);
      }}

      onViewReport={(row) => {
        router.push(
          `/radiology/reports/${row.accessionNumber}`
        );
      }}

      onRefresh={() => {
        console.log("Refresh Mammography Dashboard");
      }}

      onExport={() => {
        console.log("Export Mammography Reports");
      }}
    />
  );
}