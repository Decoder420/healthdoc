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
import RadiologyIcon from "@mui/icons-material/LocalHospitalRounded";

import type {
  RadiologyQueueItem,
  RadiologyQueueStatus,
} from "@/components/dashboard/radiology/test_queue/DummyData";

interface Props {
  studies: RadiologyQueueItem[];
}

export default function PatientRadiologyOrders({
  studies,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "ALL" | RadiologyQueueStatus
  >("ALL");

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return studies.filter((study) => {
      const matchesSearch =
        !keyword ||
        study.patientName?.toLowerCase().includes(keyword) ||
        study.uhid?.toLowerCase().includes(keyword) ||
        study.accessionNumber
          ?.toLowerCase()
          .includes(keyword) ||
        study.orderId?.toLowerCase().includes(keyword) ||
        study.patientId?.toLowerCase().includes(keyword) ||
        study.procedure?.toLowerCase().includes(keyword) ||
        study.modality?.toLowerCase().includes(keyword) ||
        study.radiologist?.toLowerCase().includes(keyword);

      const matchesStatus =
        status === "ALL" || study.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [studies, search, status]);

  const getStatusColor = (
    value: RadiologyQueueStatus
  ):
    | "success"
    | "warning"
    | "info"
    | "error"
    | "default" => {
    switch (value) {
      case "Verified":
        return "success";

      case "Processing":
        return "warning";

      case "Queue":
        return "info";

      case "No Show":
        return "error";

      case "Removed":
        return "default";

      default:
        return "default";
    }
  };

  const getPriorityColor = (
    priority: RadiologyQueueItem["priority"]
  ): "error" | "warning" | "default" => {
    switch (priority) {
      case "Emergency":
        return "error";

      case "Urgent":
        return "warning";

      case "Routine":
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
  sx={{
    borderColor: "divider",
    overflow: "hidden",
  }}
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
              <RadiologyIcon sx={{ fontSize: 19 }} />
            </Box>

            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
                lineHeight={1.2}
              >
                Radiology Studies
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Patient imaging investigations
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
              ? "study"
              : "studies"}
          </Typography>
        </Stack>

        {/* ================= FILTER TOOLBAR ================= */}

        <Box
          sx={{
            p: 1.25,
            mb: 2,
            borderRadius: 2,
            bgcolor: "action.hover",
            border: "1px solid",
            borderColor: "divider",
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
            {/* Search */}

            <TextField
              size="small"
              fullWidth
              placeholder="Search patient, UHID, accession, study..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                maxWidth: {
                  md: 500,
                },
                "& .MuiOutlinedInput-root": {
                  height: 34,
                  bgcolor: "background.paper",
                },
                "& .MuiInputBase-input": {
                  py: 0,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      fontSize="small"
                      color="action"
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* Status + Reset */}

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
                onChange={(e) =>
                  setStatus(
                    e.target.value as
                      | "ALL"
                      | RadiologyQueueStatus
                  )
                }
                sx={{
                  minWidth: 160,
                  "& .MuiOutlinedInput-root": {
                    height: 34,
                    bgcolor: "background.paper",
                  },
                  "& .MuiSelect-select": {
                    py: 0.5,
                  },
                }}
              >
                <MenuItem value="ALL">
                  All Status
                </MenuItem>

                <MenuItem value="Queue">
                  Queue
                </MenuItem>

                <MenuItem value="Processing">
                  Processing
                </MenuItem>

                <MenuItem value="Verified">
                  Verified
                </MenuItem>

                <MenuItem value="No Show">
                  No Show
                </MenuItem>

                <MenuItem value="Removed">
                  Removed
                </MenuItem>
              </TextField>

              <Tooltip title="Reset filters">
                <IconButton
                  onClick={resetFilters}
                  size="small"
                  sx={{
                    width: 34,
                    height: 34,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    "&:hover": {
                      bgcolor: "action.selected",
                    },
                  }}
                >
                  <RefreshRoundedIcon fontSize="small" />
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
              minWidth: 950,

              "& .MuiTableCell-root": {
                borderColor: "divider",
                textAlign: "center",
                verticalAlign: "middle",
              },
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: "action.hover",

                  "& .MuiTableCell-root": {
                    py: 1.25,
                    px: 1.5,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    verticalAlign: "middle",
                  },
                }}
              >
                <TableCell>ACCESSION</TableCell>
                <TableCell>PATIENT</TableCell>
                <TableCell>STUDY</TableCell>
                <TableCell>RADIOLOGIST</TableCell>
                <TableCell>PRIORITY</TableCell>
                <TableCell>STATUS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredOrders.map((study) => (
                <TableRow
                  hover
                  key={study.id}
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0,
                    },

                    "& .MuiTableCell-root": {
                      py: 1.4,
                      px: 1.5,
                      textAlign: "center",
                      verticalAlign: "middle",
                    },
                  }}
                >
                  {/* Accession */}

                  <TableCell>
                    <Stack
                      spacing={0.25}
                      alignItems="center"
                    >
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="primary.main"
                      >
                        {study.accessionNumber}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontFamily="monospace"
                      >
                        {study.orderId}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Patient */}

                  <TableCell>
                    <Stack
                      spacing={0.25}
                      alignItems="center"
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {study.patientName}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {study.uhid}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Study */}

                  <TableCell>
                    <Stack
                      spacing={0.4}
                      alignItems="center"
                      minWidth={0}
                      sx={{
                        minWidth: 220,
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        noWrap
                        title={study.procedure}
                        sx={{
                          maxWidth: 240,
                        }}
                      >
                        {study.procedure}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          {study.modality}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.disabled"
                        >
                          •
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {study.imageCount ?? 0}{" "}
                          {study.imageCount === 1
                            ? "image"
                            : "images"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>

                  {/* Radiologist */}

                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {study.radiologist}
                    </Typography>
                  </TableCell>

                  {/* Priority */}

                  <TableCell>
                    <Chip
                      size="small"
                      label={study.priority}
                      color={getPriorityColor(
                        study.priority
                      )}
                      variant={
                        study.priority === "Routine"
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

                  {/* Status */}

                  <TableCell>
                    <Chip
                      size="small"
                      label={study.status}
                      color={getStatusColor(
                        study.status
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

              {/* Empty State */}

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
                        No radiology studies found
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