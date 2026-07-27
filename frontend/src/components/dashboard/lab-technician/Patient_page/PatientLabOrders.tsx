"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";

interface Props {
  visits: any[];
}

export default function PatientLabOrders({
  visits,
}: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const filteredOrders = useMemo(() => {
    return visits.filter((visit) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        visit.order.orderId
          .toLowerCase()
          .includes(keyword) ||
        visit.visit.visitId
          .toLowerCase()
          .includes(keyword) ||
        visit.doctor.name
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        status === "ALL" ||
        visit.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [visits, search, status]);

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "VERIFIED":
        return "success";

      case "READY":
        return "primary";

      case "PROCESSING":
        return "warning";

      case "COLLECTED":
        return "secondary";

      case "QUEUE":
        return "info";

      default:
        return "default";
    }
  };

  const getPriorityColor = (
    priority: string
  ) => {
    switch (priority.toLowerCase()) {
      case "emergency":
        return "error";

      case "urgent":
        return "warning";

      default:
        return "default";
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
      }}
    >
      <CardContent>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          mb={3}
        >
          <ScienceRoundedIcon color="primary" />

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Laboratory Orders
          </Typography>
        </Stack>

        {/* Toolbar */}

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
          justifyContent="space-between"
          mb={3}
        >
          <TextField
            size="small"
            placeholder="Search Order / Visit / Doctor"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            sx={{
              width: {
                xs: "100%",
                md: 380,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              select
              size="small"
              value={status}
              sx={{ width: 180 }}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <MenuItem value="ALL">
                All Status
              </MenuItem>

              <MenuItem value="QUEUE">
                Queue
              </MenuItem>

              <MenuItem value="COLLECTED">
                Collected
              </MenuItem>

              <MenuItem value="PROCESSING">
                Processing
              </MenuItem>

              <MenuItem value="READY">
                Ready
              </MenuItem>

              <MenuItem value="VERIFIED">
                Verified
              </MenuItem>
            </TextField>

            <Tooltip title="Reset">
              <IconButton
                onClick={() => {
                  setSearch("");
                  setStatus("ALL");
                }}
              >
                <RefreshRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Table */}

        <TableContainer>

          <Table>

            <TableHead>
              <TableRow>

                <TableCell>
                  <strong>Order</strong>
                </TableCell>

                <TableCell>
                  <strong>Doctor</strong>
                </TableCell>

                <TableCell>
                  <strong>Tests</strong>
                </TableCell>

                <TableCell>
                  <strong>Barcode</strong>
                </TableCell>

                <TableCell>
                  <strong>Priority</strong>
                </TableCell>

                <TableCell>
                  <strong>Status</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>Action</strong>
                </TableCell>

              </TableRow>
            </TableHead>

            <TableBody>

              {filteredOrders.map((visit) => (

                <TableRow
                  hover
                  key={visit.order.orderId}
                >

                  <TableCell>

                    <Typography
                      fontWeight={700}
                    >
                      {visit.order.orderId}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {visit.visit.visitId}
                    </Typography>

                  </TableCell>

                  <TableCell>

                    <Typography
                      fontWeight={600}
                    >
                      {visit.doctor.name}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {visit.doctor.department}
                    </Typography>

                  </TableCell>

                  <TableCell>

                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      flexWrap="wrap"
                    >
                      {visit.requestedTests.map(
                        (test: string) => (
                          <Chip
                            key={test}
                            label={test}
                            size="small"
                            variant="outlined"
                          />
                        )
                      )}
                    </Stack>

                  </TableCell>

                  <TableCell>

                    <Typography
                      fontFamily="monospace"
                      fontWeight={600}
                    >
                      {visit.sample.barcode ||
                        "--"}
                    </Typography>

                  </TableCell>

                  <TableCell>

                    <Chip
                      size="small"
                      label={
                        visit.order.priority
                      }
                      color={
                        getPriorityColor(
                          visit.order.priority
                        ) as any
                      }
                    />

                  </TableCell>

                  <TableCell>

                    <Chip
                      size="small"
                      label={visit.status}
                      color={
                        getStatusColor(
                          visit.status
                        ) as any
                      }
                    />

                  </TableCell>

                  <TableCell align="center">

                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={
                        <VisibilityRoundedIcon />
                      }
                      onClick={() =>
                        router.push(
                          `/dashboard/pathology/visit/${visit.visit.visitId}`
                        )
                      }
                    >
                      View
                    </Button>

                  </TableCell>

                </TableRow>

              ))}

              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <Typography color="text.secondary">
                      No laboratory orders found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

            </TableBody>

          </Table>

        </TableContainer>

      </CardContent>
    </Card>
  );
}