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

        p:3,

        borderRadius:4,

        height:"100%",

        display:"flex",

        flexDirection:"column",

      }}

    >



      {/* Header */}

      <Stack

        width="100%"

        direction="row"

        justifyContent="space-between"

        alignItems="flex-start"

        mb={3}

      >


        <Box>


          <Typography

            variant="h6"

            fontWeight={700}

            textAlign="left"

          >

            {title}

          </Typography>



          {subtitle && (

            <Typography

              variant="body2"

              color="text.secondary"

              textAlign="left"

            >

              {subtitle}

            </Typography>

          )}


        </Box>



        {action}



      </Stack>





      {/* Pie Chart */}


      <Box

        sx={{

          height,

          width:"100%",

          display:"flex",

          justifyContent:"center",

          alignItems:"center",

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

              innerRadius={75}

              outerRadius={105}

              paddingAngle={4}

              cx="50%"

              cy="50%"

            >


              {

                data.map((entry,index)=>(

                  <Cell

                    key={entry.name}

                    fill={
                      COLORS[index % COLORS.length]
                    }

                  />

                ))

              }


            </Pie>


            <Tooltip/>


          </PieChart>


        </ResponsiveContainer>


      </Box>







      {/* Total Count */}


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