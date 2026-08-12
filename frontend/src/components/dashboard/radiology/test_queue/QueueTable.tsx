"use client";

import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Chip,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import WorkflowStatusAction from "@/components/shared/StatusStepper/WorkflowStatusAction";
import StatusAlert from "@/components/shared/StatusStepper/StatusAlert";

import {
  StatusStep,
  WorkflowAction,
} from "@/components/shared/StatusStepper/types";

import { appointmentQueue } from "./DummyData";

interface Props {
  search: string;
  modality: string;
  priority: string;
  status: string;

  onNotify?: (
    message: string,
    severity: "success" | "info" | "warning" | "error"
  ) => void;
}

export interface QueuePatient {
  id: number;

  orderId: string;
  accessionNumber: string;
  patientId: string;
  visitId: string;

  patientName: string;
  uhid: string;

  age: number;
  gender: string;

  modality: string;
  procedure: string;

  radiologist: string;

  appointmentDate: string;
  appointmentTime: string;

  priority: string;
  status: string;

  reportAvailable: boolean;
}

const priorityOrder: Record<string, number> = {
  Emergency: 1,
  Urgent: 2,
  Routine: 3,
};

const RADIOLOGY_QUEUE_WORKFLOW: StatusStep[] = [
  {
    value: "Queue",
    label: "Queue",
    actions: [
      {
        id: "START_SCAN",
        label: "Start Scan",
        nextStatus: "Processing",
        variant: "contained",
        color: "primary",
      },
      {
        id: "NO_SHOW",
        label: "No Show",
        nextStatus: "No Show",
        variant: "outlined",
        color: "warning",
        requiresConfirmation: true,
      },
      {
        id: "REMOVE",
        label: "Remove",
        nextStatus: "Removed",
        variant: "outlined",
        color: "error",
        requiresConfirmation: true,
      },
    ],
  },

  {
    value: "Processing",
    label: "Processing",
    actions: [
      {
        id: "VERIFY",
        label: "Verify Report",
        nextStatus: "Verified",
        variant: "contained",
        color: "success",
      },
      {
        id: "REMOVE",
        label: "Remove",
        nextStatus: "Removed",
        variant: "outlined",
        color: "error",
      },
    ],
  },

  {
    value: "Verified",
    label: "Verified",
    terminal: true,
  },

  {
    value: "No Show",
    label: "No Show",
    actions: [
      {
        id: "RESCHEDULE",
        label: "Reschedule",
        nextStatus: "Queue",
        variant: "contained",
        color: "primary",
      },
      {
        id: "REMOVE",
        label: "Remove",
        nextStatus: "Removed",
        variant: "outlined",
        color: "error",
        requiresConfirmation: true,
      },
    ],
  },

  {
    value: "Removed",
    label: "Removed",
    alert: {
      severity: "error",
      message: "Appointment removed from queue",
    },
    terminal: true,
  },
];

function getPriorityStyles(priority: string) {
  switch (priority) {
    case "Emergency":
      return {
        bgcolor: "rgba(211, 47, 47, 0.06)",
        color: "error.main",
        borderColor: "rgba(211, 47, 47, 0.18)",
      };

    case "Urgent":
      return {
        bgcolor: "rgba(237, 108, 2, 0.06)",
        color: "warning.dark",
        borderColor: "rgba(237, 108, 2, 0.16)",
      };

    default:
      return {
        bgcolor: "action.hover",
        color: "text.secondary",
        borderColor: "divider",
      };
  }
}

function getStatusStyles(status: string) {
  switch (status) {
    case "Queue":
      return {
        bgcolor: "action.hover",
        color: "primary.main",
        borderColor: "divider",
      };

    case "No Show":
      return {
        bgcolor: "action.hover",
        color: "text.secondary",
        borderColor: "divider",
      };

    default:
      return {
        bgcolor: "action.hover",
        color: "text.secondary",
        borderColor: "divider",
      };
  }
}

export default function QueueTable({
  search,
  modality,
  priority,
  status,
}: Props) {
  const [rows, setRows] = useState<QueuePatient[]>(
    appointmentQueue
  );

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as
      | "success"
      | "info"
      | "warning"
      | "error",
  });

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return rows
      .filter((patient) => {
        if (
          patient.status !== "Queue" &&
          patient.status !== "No Show"
        ) {
          return false;
        }

        const matchesSearch =
          keyword === "" ||
          patient.patientName
            .toLowerCase()
            .includes(keyword) ||
          patient.uhid
            .toLowerCase()
            .includes(keyword) ||
          patient.accessionNumber
            .toLowerCase()
            .includes(keyword) ||
          patient.orderId
            .toLowerCase()
            .includes(keyword);

        const matchesModality =
          modality === "All" ||
          patient.modality === modality;

        const matchesPriority =
          priority === "All" ||
          patient.priority === priority;

        const matchesStatus =
          status === "All" ||
          patient.status === status;

        return (
          matchesSearch &&
          matchesModality &&
          matchesPriority &&
          matchesStatus
        );
      })
      .sort(
        (a, b) =>
          priorityOrder[a.priority] -
          priorityOrder[b.priority]
      );
  }, [
    rows,
    search,
    modality,
    priority,
    status,
  ]);

  function handleWorkflowAction(
    patientId: number,
    action: WorkflowAction
  ) {
    let message = "";
    let severity:
      | "success"
      | "info"
      | "warning"
      | "error" = "success";

    switch (action.nextStatus) {
      case "Processing":
        message = "Scan started successfully.";
        severity = "success";
        break;

      case "Verified":
        message = "Report verified successfully.";
        severity = "success";
        break;

      case "Queue":
        message = "Appointment rescheduled successfully.";
        severity = "info";
        break;

      case "No Show":
        message = "Patient marked as No Show.";
        severity = "warning";
        break;

      case "Removed":
        message = "Appointment removed successfully.";
        severity = "error";
        break;

      default:
        message = `Status changed to ${action.nextStatus}.`;
        severity = "success";
    }

    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== patientId) {
          return row;
        }

        return {
          ...row,
          status: action.nextStatus,
          reportAvailable:
            action.nextStatus === "Processing" ||
            action.nextStatus === "Verified",
        };
      })
    );

    setSnackbar({
      open: true,
      message,
      severity,
    });
  }

  return (
    <>
      <Box className="surface-card overflow-hidden">
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Radiology Queue
              </Typography>

              <Chip
                label={`${filteredRows.length} patients`}
                size="small"
                sx={{
                  height: 26,
                  bgcolor: "action.hover",
                  color: "text.secondary",
                  fontWeight: 600,
                  borderRadius: 1.5,
                }}
              />
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              mt={0.5}
            >
              Patients currently waiting for imaging
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Emergency cases are shown first
          </Typography>
        </Box>

        <TableContainer
          sx={{
            maxHeight: 720,

            "&::-webkit-scrollbar": {
              width: 6,
              height: 6,
            },

            "&::-webkit-scrollbar-thumb": {
              bgcolor: "divider",
              borderRadius: 10,
            },
          }}
        >
          <Table
            stickyHeader
            sx={{
              minWidth: 1250,

              /* Header */
              "& th": {
                textAlign: "center",
                fontWeight: 700,
                whiteSpace: "nowrap",
                fontSize: 12,
                color: "text.secondary",
                bgcolor: "background.paper",
                borderBottom: "1px solid",
                borderColor: "divider",
                py: 1.75,
                px: 2,
              },

              /* Rows / cells */
              "& td": {
                textAlign: "center",
                verticalAlign: "middle",
                borderBottom: "1px solid",
                borderColor: "divider",
                py: 2,
                px: 2,
              },

              "& tbody tr": {
                minHeight: 76,
              },

              "& tbody tr:last-child td": {
                borderBottom: 0,
              },

              "& tbody tr:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <TableHead>
              <TableRow>
                {[
                  "Accession No.",
                  "Patient",
                  "Modality",
                  "Procedure",
                  "Radiologist",
                  "Scheduled",
                  "Priority",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <TableCell key={head}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.map((patient) => (
                <TableRow
                  key={patient.id}
                  hover
                >
                  {/* Accession */}
                  <TableCell>
                    <Stack
                      spacing={0.5}
                      alignItems="center"
                    >
                      <Typography
                        fontWeight={700}
                        fontSize={13.5}
                        color="primary.main"
                      >
                        {patient.accessionNumber}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontSize={11.5}
                      >
                        {patient.orderId}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Patient */}
                  <TableCell>
                    <Stack
                      spacing={0.5}
                      alignItems="center"
                    >
                      <Typography
                        fontWeight={600}
                        fontSize={13.5}
                      >
                        {patient.patientName}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontSize={11.5}
                      >
                        {patient.uhid}
                        {" • "}
                        {patient.age} yrs
                        {" • "}
                        {patient.gender}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Modality */}
                  <TableCell>
                    <Chip
                      label={patient.modality}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 30,
                        minWidth: 78,
                        borderRadius: 1.5,
                        fontSize: 12,
                        fontWeight: 600,
                        borderColor: "divider",
                        color: "text.primary",
                      }}
                    />
                  </TableCell>

                  {/* Procedure */}
                  <TableCell>
                    <Typography
                      fontSize={13.5}
                      sx={{
                        maxWidth: 200,
                        mx: "auto",
                        lineHeight: 1.5,
                      }}
                    >
                      {patient.procedure}
                    </Typography>
                  </TableCell>

                  {/* Radiologist */}
                  <TableCell>
                    <Typography
                      fontSize={13.5}
                      fontWeight={500}
                    >
                      {patient.radiologist}
                    </Typography>
                  </TableCell>

                  {/* Scheduled */}
                  <TableCell>
                    <Stack
                      spacing={0.5}
                      alignItems="center"
                    >
                      <Typography
                        fontSize={13.5}
                        fontWeight={600}
                      >
                        {patient.appointmentDate}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontSize={11.5}
                      >
                        {patient.appointmentTime}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Priority */}
                  <TableCell>
                    <Chip
                      label={patient.priority}
                      size="small"
                      variant="outlined"
                      sx={{
                        ...getPriorityStyles(
                          patient.priority
                        ),
                        height: 30,
                        minWidth: 82,
                        borderRadius: 1.5,
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    />
                  </TableCell>

                  {/* Status */}
                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 150,
                    }}
                  >
                    <Chip
                      label={patient.status}
                      size="small"
                      variant="outlined"
                      sx={{
                        ...getStatusStyles(
                          patient.status
                        ),
                        height: 30,
                        minWidth: 100,
                        px: 0.75,
                        borderRadius: 1.5,
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <WorkflowStatusAction
                        currentStatus={patient.status}
                        workflow={
                          RADIOLOGY_QUEUE_WORKFLOW
                        }
                        onAction={(action) =>
                          handleWorkflowAction(
                            patient.id,
                            action
                          )
                        }
                      />

                      <StatusAlert
                        status={patient.status}
                        workflow={
                          RADIOLOGY_QUEUE_WORKFLOW
                        }
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {filteredRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    align="center"
                    sx={{
                      py: 12,
                    }}
                  >
                    <Stack
                      spacing={1}
                      alignItems="center"
                    >
                      <Typography
                        fontWeight={700}
                      >
                        No Patients Found
                      </Typography>

                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        There are currently no patients
                        in Queue or No Show status.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}