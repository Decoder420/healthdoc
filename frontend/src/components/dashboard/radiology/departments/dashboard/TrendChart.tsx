"use client";

import {
  Paper,
  Stack,
  Typography,
  Chip,
  Box,
} from "@mui/material";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import type {
  TrendChartProps,
} from "./types";


export default function TrendChart({

  title,
  subtitle,
  data,
  color = "#001F54",
  trend,
  total,
  peakLabel,
  action,
  height = 320,

}: TrendChartProps) {


  const gradientId = `${title.replace(/\s+/g, "-")}-gradient`;


  return (

    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        height: "100%",
      }}
    >


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
            {title}
          </Typography>


          {subtitle && (

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {subtitle}
            </Typography>

          )}

        </Box>


        {action}

      </Stack>





      {/* Chart */}

      <Box height={height}>

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart data={data}>


            <defs>

              <linearGradient
                id={gradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor={color}
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor={color}
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>



            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />


            <XAxis
              dataKey="label"
            />


            <YAxis />


            <Tooltip />



            <Area

              type="monotone"

              dataKey="value"

              stroke={color}

              fill={`url(#${gradientId})`}

              strokeWidth={3}

              dot={{
                r:4,
              }}

              activeDot={{
                r:7,
              }}

            />


          </AreaChart>

        </ResponsiveContainer>

      </Box>





      {/* Summary */}

      <Stack
        direction="row"
        spacing={1}
        mt={3}
        flexWrap="wrap"
        useFlexGap
      >


        {trend !== undefined && (

          <Chip

            color="success"

            icon={
              <TrendingUpRoundedIcon />
            }

            label={`${trend}% vs yesterday`}

          />

        )}



        {peakLabel && (

          <Chip

            variant="outlined"

            label={`Peak: ${peakLabel}`}

          />

        )}



        {total !== undefined && (

          <Chip

            variant="outlined"

            label={`Total: ${total}`}

          />

        )}


      </Stack>


    </Paper>

  );

}