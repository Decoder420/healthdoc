"use client";

import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  ClipboardCheck,
  Eye,
  FilePlus2,
} from "lucide-react";

import type {
  PhysicalVerificationItem,
} from "@/features/inventory/types/physicalVerification";

interface Props {
  items: PhysicalVerificationItem[];

  onStart: (
    verification: PhysicalVerificationItem
  ) => void;

  onView: (
    verification: PhysicalVerificationItem
  ) => void;

  onCreateAdjustment: (
    verification: PhysicalVerificationItem
  ) => void;
}

function getStatusColor(
  status: PhysicalVerificationItem["status"]
) {
  switch (status) {
    case "Pending":
      return "warning";

    case "In Progress":
      return "info";

    case "Completed":
      return "success";

    default:
      return "default";
  }
}

export default function PhysicalVerificationTable({
  items,
  onStart,
  onView,
  onCreateAdjustment,
}: Props) {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Batch</TableCell>
            <TableCell align="right">
              System Qty
            </TableCell>
            <TableCell align="right">
              Physical Qty
            </TableCell>
            <TableCell align="right">
              Variance
            </TableCell>
            <TableCell>Result</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                align="center"
              >
                <Typography
                  color="text.secondary"
                  py={4}
                >
                  No physical verifications found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow
                key={item.id}
                hover
              >
                <TableCell>
                  <Typography fontWeight={600}>
                    {item.id}
                  </Typography>
                </TableCell>

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
                  {item.batch_id ?? "—"}
                </TableCell>

                <TableCell align="right">
                  {item.system_quantity}
                </TableCell>

                <TableCell align="right">
                  {item.physical_quantity ?? "—"}
                </TableCell>

                <TableCell align="right">
                  {item.variance === null ||
                  item.variance === undefined ? (
                    "—"
                  ) : (
                    <Typography
                      fontWeight={700}
                      color={
                        item.variance < 0
                          ? "error.main"
                          : item.variance > 0
                          ? "success.main"
                          : "text.primary"
                      }
                    >
                      {item.variance > 0
                        ? "+"
                        : ""}
                      {item.variance}
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  {item.result ? (
                    <Chip
                      size="small"
                      label={item.result}
                      color={
                        item.result === "Matched"
                          ? "success"
                          : "warning"
                      }
                    />
                  ) : (
                    "—"
                  )}
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={item.status}
                    color={getStatusColor(
                      item.status
                    )}
                    variant="outlined"
                  />
                </TableCell>

                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={
                      <Eye size={16} />
                    }
                    onClick={() =>
                      onView(item)
                    }
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>

                  {item.status === "Pending" && (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={
                        <ClipboardCheck
                          size={16}
                        />
                      }
                      onClick={() =>
                        onStart(item)
                      }
                    >
                      Verify
                    </Button>
                  )}

                  {item.status === "Completed" &&
                    item.result ===
                      "Variance Found" && (
                      <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        startIcon={
                          <FilePlus2
                            size={16}
                          />
                        }
                        onClick={() =>
                          onCreateAdjustment(item)
                        }
                      >
                        Create Adjustment
                      </Button>
                    )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}