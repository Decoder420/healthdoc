import DashboardHeader from "./LabDashboardHeader";
import DashboardCards from "./LabDashboardCards";
import DashboardCharts from "./LabDashboardCharts";

export default function PathologyDashboard() {
  return (
  <div className="container-fluid p-0 d-flex flex-column bg-background text-foreground"
  style={{ minHeight: "100vh" }}
>
  <DashboardHeader />
  <DashboardCards />
   <DashboardCharts/>
</div>
  );
}