"use client";

import { useRouter } from "next/navigation";

import DepartmentDashboard from "../dashboard/layout";

import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";

import {
  appointmentQueue,
  getRadiologyQueueStats,
  getRadiologyImagingTrend,
} from "@/components/dashboard/radiology/test_queue/DummyData";

export default function MRIDashboard() {
  const router = useRouter();

  // Only MRI studies
  const rows = appointmentQueue.filter(
    (item) => item.modality === "MRI"
  );

  const statsData = getRadiologyQueueStats(rows);

  const trend = getRadiologyImagingTrend(rows);

  return (
    <DepartmentDashboard
      title="MRI Dashboard"
      subtitle="Today's MRI Workflow"
      description="Manage MRI studies, verification and reports."
      icon={<MedicalServicesOutlinedIcon />}

      stats={[
        {
          title: "Total MRI Studies",
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
        trendTitle: "MRI Study Volume",
        trendSubtitle: "Today's MRI studies",

        statusTitle: "MRI Workflow Status",
        statusSubtitle: "Queue → Processing → Verified",

        reportingTitle: "MRI Reporting Time",
        reportingSubtitle: "Last 7 days",
      }}

      rows={rows}

      onVerify={(row) => {
        console.log("Verify MRI Report", row.id);
      }}

      onViewReport={(row) => {
        router.push(`/radiology/reports/${row.id}`);
      }}

      onRefresh={() => {
        console.log("Refresh MRI Dashboard");
      }}

      onExport={() => {
        console.log("Export MRI Reports");
      }}
    />
  );
}