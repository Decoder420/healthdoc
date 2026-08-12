"use client";

import { useMemo } from "react";

import {
  Box,
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

import {
  getRadiologyModalityDistribution,
} from "@/components/dashboard/radiology/test_queue/DummyData";

export default function RadiologyModalityDistribution() {
  const modalityData = useMemo(
    () => getRadiologyModalityDistribution(),
    []
  );

  const total = useMemo(
    () =>
      modalityData.reduce(
        (sum, item) => sum + item.value,
        0
      ),
    [modalityData]
  );

  return (
    <div className="surface-card h-full p-6">
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

      <Divider
        sx={{
          mb: 2.5,
        }}
      />

      {/* Donut */}
      <Box
        position="relative"
        height={220}
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
              innerRadius={60}
              outerRadius={88}
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

        {/* Center */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform:
              "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <Typography
            fontSize={30}
            fontWeight={700}
            color="#001F54"
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

      <Divider
        sx={{
          my: 2.5,
        }}
      />

      {/* Legend */}
      <Stack spacing={1.5}>
        {modalityData.map((item) => {
          const percentage =
            total === 0
              ? 0
              : Math.round(
                  (item.value / total) * 100
                );

          return (
            <Stack
              key={item.name}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
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
                  }}
                />

                <Typography
                  variant="body2"
                  fontWeight={500}
                >
                  {item.name}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Typography
                  fontWeight={700}
                  color="#001F54"
                >
                  {item.value}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    minWidth: 35,
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
    </div>
  );
}