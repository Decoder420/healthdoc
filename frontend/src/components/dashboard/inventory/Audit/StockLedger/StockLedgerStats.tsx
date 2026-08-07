"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
  Scale,
} from "lucide-react";

interface Props {
  totalTransactions: number;
  totalIn: number;
  totalOut: number;
  adjustments: number;
}

export default function StockLedgerStats({
  totalTransactions,
  totalIn,
  totalOut,
  adjustments,
}: Props) {
  const stats = [
    {
      label: "Total Transactions",
      value: totalTransactions,
      icon: ClipboardList,
    },
    {
      label: "Stock In",
      value: totalIn.toFixed(2),
      icon: ArrowDownToLine,
    },
    {
      label: "Stock Out",
      value: totalOut.toFixed(2),
      icon: ArrowUpFromLine,
    },
    {
      label: "Adjustments",
      value: adjustments,
      icon: Scale,
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
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={0.5}
                  >
                    {stat.label}
                  </Typography>

                  <Typography variant="h5" fontWeight={700}>
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