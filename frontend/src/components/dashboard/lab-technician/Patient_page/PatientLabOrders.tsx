"use client";

import { useMemo, useState } from "react";

import {
  Box,
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
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";

interface Props {
  visits: any[];
}

export default function PatientLabOrders({
  visits,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return visits.filter((visit) => {
      const matchesSearch =
        !keyword ||
        visit.order?.orderId
          ?.toLowerCase()
          .includes(keyword) ||
        visit.visit?.visitId
          ?.toLowerCase()
          .includes(keyword) ||
        visit.doctor?.name
          ?.toLowerCase()
          .includes(keyword) ||
        visit.patient?.name
          ?.toLowerCase()
          .includes(keyword) ||
        visit.patient?.uhid
          ?.toLowerCase()
          .includes(keyword);

      const matchesStatus =
        status === "ALL" ||
        visit.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [visits, search, status]);

  const getStatusColor = (
    value?: string
  ):
    | "success"
    | "warning"
    | "info"
    | "primary"
    | "secondary"
    | "default" => {
    switch (value) {
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
    priority?: string
  ): "error" | "warning" | "default" => {
    switch (priority?.toLowerCase()) {
      case "emergency":
        return "error";

      case "urgent":
        return "warning";

      default:
        return "default";
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("ALL");
  };

  return (
    <Card
      elevation={0}
      className="surface-card"
    >
      <CardContent
        sx={{
          p: 2.5,

          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        {/* ================= HEADER ================= */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={1.5}
          mb={2.5}
        >
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <ScienceRoundedIcon
                sx={{
                  fontSize: 19,
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
                lineHeight={1.2}
              >
                Laboratory Orders
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Patient laboratory investigations
              </Typography>
            </Box>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={500}
          >
            {filteredOrders.length}{" "}
            {filteredOrders.length === 1
              ? "order"
              : "orders"}
          </Typography>
        </Stack>

        {/* ================= FILTER TOOLBAR ================= */}

        <Box
          sx={{
            p: 1.25,
            mb: 2,
            borderRadius: 2,
            bgcolor: "action.hover",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={1.25}
            alignItems={{
              xs: "stretch",
              md: "center",
            }}
          >
            {/* SEARCH */}

            <TextField
              size="small"
              fullWidth
              placeholder="Search patient, UHID, order, visit or doctor..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              sx={{
                maxWidth: {
                  md: 460,
                },

                "& .MuiOutlinedInput-root": {
                  height: 36,
                  bgcolor: "background.paper",
                  borderRadius: 1.5,
                },

                "& .MuiInputBase-input": {
                  py: 0.75,
                  fontSize: 13,
                },

                "& .MuiInputBase-input::placeholder": {
                  fontSize: 13,
                  opacity: 0.7,
                },

                "& .MuiInputAdornment-root": {
                  mr: 0.5,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      sx={{
                        fontSize: 18,
                      }}
                      color="action"
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* STATUS + RESET */}

            <Stack
              direction="row"
              spacing={1}
              justifyContent={{
                xs: "space-between",
                md: "flex-end",
              }}
            >
              <TextField
                select
                size="small"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                sx={{
                  minWidth: 150,

                  "& .MuiOutlinedInput-root": {
                    height: 36,
                    bgcolor: "background.paper",
                    borderRadius: 1.5,
                  },

                  "& .MuiSelect-select": {
                    py: 0.75,
                    fontSize: 13,
                  },
                }}
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

              <Tooltip title="Reset filters">
                <IconButton
                  onClick={resetFilters}
                  size="small"
                  sx={{
                    width: 36,
                    height: 36,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    borderRadius: 1.5,

                    "&:hover": {
                      bgcolor: "action.selected",
                    },
                  }}
                >
                  <RefreshRoundedIcon
                    sx={{
                      fontSize: 18,
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        {/* ================= TABLE ================= */}

        <TableContainer
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflowX: "auto",
          }}
        >
          <Table
            size="small"
            sx={{
              minWidth: 850,

              "& .MuiTableCell-root": {
                borderColor: "divider",
              },
            }}
          >
            {/* ================= TABLE HEADER ================= */}

            <TableHead>
              <TableRow
                sx={{
                  bgcolor: "action.hover",

                  "& .MuiTableCell-root": {
                    py: 1.25,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                  },
                }}
              >
                <TableCell>
                  ORDER
                </TableCell>

                <TableCell>
                  DOCTOR
                </TableCell>

                <TableCell>
                  TESTS
                </TableCell>

                <TableCell>
                  BARCODE
                </TableCell>

                <TableCell>
                  PRIORITY
                </TableCell>

                <TableCell>
                  STATUS
                </TableCell>
              </TableRow>
            </TableHead>

            {/* ================= TABLE BODY ================= */}

            <TableBody>
              {filteredOrders.map((visit) => (
                <TableRow
                  hover
                  key={
                    visit.order?.orderId ??
                    visit.visit?.visitId
                  }
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0,
                    },

                    "& .MuiTableCell-root": {
                      py: 1.4,
                    },
                  }}
                >
                  {/* ORDER */}

                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="primary.main"
                      >
                        {visit.order?.orderId ??
                          "--"}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {visit.visit?.visitId ??
                          "--"}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* DOCTOR */}

                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {visit.doctor?.name ??
                          "--"}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {visit.doctor
                          ?.department ?? "--"}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* TESTS */}

                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      useFlexGap
                      flexWrap="wrap"
                      sx={{
                        maxWidth: 280,
                      }}
                    >
                      {visit.requestedTests
                        ?.length ? (
                        visit.requestedTests.map(
                          (test: string) => (
                            <Chip
                              key={test}
                              label={test}
                              size="small"
                              variant="outlined"
                              sx={{
                                height: 24,
                                borderRadius: 1.25,
                                fontSize: 11,
                                fontWeight: 500,
                              }}
                            />
                          )
                        )
                      ) : (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          No tests
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>

                  {/* BARCODE */}

                  <TableCell>
                    <Typography
                      variant="body2"
                      fontFamily="monospace"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      {visit.sample?.barcode ||
                        "--"}
                    </Typography>
                  </TableCell>

                  {/* PRIORITY */}

                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        visit.order?.priority ??
                        "--"
                      }
                      color={getPriorityColor(
                        visit.order?.priority
                      )}
                      variant={
                        visit.order?.priority
                          ?.toLowerCase() ===
                        "routine"
                          ? "outlined"
                          : "filled"
                      }
                      sx={{
                        height: 25,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  {/* STATUS */}

                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        visit.status ?? "--"
                      }
                      color={getStatusColor(
                        visit.status
                      )}
                      variant="outlined"
                      sx={{
                        height: 25,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}

              {/* ================= EMPTY STATE ================= */}

              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 7,
                    }}
                  >
                    <Stack
                      alignItems="center"
                      spacing={1}
                    >
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "action.hover",
                          color: "text.secondary",
                        }}
                      >
                        <SearchRoundedIcon />
                      </Box>

                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        No laboratory orders found
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Try changing your search or
                        status filter.
                      </Typography>
                    </Stack>
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
