"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  ArrowDownCircle,
  ArrowLeftRight,
  ArrowUpCircle,
  ClipboardList,
} from "lucide-react";

interface Props {
  total: number;
  purchases: number;
  issues: number;
  adjustments: number;
  transfers: number;
}

export default function TransactionHistoryStats({
  total,
  purchases,
  issues,
  adjustments,
  transfers,
}: Props) {
  const stats = [
    {
      label: "Total Transactions",
      value: total,
      icon: ClipboardList,
    },
    {
      label: "Purchases",
      value: purchases,
      icon: ArrowDownCircle,
    },
    {
      label: "Issues",
      value: issues,
      icon: ArrowUpCircle,
    },
    {
      label: "Adjustments",
      value: adjustments,
      icon: ClipboardList,
    },
    {
      label: "Transfers",
      value: transfers,
      icon: ArrowLeftRight,
    },
  ];

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        lg: "repeat(5, 1fr)",
      }}
      gap={2}
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.label}
            variant="outlined"
          >
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {stat.label}
                </Typography>

                <Icon size={20} />
              </Box>

              <Typography
                variant="h5"
                fontWeight={700}
              >
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}