"use client";

import { useMemo, useState } from "react";

import {
  Alert,
  Chip,
  Paper,
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

import WorkflowStatusStepper from "@/components/shared/StatusStepper/WorkflowStatusStepper";
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

  onNotify: (
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

export default function QueueTable({
  search,
  modality,
  priority,
  status,
}: Props) {
  const [rows, setRows] =
    useState<QueuePatient[]>(appointmentQueue);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as
      | "success"
      | "info"
      | "warning"
      | "error",
  });

  /* ===========================================
     FILTER
  =========================================== */

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return rows
      .filter((patient) => {
        // Show only Queue & No Show
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

    /* ===========================================
     ACTION HANDLER
  =========================================== */

  function handleWorkflowAction(
    patientId: number,
    action: WorkflowAction
  ) {
    let message = "";
    let severity: "success" | "info" | "warning" | "error" =
      "success";

    switch (action.nextStatus) {
      case "Scan Started":
        message = "Scan started successfully.";
        severity = "success";
        break;

      case "Completed":
        message = "Scan completed successfully.";
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
            action.nextStatus === "Reporting" ||
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
        <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          maxHeight: 720,
        }}
      >
        <Table
          stickyHeader
          size="small"
          sx={{
            "& th": {
              textAlign: "center",
              fontWeight: 700,
              whiteSpace: "nowrap",
            },
            "& td": {
              textAlign: "center",
              verticalAlign: "middle",
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
                <TableCell
                  key={head}
                  sx={{
                    fontWeight: 700,
                  }}
                >
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
                sx={{
                  "& td": {
                    py: 1,
                  },
                }}
              >
                {/* Accession Number */}
                <TableCell>
                  <Stack spacing={0.2}>
                    <Typography
                      fontWeight={700}
                      color="primary"
                    >
                      {patient.accessionNumber}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {patient.orderId}
                    </Typography>
                  </Stack>
                </TableCell>

                {/* Patient */}
                <TableCell>
                  <Stack spacing={0.2}>
                    <Typography fontWeight={600}>
                      {patient.patientName}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {patient.age} yrs • {patient.gender}
                    </Typography>
                  </Stack>
                </TableCell>

                {/* Modality */}
                <TableCell>
                  <Chip
                    label={patient.modality}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>

                {/* Procedure */}
                <TableCell>
                  {patient.procedure}
                </TableCell>

                {/* Radiologist */}
                <TableCell>
                  {patient.radiologist}
                </TableCell>

                {/* Scheduled */}
                <TableCell>
                  <Stack spacing={0.3}>
                    <Typography fontWeight={600}>
                      {patient.appointmentDate}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
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
                    color={
                      patient.priority === "Emergency"
                        ? "error"
                        : patient.priority === "Urgent"
                        ? "warning"
                        : "default"
                    }
                  />
                </TableCell>

                {/* Status */}
                <TableCell
                  sx={{
                    minWidth: 190,
                  }}
                >
                  <Stack
                    spacing={1}
                    alignItems="center"
                  >
                    <WorkflowStatusStepper
                      currentStatus={patient.status}
                      workflow={RADIOLOGY_QUEUE_WORKFLOW}
                      onStatusChange={() => {}}
                    />
                  </Stack>
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
                      workflow={RADIOLOGY_QUEUE_WORKFLOW}
                      onAction={(action) =>
                        handleWorkflowAction(
                          patient.id,
                          action
                        )
                      }
                    />

                    <StatusAlert
                      status={patient.status}
                      workflow={RADIOLOGY_QUEUE_WORKFLOW}
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
                    py: 8,
                  }}
                >
                  <Typography fontWeight={600}>
                    No Patients Found
                  </Typography>

                  <Typography color="text.secondary">
                    There are currently no patients in
                    Queue or No Show status.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>

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