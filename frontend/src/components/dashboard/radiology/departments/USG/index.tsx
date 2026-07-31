"use client";

import { useRouter } from "next/navigation";
import DepartmentDashboard from "../dashboard/layout";
import GraphicEqOutlinedIcon from "@mui/icons-material/GraphicEqOutlined";
import {
  USG_CASES,
  getDepartmentReporting,
  getDepartmentStats,
  getDepartmentStatus,
  getDepartmentTrend,
} from "../departmentCases";

export default function USGDashboard() {
  const router = useRouter();
  const rows = USG_CASES;

  return (
    <DepartmentDashboard
      title="USG Dashboard"
      subtitle="Today's Ultrasound Workflow"
      description="Manage ultrasound studies, verification and reports."
      icon={<GraphicEqOutlinedIcon />}
      stats={getDepartmentStats(rows)}
      trendData={getDepartmentTrend(rows)}
      statusData={getDepartmentStatus(rows)}
      reportingData={getDepartmentReporting()}
      chartConfig={{
        trendTitle: "USG Study Volume",
        trendSubtitle: "Today's ultrasound studies",
        statusTitle: "USG Report Status",
        statusSubtitle: "Processing vs Verified",
        reportingTitle: "USG Reporting Time",
        reportingSubtitle: "Last 7 days",
      }}
      rows={rows}
      onVerify={(row) => console.log("Verify USG Report", row.id)}
      onViewReport={(row) => router.push(`/radiology/reports/${row.id}`)}
      onRefresh={() => console.log("Refresh USG Dashboard")}
      onExport={() => console.log("Export USG Reports")}
    />
  );
}
