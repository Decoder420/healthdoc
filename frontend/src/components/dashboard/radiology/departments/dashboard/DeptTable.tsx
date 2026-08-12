"use client";

import { useRouter } from "next/navigation";

import {
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { RadiologyTableProps } from "./types";

export default function RadiologyTable({
  rows,
  loading = false,
  renderStatus,
  renderActions,
}: RadiologyTableProps) {
  const router = useRouter();

  // Show only Processing and Verified studies
  const displayRows = rows.filter(
    (row) =>
      row.status === "Processing" ||
      row.status === "Verified"
  );

  return (
    <div className="surface-card mt-3 overflow-hidden">
      <TableContainer>
        <Table
          sx={{
            minWidth: 1100,

            "& .MuiTableCell-head": {
              fontWeight: 700,
              fontSize: 12,
              color: "text.secondary",
              backgroundColor: "action.hover",
              whiteSpace: "nowrap",
              py: 1.75,
              borderBottom: "1px solid",
              borderColor: "divider",
            },

            "& .MuiTableCell-body": {
              py: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            },

            "& tbody tr:last-child td": {
              borderBottom: 0,
            },

            "& tbody tr:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          {/* HEADER */}
          <TableHead>
            <TableRow>
              <TableCell align="center">
                Patient
              </TableCell>

              <TableCell align="center">
                UHID
              </TableCell>

              <TableCell align="center">
                Accession No.
              </TableCell>

              <TableCell align="center">
                Study
              </TableCell>

              <TableCell align="center">
                Modality
              </TableCell>

              <TableCell align="center">
                Priority
              </TableCell>

              <TableCell align="center">
                Status
              </TableCell>

              <TableCell align="center">
                Appointment
              </TableCell>

              <TableCell align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          {/* BODY */}
          <TableBody>
            {!loading &&
              displayRows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                >
                  {/* Patient */}
                  <TableCell align="center">
                    <Stack
                      spacing={0.5}
                      alignItems="center"
                    >
                      <Typography
                        fontWeight={600}
                        fontSize={14}
                      >
                        {row.patientName}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Token: {row.token}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* UHID */}
                  <TableCell align="center">
                    <Typography
                      fontSize={13}
                      color="text.secondary"
                    >
                      {row.uhid}
                    </Typography>
                  </TableCell>

                  {/* Accession */}
                  <TableCell align="center">
                    <Typography
                      fontSize={13}
                      fontWeight={600}
                      color="primary.main"
                    >
                      {row.accessionNumber}
                    </Typography>
                  </TableCell>

                  {/* Study */}
                  <TableCell align="center">
                    <Typography
                      fontSize={13}
                      sx={{
                        maxWidth: 220,
                        mx: "auto",
                        lineHeight: 1.4,
                      }}
                    >
                      {row.procedure}
                    </Typography>
                  </TableCell>

                  {/* Modality */}
                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={row.modality}
                      variant="outlined"
                      sx={{
                        minWidth: 70,
                        height: 28,
                        borderRadius: 1.5,
                        fontWeight: 600,
                        fontSize: 12,
                        borderColor: "divider",
                        color: "text.primary",
                      }}
                    />
                  </TableCell>

                  {/* Priority */}
                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={row.priority}
                      variant="outlined"
                      sx={{
                        minWidth: 78,
                        height: 28,
                        borderRadius: 1.5,
                        fontWeight: 600,
                        fontSize: 12,

                        ...(row.priority ===
                        "Emergency"
                          ? {
                              color: "error.main",
                              borderColor:
                                "rgba(211, 47, 47, 0.35)",
                            }
                          : row.priority ===
                            "Urgent"
                          ? {
                              color: "warning.dark",
                              borderColor:
                                "rgba(237, 108, 2, 0.35)",
                            }
                          : {
                              color: "text.secondary",
                              borderColor: "divider",
                            }),
                      }}
                    />
                  </TableCell>

                  {/* Status */}
                  <TableCell align="center">
                    {renderStatus ? (
                      renderStatus(row)
                    ) : (
                      <Chip
                        size="small"
                        label={row.status}
                        variant="outlined"
                        sx={{
                          minWidth: 90,
                          height: 28,
                          borderRadius: 1.5,
                          fontWeight: 600,
                          fontSize: 12,

                          color:
                            row.status ===
                            "Verified"
                              ? "text.primary"
                              : "primary.main",

                          borderColor:
                            row.status ===
                            "Verified"
                              ? "divider"
                              : "rgba(0, 31, 84, 0.25)",
                        }}
                      />
                    )}
                  </TableCell>

                  {/* Appointment */}
                  <TableCell align="center">
                    <Stack
                      spacing={0.5}
                      alignItems="center"
                    >
                      <Typography
                        variant="body2"
                        fontWeight={500}
                      >
                        {row.appointmentDate}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {row.appointmentTime}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    {renderActions ? (
                      renderActions(row)
                    ) : (
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                        alignItems="center"
                      >
                        {row.status ===
                          "Processing" && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              router.push(
                                `/radiology/test_results?accessionNumber=${row.accessionNumber}`
                              )
                            }
                            sx={{
                              minWidth: 115,
                              height: 34,
                              borderRadius: 2,
                              textTransform:
                                "none",
                              fontWeight: 600,
                            }}
                          >
                            Complete Test
                          </Button>
                        )}

                        {row.status ===
                          "Verified" && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              router.push(
                                `/radiology/reports/${row.accessionNumber}`
                              )
                            }
                            sx={{
                              minWidth: 105,
                              height: 34,
                              borderRadius: 2,
                              textTransform:
                                "none",
                              fontWeight: 600,
                            }}
                          >
                            View Report
                          </Button>
                        )}
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))}

            {/* EMPTY STATE */}
            {!loading &&
              displayRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    align="center"
                    sx={{
                      py: 8,
                    }}
                  >
                    <Stack
                      spacing={1}
                      alignItems="center"
                    >
                      <Typography
                        fontWeight={600}
                      >
                        No studies found
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        No processing or verified
                        studies are currently
                        available.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}

            {/* LOADING STATE */}
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  align="center"
                  sx={{
                    py: 8,
                  }}
                >
                  <Typography
                    color="text.secondary"
                  >
                    Loading studies...
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}