"use client";

import { useRouter } from "next/navigation";

import DepartmentDashboard from "../dashboard/layout";

import WbIridescentOutlinedIcon from "@mui/icons-material/WbIridescentOutlined";

import {
  appointmentQueue,
  getRadiologyQueueStats,
  getRadiologyImagingTrend,
} from "@/components/dashboard/radiology/test_queue/DummyData";

export default function XRayDashboard() {
  const router = useRouter();

  // Only X-Ray studies
  const rows = appointmentQueue.filter(
    (item) => item.modality === "X-Ray"
  );

  const statsData = getRadiologyQueueStats(rows);

  const trend = getRadiologyImagingTrend(rows);

  return (
    <DepartmentDashboard
      title="X-Ray Dashboard"
      subtitle="Today's X-Ray Workflow"
      description="Manage X-Ray studies, verification and reports."
      icon={<WbIridescentOutlinedIcon />}

      stats={[
        {
          title: "Total X-Ray Studies",
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
        trendTitle: "X-Ray Study Volume",
        trendSubtitle: "Today's X-Ray studies",

        statusTitle: "X-Ray Workflow Status",
        statusSubtitle: "Queue → Processing → Verified",

        reportingTitle: "X-Ray Reporting Time",
        reportingSubtitle: "Last 7 days",
      }}

      rows={rows}

      onVerify={(row) => {
        console.log("Verify X-Ray Report", row.id);
      }}

      onViewReport={(row) => {
        router.push(
          `/radiology/reports/${row.accessionNumber}`
        );
      }}

      onRefresh={() => {
        console.log("Refresh X-Ray Dashboard");
      }}

      onExport={() => {
        console.log("Export X-Ray Reports");
      }}
    />
  );
}