"use client";

import { Box, Typography } from "@mui/material";

export default function DashboardHeader() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Box
      className="dashboard-card"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        p: 3,
        width:"100%",
        borderRadius:"0px",
      }}
    >
      {/* Left Content */}
      <Box sx={{
    width: "100vw",
  }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            textAlign: "center", mb: 2 
          }}
        >
          Pathology Dashboard
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontWeight: 600,
            fontSize: "2.3vw",
          }}
        >
          {greeting}, Dr. Sharma 👋
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: "1.2vw",
          }}
        >
          Welcome back! Here&apos;s today&apos;s pathology overview.
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: "1.2vw",
          }}
        >
          {today}
        </Typography>
      </Box>

    </Box>
  );
}