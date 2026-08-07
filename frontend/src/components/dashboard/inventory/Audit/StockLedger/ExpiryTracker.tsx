"use client";

import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Chip,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type {
  ExpiryBucket,
  ExpiryStockItem,
} from "@/features/inventory/types/expiryTracker";

interface Props {
  items: ExpiryStockItem[];
}

type CalculatedExpiryItem = ExpiryStockItem & {
  days_remaining: number;
  bucket: ExpiryBucket;
};

type TabValue = "all" | "30" | "60" | "90" | "expired";

function getDaysRemaining(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const difference =
    expiry.getTime() - today.getTime();

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );
}

function getExpiryBucket(
  daysRemaining: number
): ExpiryBucket {
  if (daysRemaining < 0) {
    return "expired";
  }

  if (daysRemaining <= 30) {
    return "30";
  }

  if (daysRemaining <= 60) {
    return "60";
  }

  if (daysRemaining <= 90) {
    return "90";
  }

  return "safe";
}

function getStatusLabel(bucket: ExpiryBucket) {
  switch (bucket) {
    case "expired":
      return "Expired";

    case "30":
      return "≤ 30 Days";

    case "60":
      return "≤ 60 Days";

    case "90":
      return "≤ 90 Days";

    default:
      return "Safe";
  }
}

function getStatusColor(
  bucket: ExpiryBucket
):
  | "error"
  | "warning"
  | "info"
  | "success"
  | "default" {
  switch (bucket) {
    case "expired":
      return "error";

    case "30":
      return "warning";

    case "60":
      return "warning";

    case "90":
      return "info";

    default:
      return "success";
  }
}

export default function ExpiryTracker({
  items,
}: Props) {
  const [activeTab, setActiveTab] =
    useState<TabValue>("all");

  const calculatedItems = useMemo<
    CalculatedExpiryItem[]
  >(() => {
    return items.map((item) => {
      const daysRemaining = getDaysRemaining(
        item.expiry_date
      );

      return {
        ...item,
        days_remaining: daysRemaining,
        bucket: getExpiryBucket(daysRemaining),
      };
    });
  }, [items]);

  const counts = useMemo(() => {
    return {
      all: calculatedItems.length,

      "30": calculatedItems.filter(
        (item) => item.bucket === "30"
      ).length,

      "60": calculatedItems.filter(
        (item) => item.bucket === "60"
      ).length,

      "90": calculatedItems.filter(
        (item) => item.bucket === "90"
      ).length,

      expired: calculatedItems.filter(
        (item) => item.bucket === "expired"
      ).length,
    };
  }, [calculatedItems]);

  const filteredItems = useMemo(() => {
    if (activeTab === "all") {
      return calculatedItems;
    }

    return calculatedItems.filter(
      (item) => item.bucket === activeTab
    );
  }, [calculatedItems, activeTab]);

  return (
    <Box mt={4}>
      <Box mb={2}>
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Expiry Tracker
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Monitor stock batches approaching expiry.
        </Typography>
      </Box>

      <Paper variant="outlined">
        <Tabs
          value={activeTab}
          onChange={(_, value: TabValue) =>
            setActiveTab(value)
          }
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            value="all"
            label={`All (${counts.all})`}
          />

          <Tab
            value="30"
            label={`30 Days (${counts["30"]})`}
          />

          <Tab
            value="60"
            label={`60 Days (${counts["60"]})`}
          />

          <Tab
            value="90"
            label={`90 Days (${counts["90"]})`}
          />

          <Tab
            value="expired"
            label={`Expired (${counts.expired})`}
          />
        </Tabs>

        {filteredItems.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>
            No stock batches found in this category.
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Batch</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell align="right">
                    Available Qty
                  </TableCell>
                  <TableCell>
                    Days Remaining
                  </TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow
                    key={`${item.item_id}-${item.batch_id}`}
                    hover
                  >
                    <TableCell>
                      <Typography fontWeight={600}>
                        {item.item_name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.item_id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {item.batch_id}
                    </TableCell>

                    <TableCell>
                      {new Date(
                        item.expiry_date
                      ).toLocaleDateString("en-IN")}
                    </TableCell>

                    <TableCell align="right">
                      {item.available_quantity}
                    </TableCell>

                    <TableCell>
                      {item.days_remaining < 0
                        ? `${Math.abs(
                            item.days_remaining
                          )} days ago`
                        : `${item.days_remaining} days`}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={getStatusLabel(
                          item.bucket
                        )}
                        color={getStatusColor(
                          item.bucket
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}