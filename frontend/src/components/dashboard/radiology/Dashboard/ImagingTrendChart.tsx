"use client";

import { useMemo, useState } from "react";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { getRadiologyImagingTrend } from "@/components/dashboard/radiology/test_queue/DummyData";

const { todayData, weekData, monthData } = getRadiologyImagingTrend();

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: 2,
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        minWidth: 150,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        mt={0.5}
        fontWeight={700}
        fontSize={20}
        color="#001F54"
      >
        {payload[0].value}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        Imaging Studies
      </Typography>
    </Box>
  );
}

export default function RadiologyImagingVolume() {
  const [range, setRange] = useState("today");

  const chartData = useMemo(() => {
    switch (range) {
      case "week":
        return weekData;

      case "month":
        return monthData;

      default:
        return todayData;
    }
  }, [range]);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 5,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: ".3s",
        height: "100%",

        "&:hover": {
          boxShadow: "0 18px 40px rgba(0,0,0,.08)",
        },
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
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Imaging Volume
              </Typography>

              <Chip
                icon={<TrendingUpRoundedIcon />}
                label="+12.4%"
                size="small"
                sx={{
                  bgcolor: "#E8F5E9",
                  color: "#2E7D32",
                  fontWeight: 700,
                }}
              />
            </Stack>

            <Typography
              mt={0.6}
              variant="body2"
              color="text.secondary"
            >
              Monitor completed imaging studies throughout the day
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <TextField
              size="small"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              sx={{ width: 130 }}
              select
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </TextField>

            <IconButton>
              <CalendarMonthRoundedIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Chart */}

        <Box height={340}>
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="scanGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#001F54"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="100%"
                    stopColor="#001F54"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E8EDF4"
              />

              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                }}
              />

              <Tooltip
                cursor={{
                  stroke: "#001F54",
                  strokeDasharray: "5 5",
                }}
                content={<CustomTooltip />}
              />

              <Area
                type="monotone"
                dataKey="scans"
                stroke="#001F54"
                strokeWidth={3}
                fill="url(#scanGradient)"
                activeDot={{
                  r: 7,
                  fill: "#001F54",
                  stroke: "#fff",
                  strokeWidth: 3,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Analytics Cards - Part 2 */}
      </CardContent>
    </Card>
  );
}
<Stack spacing={2}>
  {/* Row 1 */}
  <Stack
    direction={{ xs: "column", md: "row" }}
    spacing={2}
  >
    {/* Total Studies */}
    <Box
      flex={1}
      sx={{
        p: 2.5,
        borderRadius: 4,
        bgcolor: "#F8FAFC",
        border: "1px solid",
        borderColor: "divider",
        transition: ".25s",

        "&:hover": {
          bgcolor: "#F1F5F9",
        },
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
      >
        Total Studies
      </Typography>

      <Typography
        mt={1}
        variant="h4"
        fontWeight={700}
      >
        286
      </Typography>

      <Typography
        mt={0.5}
        variant="body2"
        color="success.main"
        fontWeight={600}
      >
        +18 Today
      </Typography>
    </Box>

    {/* Peak Hour */}

    <Box
      flex={1}
      sx={{
        p: 2.5,
        borderRadius: 4,
        bgcolor: "#F8FAFC",
        border: "1px solid",
        borderColor: "divider",

        "&:hover": {
          bgcolor: "#F1F5F9",
        },
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
      >
        Peak Hour
      </Typography>

      <Typography
        mt={1}
        variant="h4"
        fontWeight={700}
      >
        2 PM
      </Typography>

      <Typography
        mt={0.5}
        variant="body2"
        color="text.secondary"
      >
        39 Studies
      </Typography>
    </Box>
  </Stack>

  {/* Row 2 */}

  <Stack
    direction={{ xs: "column", md: "row" }}
    spacing={2}
  >
    {/* Average */}

    <Box
      flex={1}
      sx={{
        p: 2.5,
        borderRadius: 4,
        bgcolor: "#F8FAFC",
        border: "1px solid",
        borderColor: "divider",

        "&:hover": {
          bgcolor: "#F1F5F9",
        },
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
      >
        Average / Hour
      </Typography>

      <Typography
        mt={1}
        variant="h4"
        fontWeight={700}
      >
        29
      </Typography>

      <Typography
        mt={0.5}
        variant="body2"
        color="text.secondary"
      >
        Imaging Studies
      </Typography>
    </Box>

    {/* Growth */}

    <Box
      flex={1}
      sx={{
        p: 2.5,
        borderRadius: 4,
        bgcolor: "#F8FAFC",
        border: "1px solid",
        borderColor: "divider",

        "&:hover": {
          bgcolor: "#F1F5F9",
        },
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
      >
        Growth
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        mt={1}
      >
        <TrendingUpRoundedIcon
          sx={{
            color: "#2E7D32",
            fontSize: 32,
          }}
        />

        <Typography
          variant="h4"
          fontWeight={700}
          color="success.main"
        >
          +12%
        </Typography>
      </Stack>

      <Typography
        mt={0.5}
        variant="body2"
        color="text.secondary"
      >
        Compared to Yesterday
      </Typography>
    </Box>
  </Stack>

  {/* Footer */}

  <Box
    sx={{
      mt: 1,
      p: 2,
      borderRadius: 3,
      bgcolor: "#EEF5FF",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "1px solid #D8E8FF",
    }}
  >
    <Box>
      <Typography
        fontWeight={600}
      >
        Department Performance
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        Imaging volume is 12% higher than yesterday.
      </Typography>
    </Box>

    <Chip
      label="Excellent"
      sx={{
        bgcolor: "#E8F5E9",
        color: "#2E7D32",
        fontWeight: 700,
      }}
    />
  </Box>
</Stack>