"use client";

import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

import DashboardHeader from "./header";
import KPISection from "./KPIcards";
import ImagingTrendChart from "./ImagingTrendChart";
import ModalityPieChart from "./ModaltyPieChart";
import MachineUtilizationChart from "./MachineUtilizationChart";
import AppointmentQueueTable from "./AppointmentQueueTable";
import ModalityCards from "./ModaltyCards";
import WorkflowOverview from "./WorkflowOverflow";
import QuickActions from "./QuickActions";
import PriorityCasesChart from "./Priority_Chart";

export default function RadiologyDashboardPage() {
  return (
    <Box>
      {/* Header */}
      <DashboardHeader />

      {/* KPI Cards */}
      <Box mt={3}>
        <KPISection />
      </Box>

       {/* Quick Actions */}
      <Box mt={3}>
        <QuickActions />
      </Box> 

       {/* Workflow */}
      <Box mt={3}>
        <WorkflowOverview />
      </Box>

       {/* Modality Performance */}
      <Box mt={3}>
        <ModalityCards />
      </Box>


    {/* Charts */}
<Box mt={3}>
  <Grid container spacing={3}>
    <Grid size={{ xs: 12, lg: 6 }}>
      <ImagingTrendChart />
    </Grid>

    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
      <ModalityPieChart />
    </Grid>

    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
      <PriorityCasesChart />
    </Grid>
  </Grid>
</Box>

      {/* Machine Utilization */}
      <Box mt={3}>
        <MachineUtilizationChart />
      </Box>

      {/* Appointment Queue */}
      <Box mt={3}>
        <AppointmentQueueTable />
      </Box>


    </Box>
  );
}