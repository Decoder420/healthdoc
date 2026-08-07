"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import {
  ClipboardCheck,
  Clock3,
  CircleCheck,
  TriangleAlert,
} from "lucide-react";

interface Props {
  total: number;
  pending: number;
  completed: number;
  variances: number;
}

export default function PhysicalVerificationStats({
  total,
  pending,
  completed,
  variances,
}: Props) {
  const stats = [
    {
      label: "Total Verifications",
      value: total,
      icon: ClipboardCheck,
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
    },
    {
      label: "Completed",
      value: completed,
      icon: CircleCheck,
    },
    {
      label: "Variances",
      value: variances,
      icon: TriangleAlert,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2,
        mb: 3,
      }}
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} variant="outlined">
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {stat.label}
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={700}
                    mt={0.5}
                  >
                    {stat.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "action.hover",
                  }}
                >
                  <Icon size={20} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}