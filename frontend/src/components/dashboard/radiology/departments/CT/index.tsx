"use client";

import { useRouter } from "next/navigation";
import DepartmentDashboard from "../dashboard/layout";
import ViewInArOutlinedIcon from "@mui/icons-material/ViewInArOutlined";
import {
  CT_CASES,
  getDepartmentReporting,
  getDepartmentStats,
  getDepartmentStatus,
  getDepartmentTrend,
} from "../departmentCases";

export default function CTDashboard() {
  const router = useRouter();
  const rows = CT_CASES;

  return (
    <DepartmentDashboard
      title="CT Dashboard"
      subtitle="Today's CT Workflow"
      description="Manage CT studies, verification and reports."
      icon={<ViewInArOutlinedIcon />}
      stats={getDepartmentStats(rows)}
      trendData={getDepartmentTrend(rows)}
      statusData={getDepartmentStatus(rows)}
      reportingData={getDepartmentReporting()}
      chartConfig={{
        trendTitle: "CT Study Volume",
        trendSubtitle: "Today's CT studies",
        statusTitle: "CT Report Status",
        statusSubtitle: "Processing vs Verified",
        reportingTitle: "CT Reporting Time",
        reportingSubtitle: "Last 7 days",
      }}
      rows={rows}
      onVerify={(row) => console.log("Verify CT Report", row.id)}
      onViewReport={(row) => router.push(`/radiology/reports/${row.id}`)}
      onRefresh={() => console.log("Refresh CT Dashboard")}
      onExport={() => console.log("Export CT Reports")}
    />
  );
}
