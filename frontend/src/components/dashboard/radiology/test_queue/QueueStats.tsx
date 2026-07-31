"use client";

import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { getRadiologyQueueStats } from "./DummyData";

export default function QueueStats() {
  const statsData = getRadiologyQueueStats();
  const avgWait = `${10 + (statsData.inQueue % 8)} min`;

  const stats = [
    {
      id: 1,
      title: "Patients in Queue",
      value: statsData.inQueue,
      subtitle: "Waiting for imaging",
      trend: `+${Math.max(3, statsData.inQueue % 9)} Today`,
      icon: <PeopleAltRoundedIcon color="primary" />,
    },
    {
      id: 2,
      title: "Emergency",
      value: statsData.emergency,
      subtitle: "High priority cases",
      trend: "Immediate",
      icon: <WarningAmberRoundedIcon color="error" />,
    },
    {
      id: 3,
      title: "In Progress",
      value: statsData.inProgress,
      subtitle: "Scans running",
      trend: "Live",
      icon: <PlayCircleRoundedIcon color="warning" />,
    },
    {
      id: 4,
      title: "Completed",
      value: statsData.completed,
      subtitle: "Completed / verified",
      trend: "+12%",
      icon: <CheckCircleRoundedIcon color="success" />,
    },
    {
      id: 5,
      title: "Avg Waiting",
      value: avgWait,
      subtitle: "Current average",
      trend: "-3 min",
      icon: <ScheduleRoundedIcon color="info" />,
    },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((item) => (
        <Grid
          key={item.id}
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              transition: "all .25s ease",

              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 2,
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 3,
                    bgcolor: "action.hover",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>

                <Chip
                  icon={<TrendingUpRoundedIcon sx={{ fontSize: 16 }} />}
                  label={item.trend}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                  }}
                />
              </Stack>

              <Typography variant="h4" fontWeight={700} mt={3}>
                {item.value}
              </Typography>

              <Typography fontWeight={600} mt={0.8}>
                {item.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {item.subtitle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
