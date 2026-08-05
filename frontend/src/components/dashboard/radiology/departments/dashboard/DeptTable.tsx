"use client";

import { useRouter } from "next/navigation";

import {
  Button,
  Chip,
  Paper,
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
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <TableContainer>
        <Table>
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
                      <Typography fontWeight={600}>
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
                    {row.uhid}
                  </TableCell>

                  {/* Accession */}
                  <TableCell align="center">
                    {row.accessionNumber}
                  </TableCell>

                  {/* Study */}
                  <TableCell align="center">
                    {row.procedure}
                  </TableCell>

                  {/* Modality */}
                  <TableCell align="center">
                    {row.modality}
                  </TableCell>

                  {/* Priority */}
                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={row.priority}
                      color={
                        row.priority === "Emergency"
                          ? "error"
                          : row.priority === "Urgent"
                          ? "warning"
                          : "default"
                      }
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
                        color={
                          row.status === "Verified"
                            ? "success"
                            : "warning"
                        }
                      />
                    )}
                  </TableCell>

                  {/* Appointment */}
                  <TableCell align="center">
                    <Stack spacing={0.5}>
                      <Typography variant="body2">
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
    >
      {row.status === "Processing" && (
        <Button
          variant="contained"
          size="small"
          onClick={() =>
            router.push(
              `/dashboard/radiology/report-entry?orderId=${row.orderId}`
            )
          }
        >
          Complete Report
        </Button>
      )}

      {row.status === "Verified" && (
        <Button
          variant="outlined"
          color="success"
          size="small"
          onClick={() =>
            router.push(
              `/dashboard/radiology/reports/${row.orderId}`
            )
          }
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
                  >
                    <Typography
                      py={5}
                      color="text.secondary"
                    >
                      No processing or verified studies found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

            {/* LOADING STATE */}
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  align="center"
                >
                  <Typography
                    py={5}
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
    </Paper>
  );
}