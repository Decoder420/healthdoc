"use client";

import { useRouter } from "next/navigation";
import DepartmentDashboard from "../dashboard/layout";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import {
  MRI_CASES,
  getDepartmentReporting,
  getDepartmentStats,
  getDepartmentStatus,
  getDepartmentTrend,
} from "../departmentCases";

export default function MRIDashboard() {
  const router = useRouter();
  const rows = MRI_CASES;

  return (
    <DepartmentDashboard
      title="MRI Dashboard"
      subtitle="Today's MRI Workflow"
      description="Manage MRI studies, verification and reports."
      icon={<MedicalServicesOutlinedIcon />}
      stats={getDepartmentStats(rows)}
      trendData={getDepartmentTrend(rows)}
      statusData={getDepartmentStatus(rows)}
      reportingData={getDepartmentReporting()}
      chartConfig={{
        trendTitle: "MRI Study Volume",
        trendSubtitle: "Today's MRI studies",
        statusTitle: "MRI Report Status",
        statusSubtitle: "Processing vs Verified",
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
