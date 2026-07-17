"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

function getGreeting(hour: number) {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatToday(date: Date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DashboardHeader() {
  const [greeting, setGreeting] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    setGreeting(getGreeting(now.getHours()));
    setToday(formatToday(now));
  }, []);

  return (
    <Box
      className="dashboard-card"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        p: 3,
        width: "100%",
        borderRadius: 0,
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "divider",
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
          Welcome back! Here's today's pathology overview.
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