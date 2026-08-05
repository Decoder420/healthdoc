"use client";

import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { modalityCards } from "./dummyData";

export default function ModalityCards() {
  return (
    <>
      <Typography
        variant="h6"
        fontWeight={600}
        mb={3}
      >
        Modality Performance
      </Typography>

      <Grid container spacing={3}>
        {modalityCards.map((item) => {
          const progress =
            item.total === 0
              ? 0
              : Math.round(
                  (item.completed / item.total) * 100
                );

          return (
            <Grid
              key={item.id}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 2,
              }}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",

                  transition: "0.25s",

                  "&:hover": {
                    transform:
                      "translateY(-4px)",
                    boxShadow:
                      "0 12px 24px rgba(0,0,0,.08)",
                  },
                }}
              >

                <CardContent
                  sx={{
                    p: 3,
                  }}
                >

                  {/* Header */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >

                    <Typography
                      fontWeight={700}
                      fontSize={18}
                    >
                      {item.modality}
                    </Typography>


                    {item.icon && (
                      <Box
                        sx={{
                          width:48,
                          height:48,
                          borderRadius:2,
                          bgcolor:"#F4F7FC",
                          display:"flex",
                          alignItems:"center",
                          justifyContent:"center",

                          "& svg":{
                            fontSize:26,
                            color:"#001F54",
                          },
                        }}
                      >
                        {item.icon}
                      </Box>
                    )}

                  </Stack>



                  {/* Total */}
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="primary"
                  >
                    {item.total}
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={3}
                  >
                    Total Studies
                  </Typography>



                  {/* Completed */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={1}
                  >

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Completed
                    </Typography>


                    <Typography fontWeight={600}>
                      {item.completed}
                    </Typography>

                  </Stack>



                  {/* Pending */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={2}
                  >

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Pending
                    </Typography>


                    <Typography fontWeight={600}>
                      {item.pending}
                    </Typography>

                  </Stack>



                  {/* Progress */}
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height:8,
                      borderRadius:10,
                      mb:1,

                      "& .MuiLinearProgress-bar":{
                        backgroundColor:"#001F54",
                        borderRadius:10,
                      },
                    }}
                  />



                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {progress}% Complete
                    </Typography>


                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Avg {item.averageTime}
                    </Typography>

                  </Stack>


                </CardContent>

              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}