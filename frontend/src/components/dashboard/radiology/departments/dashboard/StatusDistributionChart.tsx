"use client";

import {
  Paper,
  Stack,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type {
  StatusDistributionChartProps,
} from "./types";


const COLORS = [
  "#001F54",
  "#2563EB",
  "#0EA5E9",
  "#14B8A6",
  "#10B981",
  "#6366F1",
];


export default function StatusDistributionChart({

  title,
  subtitle,
  data,
  total,
  action,
  height = 220,

}: StatusDistributionChartProps) {


  return (

    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >


      {/* Header */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
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

      <Box
        sx={{
          height,
          width: "100%",
        }}
      >

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie

              data={data}

              dataKey="value"

              nameKey="name"

              innerRadius={70}

              outerRadius={100}

              paddingAngle={3}

            >

              {
                data.map((entry,index)=>(

                  <Cell
                    key={entry.name}
                    fill={
                      entry.color ??
                      COLORS[index % COLORS.length]
                    }
                  />

                ))
              }

            </Pie>


            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </Box>





      {/* Total */}

      {
        total !== undefined && (

          <Typography
            variant="h5"
            fontWeight={700}
            textAlign="center"
            mt={1}
          >
            {total}
          </Typography>

        )
      }





      {/* Legend */}

      <Stack
        direction="row"
        spacing={1}
        mt={3}
        justifyContent="center"
        flexWrap="wrap"
        useFlexGap
      >

        {
          data.map((item,index)=>(

            <Chip

              key={item.name}

              label={`${item.name} • ${item.value}`}

              sx={{

                "& .MuiChip-label":{
                  fontWeight:600,
                },

                borderLeft:
                  `4px solid ${
                    item.color ??
                    COLORS[index % COLORS.length]
                  }`,

              }}

            />

          ))
        }

      </Stack>


    </Paper>

  );

}