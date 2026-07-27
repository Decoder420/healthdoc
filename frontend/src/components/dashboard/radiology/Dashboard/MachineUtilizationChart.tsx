"use client";

import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

const machineData = [
  {
    id: 1,
    machine: "CT Scanner 01",
    studies: 48,
    utilization: 92,
    status: "Busy",
    next: "03:20 PM",
  },
  {
    id: 2,
    machine: "MRI Scanner",
    studies: 27,
    utilization: 76,
    status: "Busy",
    next: "03:45 PM",
  },
  {
    id: 3,
    machine: "X-Ray Room A",
    studies: 81,
    utilization: 58,
    status: "Available",
    next: "Now",
  },
  {
    id: 4,
    machine: "Ultrasound",
    studies: 36,
    utilization: 68,
    status: "Busy",
    next: "03:15 PM",
  },
  {
    id: 5,
    machine: "Mammography",
    studies: 0,
    utilization: 0,
    status: "Maintenance",
    next: "04:30 PM",
  },
];

function statusColor(status: string) {
  switch (status) {
    case "Available":
      return "#16A34A";

    case "Busy":
      return "#F59E0B";

    case "Maintenance":
      return "#EF4444";

    default:
      return "#64748B";
  }
}

function progressColor(value: number) {
  if (value >= 90) return "#DC2626";
  if (value >= 70) return "#F59E0B";
  return "#16A34A";
}

export default function RadiologyMachineUtilization() {
  const totalMachines = machineData.length;

  const available = machineData.filter(
    (m) => m.status === "Available"
  ).length;

  const busy = machineData.filter(
    (m) => m.status === "Busy"
  ).length;

  const maintenance = machineData.filter(
    (m) => m.status === "Maintenance"
  ).length;

  const avgUtilization = Math.round(
    machineData.reduce(
      (sum, item) => sum + item.utilization,
      0
    ) / totalMachines
  );

  return (
<Card
  elevation={0}
  sx={{
    borderRadius: 4,
    border: "1px solid",
    borderColor: "divider",
    height: "100%",
  }}
>
  <CardContent sx={{ p: 3 }}>
    {/* Header */}
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
    >
      <Box>
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Machine Utilization
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Live equipment usage
        </Typography>
      </Box>

      <Chip
        icon={<TrendingUpRoundedIcon sx={{ fontSize: 18 }} />}
        label={`${avgUtilization}% Avg`}
        size="small"
        sx={{
          bgcolor: "#EEF4FF",
          color: "#001F54",
          fontWeight: 700,
        }}
      />
    </Stack>

    <Stack spacing={2.5}>
      {machineData.map((item) => (
        <Box key={item.id}>
          {/* Top */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Stack spacing={0.3}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <CircleRoundedIcon
                  sx={{
                    fontSize: 10,
                    color: statusColor(item.status),
                  }}
                />

                <Typography
                  fontWeight={600}
                  fontSize={14}
                >
                  {item.machine}
                </Typography>
              </Stack>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {item.studies} Studies • Next: {item.next}
              </Typography>
            </Stack>

            <Typography
              fontWeight={700}
              color="#001F54"
            >
              {item.utilization}%
            </Typography>
          </Stack>

          {/* Progress */}
          <LinearProgress
            variant="determinate"
            value={item.utilization}
            sx={{
              height: 8,
              borderRadius: 10,
              bgcolor: "#EEF2F7",

             "& .MuiLinearProgress-bar": {
  borderRadius: 10,
  backgroundColor: "#001F54",
},
            }}
          />
        </Box>
      ))}
    </Stack>

    <Divider sx={{ my: 3 }} />

    {/* Footer */}
    <Stack
      direction="row"
      justifyContent="space-between"
    >
      <Stack alignItems="center">
        <Typography
          fontWeight={700}
          color="#16A34A"
        >
          {available}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          Available
        </Typography>
      </Stack>

      <Stack alignItems="center">
        <Typography
          fontWeight={700}
          color="#F59E0B"
        >
          {busy}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          Busy
        </Typography>
      </Stack>

      <Stack alignItems="center">
        <Typography
          fontWeight={700}
          color="#EF4444"
        >
          {maintenance}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          Maintenance
        </Typography>
      </Stack>
    </Stack>
  </CardContent>
</Card>
  );
}