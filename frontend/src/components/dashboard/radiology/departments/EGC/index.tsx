"use client";

import { useRouter } from "next/navigation";
import DepartmentDashboard from "../dashboard/layout";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import {
  ECG_CASES,
  getDepartmentReporting,
  getDepartmentStats,
  getDepartmentStatus,
  getDepartmentTrend,
} from "../departmentCases";

export default function ECGDashboard() {
  const router = useRouter();
  const rows = ECG_CASES;

  return (
    <DepartmentDashboard
      title="ECG Dashboard"
      subtitle="Today's ECG Workflow"
      description="Manage ECG studies, verification and reports."
      icon={<MonitorHeartOutlinedIcon />}
      stats={getDepartmentStats(rows)}
      trendData={getDepartmentTrend(rows)}
      statusData={getDepartmentStatus(rows)}
      reportingData={getDepartmentReporting()}
      chartConfig={{
        trendTitle: "ECG Study Volume",
        trendSubtitle: "Today's ECG studies",
        statusTitle: "ECG Report Status",
        statusSubtitle: "Processing vs Verified",
        reportingTitle: "ECG Reporting Time",
        reportingSubtitle: "Last 7 days",
      }}
      rows={rows}
      onVerify={(row) => console.log("Verify ECG Report", row.id)}
      onViewReport={(row) => router.push(`/radiology/reports/${row.id}`)}
      onRefresh={() => console.log("Refresh ECG Dashboard")}
      onExport={() => console.log("Export ECG Reports")}
    />
  );
}
