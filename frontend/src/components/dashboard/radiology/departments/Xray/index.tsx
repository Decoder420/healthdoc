"use client";

import { useRouter } from "next/navigation";
import DepartmentDashboard from "../dashboard/layout";
import WbIridescentOutlinedIcon from "@mui/icons-material/WbIridescentOutlined";
import {
  XRAY_CASES,
  getDepartmentReporting,
  getDepartmentStats,
  getDepartmentStatus,
  getDepartmentTrend,
} from "../departmentCases";

export default function XRayDashboard() {
  const router = useRouter();
  const rows = XRAY_CASES;

  return (
    <DepartmentDashboard
      title="X-Ray Dashboard"
      subtitle="Today's X-Ray Workflow"
      description="Manage X-Ray studies, verification and reports."
      icon={<WbIridescentOutlinedIcon />}
      stats={getDepartmentStats(rows)}
      trendData={getDepartmentTrend(rows)}
      statusData={getDepartmentStatus(rows)}
      reportingData={getDepartmentReporting()}
      chartConfig={{
        trendTitle: "X-Ray Study Volume",
        trendSubtitle: "Today's X-Ray studies",
        statusTitle: "X-Ray Report Status",
        statusSubtitle: "Processing vs Verified",
        reportingTitle: "X-Ray Reporting Time",
        reportingSubtitle: "Last 7 days",
      }}
      rows={rows}
      onVerify={(row) => console.log("Verify X-Ray Report", row.id)}
      onViewReport={(row) => router.push(`/radiology/reports/${row.id}`)}
      onRefresh={() => console.log("Refresh X-Ray Dashboard")}
      onExport={() => console.log("Export X-Ray Reports")}
    />
  );
}
