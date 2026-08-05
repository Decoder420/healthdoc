"use client";

import {
  Paper,
  Stack,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import type {
  ReportingTimeChartProps,
} from "./types";


export default function ReportingTimeChart({

  title,
  subtitle,
  data,
  average,
  target,
  action,
  height = 300,

}: ReportingTimeChartProps) {


  return (

    <Paper
      elevation={0}
      sx={{
        p:3,
        borderRadius:4,
        height:"100%",
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

          <BarChart data={data}>


            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />


            <XAxis
              dataKey="day"
            />


            <YAxis
              unit=" min"
              allowDecimals={false}
            />



            <Tooltip
              formatter={(value) => [
                `${value} min`,
                "Reporting Time",
              ]}
            />



            <Bar
              dataKey="minutes"
              radius={[8,8,0,0]}
            >

              {
                data.map((item,index)=>(

                  <Cell
                    key={`${item.day}-${index}`}
                    fill="#001F54"
                  />

                ))
              }

            </Bar>


          </BarChart>

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


        {
          average !== undefined && (

            <Chip

              icon={
                <TimerOutlinedIcon />
              }

              color="primary"

              label={`Average : ${average} min`}

            />

          )
        }



        {
          target !== undefined && (

            <Chip

              variant="outlined"

              label={`Target : ${target} min`}

            />

          )
        }


      </Stack>


    </Paper>

  );

}