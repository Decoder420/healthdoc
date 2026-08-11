"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

import WorkflowStatusStepper from "@/components/shared/StatusStepper/WorkflowStatusStepper";
import {
  StatusChangePayload,
  WorkflowAction,
} from "@/components/shared/StatusStepper/types";

import { pathologyWorkflow } from "@/components/dashboard/lab/lab_queue/LabWorkFlow";

export interface PatientData {
  status: string;

  patient: {
    patientId: string;
    uhid: string;
    name: string;
    age: number;
    gender: string;
  };

  visit: {
    visitType: string;
  };

  doctor: {
    name: string;
    department: string;
  };

  order: {
    orderId: string;
    priority: "emergency" | "urgent" | "elective";
    orderedAt: string;
  };

  requestedTests: string[];
}

interface Props {
  patients: PatientData[];

  onStatusChange: (
    patientId: string,
    payload: StatusChangePayload
  ) => void;

  onWorkflowAction: (
    patientId: string,
    action: WorkflowAction
  ) => void;
}

const priorityColor = {
  emergency: "error",
  urgent: "warning",
  elective: "default",
} as const;

export default function PatientQueueTable({
  patients,
  onStatusChange,
  onWorkflowAction,
}: Props) {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [priorityFilter, setPriorityFilter] =
    useState("ALL");

  const handleRefresh = () => {
  setSearch("");
  setStatusFilter("ALL");
  setPriorityFilter("ALL");
};

const router = useRouter();

  const visibleStatuses = [
  "QUEUE",
  "COLLECTED",
  "NO_SHOW",
  "RECOLLECTION_REQUIRED",
];

const filteredPatients = useMemo(() => {
  return patients.filter((patient) => {
    // Show only these statuses
    if (!visibleStatuses.includes(patient.status)) {
      return false;
    }

    const query = search.toLowerCase();

    const matchesSearch =
      patient.patient.name
        .toLowerCase()
        .includes(query) ||
      patient.patient.uhid
        .toLowerCase()
        .includes(query);

    const matchesStatus =
      statusFilter === "ALL" ||
      patient.status === statusFilter;

    const matchesPriority =
      priorityFilter === "ALL" ||
      patient.order.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });
}, [
  patients,
  search,
  statusFilter,
  priorityFilter,
]);

  return (

<TableContainer
  component={Paper}
  elevation={0}
  className="surface-card"
  sx={{
    overflow: "hidden",
  }}
>
      {/* Toolbar */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Pathology Queue
          </Typography>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={2}
            width={{
              xs: "100%",
              lg: "auto",
            }}
          >
            {/* Search */}
            <TextField
              size="small"
              placeholder="Search Patient or UHID"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: {
                  xs: "100%",
                  md: 450,
                },
              }}
            />

            {/* Status */}
            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              sx={{
                width: 220,
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

  <MenuItem value="NO_SHOW">
    Rescheduling
  </MenuItem>

  <MenuItem value="RECOLLECTION_REQUIRED">
    Recollection
  </MenuItem>
            </TextField>

            {/* Priority */}
            <TextField
              select
              size="small"
              label="Priority"
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value
                )
              }
              sx={{
                width: 200,
              }}
            >
              <MenuItem value="ALL">
                All Priority
              </MenuItem>

              <MenuItem value="emergency">
                Emergency
              </MenuItem>

              <MenuItem value="urgent">
                Urgent
              </MenuItem>

              <MenuItem value="elective">
                Elective
              </MenuItem>
            </TextField>
          </Stack>

          <Button
  variant="outlined"
  startIcon={<RefreshOutlinedIcon />}
  onClick={handleRefresh}
  sx={{
    minWidth: 120,
    height: 40,
    textTransform: "none",
    borderRadius: 2,
  }}
>
  Refresh
</Button>
        </Stack>
      </Box>

      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center">
              Priority
            </TableCell>

            <TableCell align="center">
              Patient
            </TableCell>

            <TableCell align="center">
              UHID
            </TableCell>

            <TableCell align="center">
              Tests
            </TableCell>

            <TableCell align="center">
              Doctor
            </TableCell>

            <TableCell align="center">
              Ordered At
            </TableCell>

            <TableCell align="center">
              Current Status
            </TableCell>

            <TableCell align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredPatients.length > 0 ? (
  filteredPatients.map((patient) => {
    const currentStep = pathologyWorkflow.find(
      (step) => step.value === patient.status
    );

    return (
      <TableRow
        key={patient.order.orderId}
        hover
        sx={{
          "& td": {
            verticalAlign: "middle",
          },

          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        {/* Priority */}
        <TableCell align="center">
          <Chip
            size="small"
            variant="outlined"
            label={patient.order.priority.toUpperCase()}
            color={priorityColor[patient.order.priority]}
            sx={{
              minWidth: 100,
              fontWeight: 600,
            }}
          />
        </TableCell>

        {/* Patient */}
        <TableCell align="center">
          <Stack
            spacing={0.3}
            alignItems="center"
          >
            <Typography fontWeight={600}>
              {patient.patient.name}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {patient.patient.age} Years •{" "}
              {patient.patient.gender}
            </Typography>
          </Stack>
        </TableCell>

        {/* UHID */}
        <TableCell align="center">
          {patient.patient.uhid}
        </TableCell>

        {/* Tests */}
        <TableCell align="center">
          <Stack
            direction="row"
            spacing={0.5}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
          >
            {patient.requestedTests.map((test) => (
              <Chip
                key={test}
                label={test}
                size="small"
                variant="outlined"
              />
            ))}
          </Stack>
        </TableCell>

        {/* Doctor */}
        <TableCell align="center">
          <Stack
            spacing={0.3}
            alignItems="center"
          >
            <Typography fontWeight={600}>
              {patient.doctor.name}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {patient.doctor.department}
            </Typography>
          </Stack>
        </TableCell>

        {/* Ordered Time */}
       <TableCell align="center">
  {new Date(patient.order.orderedAt).toLocaleDateString("en-IN")}
</TableCell>

  
        {/* Workflow */}
        <TableCell align="center">
          <WorkflowStatusStepper
  currentStatus={patient.status}
  workflow={pathologyWorkflow}
  onStatusChange={(payload) =>
    onStatusChange(
      patient.order.orderId,
      payload
    )
  }
/>
        </TableCell>

        {/* Actions */}
        <TableCell align="center">
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
          >
           {patient.status === "QUEUE" && (
  <>
    <Button
      variant="contained"
      size="small"
      onClick={() =>
        onStatusChange(patient.order.orderId, {
          from: patient.status,
          to: "COLLECTED",
          action: "collect",
        })
      }
    >
      Collected
    </Button>

    <Button
      variant="outlined"
      color="warning"
      size="small"
      onClick={() =>
        onWorkflowAction(
          patient.order.orderId,
          pathologyWorkflow.find(
            step => step.value === "QUEUE"
          )!.actions!.find(
            action => action.id === "no_show"
          )!
        )
      }
    >
      No Show
    </Button>

    <Button
      variant="outlined"
      color="error"
      size="small"
      onClick={() =>
        onWorkflowAction(
          patient.order.orderId,
          pathologyWorkflow.find(
            step => step.value === "QUEUE"
          )!.actions!.find(
            action => action.id === "remove"
          )!
        )
      }
    >
      Remove
    </Button>
  </>
)}
            {patient.status === "COLLECTED" && (
              <>
               <Button
  variant="contained"
  color="success"
  size="small"
  onClick={() =>
    router.push(
      `/lab/pathology/sample?orderId=${patient.order.orderId}`
    )
  }
>
  Accept Sample
</Button>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() =>
                    onWorkflowAction(
                      patient.order.orderId,
                      pathologyWorkflow[2].actions![1]
                    )
                  }
                >
                  Reject Sample
                </Button>
              </>
            )}
            {patient.status === "NO_SHOW" && (
  <Button
    variant="contained"
    color="primary"
    size="small"
    onClick={() =>
      onWorkflowAction(
        patient.order.orderId,
        pathologyWorkflow.find(
          (step) => step.value === "NO_SHOW"
        )!.actions![0]
      )
    }
  >
    Reschedule
  </Button>
)}

{patient.status === "RECOLLECTION_REQUIRED" && (
  <Button
    variant="contained"
    color="primary"
    size="small"
    onClick={() =>
      onWorkflowAction(
        patient.order.orderId,
        pathologyWorkflow.find(
          (step) => step.value === "RECOLLECTION_REQUIRED"
        )!.actions![0]
      )
    }
  >
    Recollect Sample
  </Button>
)}

          </Stack>
        </TableCell>
      </TableRow>
    );
  })
) : (<TableRow>
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
        variant="h6"
        fontWeight={600}
      >
        No Patients Found
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        Try changing the search or filter criteria.
      </Typography>
    </Stack>
  </TableCell>
</TableRow>
)}
</TableBody>
</Table>

</TableContainer>
);
}
