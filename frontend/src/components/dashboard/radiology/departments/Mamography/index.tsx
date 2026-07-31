"use client";

import { useRouter } from "next/navigation";
import DepartmentDashboard from "../dashboard/layout";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import {
  MAMMO_CASES,
  getDepartmentReporting,
  getDepartmentStats,
  getDepartmentStatus,
  getDepartmentTrend,
} from "../departmentCases";

export default function MammographyDashboard() {
  const router = useRouter();
  const rows = MAMMO_CASES;

  return (
    <DepartmentDashboard
      title="Mammography Dashboard"
      subtitle="Today's Mammography Workflow"
      description="Manage mammography studies, verification and reports."
      icon={<FavoriteBorderOutlinedIcon />}
      stats={getDepartmentStats(rows)}
      trendData={getDepartmentTrend(rows)}
      statusData={getDepartmentStatus(rows)}
      reportingData={getDepartmentReporting()}
      chartConfig={{
        trendTitle: "Mammography Study Volume",
        trendSubtitle: "Today's mammography studies",
        statusTitle: "Mammography Report Status",
        statusSubtitle: "Processing vs Verified",
        reportingTitle: "Mammography Reporting Time",
        reportingSubtitle: "Last 7 days",
      }}
      rows={rows}
      onVerify={(row) => console.log("Verify Mammography Report", row.id)}
      onViewReport={(row) => router.push(`/radiology/reports/${row.id}`)}
      onRefresh={() => console.log("Refresh Mammography Dashboard")}
      onExport={() => console.log("Export Mammography Reports")}
    />
  );
}
