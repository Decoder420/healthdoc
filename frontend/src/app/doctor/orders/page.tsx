"use client";

import Box from "@mui/material/Box";

import { OrdersWorkspace } from "@/features/doctor";
import { doctorPageSx } from "@/features/doctor/panelSx";
import { useEncounterContext } from "@/features/doctor/hooks/useEncounterContext";

export default function Page() {
  const { context, loading } = useEncounterContext();

  // No fallback patient. mockEncounterContext used to supply the visit_id and
  // patient_id that orders and prescriptions are FILED AGAINST, not just the
  // name in the header — so a wrong one attaches clinical writes to the wrong
  // visit. If no token is in service there is no consultation to chart.
  if (loading) return null;
  if (!context) {
    return (
      <Box sx={doctorPageSx}>
        <p>
          No patient is currently in service. Call a token from your queue to
          begin a consultation.
        </p>
      </Box>
    );
  }

  return (
    <Box sx={doctorPageSx}>
      <OrdersWorkspace context={context} />
    </Box>
  );
}
