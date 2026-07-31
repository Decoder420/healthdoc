"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { getRadiologyModalityDistribution } from "@/components/dashboard/radiology/test_queue/DummyData";

const modalityData = getRadiologyModalityDistribution();

const total = modalityData.reduce(
  (sum, item) => sum + item.value,
  0
);

export default function RadiologyModalityDistribution() {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        transition: "0.25s",

        "&:hover": {
          boxShadow: "0 12px 30px rgba(0,0,0,.06)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2.5}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Modality Distribution
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Imaging studies by modality
            </Typography>
          </Box>

          <Chip
            label="Today"
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 600,
            }}
          />
        </Stack>

        <Divider sx={{ mb: 2.5 }} />

        {/* Donut Chart */}
        <Box
          position="relative"
          height={210}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={modalityData}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={86}
                paddingAngle={3}
                stroke="none"
              >
                {modalityData.map((item) => (
                  <Cell
                    key={item.name}
                    fill={item.color}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value: number) => [
                  `${value} Studies`,
                  "Count",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <Typography
              fontSize={30}
              fontWeight={700}
              color="#001F54"
              lineHeight={1}
            >
              {total}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Studies
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* Legend */}
        <Stack spacing={1.25}>
          {modalityData.map((item) => {
            const percentage = Math.round(
              (item.value / total) * 100
            );

            return (
              <Stack
                key={item.name}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                {/* Left */}
                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: item.color,
                      flexShrink: 0,
                    }}
                  />

                  <Typography
                    variant="body2"
                    fontWeight={500}
                  >
                    {item.name}
                  </Typography>
                </Stack>

                {/* Right */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="#001F54"
                  >
                    {item.value}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      minWidth: 32,
                      textAlign: "right",
                    }}
                  >
                    {percentage}%
                  </Typography>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}