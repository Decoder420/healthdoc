"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { getRadiologyPriorityDistribution } from "@/components/dashboard/radiology/test_queue/DummyData";

const priorityData = getRadiologyPriorityDistribution();

export default function PriorityCasesChart() {
  const totalCases = priorityData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
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
              Priority Cases
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Today's imaging priority distribution
            </Typography>
          </Box>

          <Chip
            icon={<LocalHospitalRoundedIcon />}
            label={`${totalCases} Cases`}
            size="small"
            sx={{
              bgcolor: "action.hover",
              color: "primary.main",
              fontWeight: 700,
            }}
          />
        </Stack>

        {/* Chart */}
        <Box
          sx={{
            height: 260,
            position: "relative",
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="value"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                cornerRadius={8}
                stroke="#fff"
                strokeWidth={3}
              >
                {priorityData.map((item) => (
                  <Cell
                    key={item.name}
                    fill={item.color}
                  />
                ))}
              </Pie>

              {/* Center Text */}
              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: 14,
                  fill: "#64748B",
                  fontWeight: 500,
                }}
              >
                Total
              </text>

              <text
                x="50%"
                y="58%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  fill: "#001F54",
                }}
              >
                {totalCases}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* Legend */}
        <Stack spacing={2}>
          {priorityData.map((item) => (
            <Stack
              key={item.name}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: item.color,
                  }}
                />

                <Typography
                  fontWeight={600}
                  fontSize={14}
                >
                  {item.name}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {item.value}%
                </Typography>

                <Typography
                  fontWeight={700}
                  color="primary.main"
                >
                  {Math.round(
                    (item.value / 100) * totalCases
                  )}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}