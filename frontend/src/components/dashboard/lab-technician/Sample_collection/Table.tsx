"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
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
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { patients as labPatients } from "@/lib/mock/lab_data";

import WorkflowStatusStepper from "@/components/shared/StatusStepper/WorkflowStatusStepper";
import WorkflowStatusAction from "@/components/shared/StatusStepper/WorkflowStatusAction";

import { SAMPLE_COLLECTION_WORKFLOW } from "./sampleWorkflow";

import ViewSampleDialog from "./ViewSampleDialog";
import BarcodePrintDialog from "./BarcodePrintDialog";

interface SampleData {
  id: number;

  patientId: string;

  patientName: string;

  uhid: string;

  tests: string;

  barcode: string;

  collectedAt: string;

  status: "PROCESSING" | "COMPLETED";

  sampleType: string;

  container: string;

  priority: string;

  collectedBy: string;

  doctor: string;

  department: string;
}

export default function SampleCollectionTable() {
const [tableRows, setTableRows] = useState<SampleData[]>(() =>
  labPatients.map((patient) => ({
    id: Number(patient.patient.patientId.replace("P", "")),

    patientId: patient.patient.patientId,

    patientName: patient.patient.name,

    uhid: patient.patient.uhid,

    tests: patient.requestedTests.join(", "),

    barcode: patient.sample.barcode || "-",

    collectedAt: patient.sample.collectedAt || "-",

    status:
  patient.status === "COMPLETED"
    ? "COMPLETED"
    : "PROCESSING",

    sampleType: patient.sample.sampleType || "-",

    container: patient.sample.container || "-",

    priority: patient.order.priority,

    collectedBy: patient.sample.collectedBy || "-",

    doctor: patient.doctor.name,

    department: patient.doctor.department,
  }))
);
  const [search, setSearch] =
    useState("");

  const [selectedSample, setSelectedSample] =
    useState<SampleData | null>(null);

  const [openView, setOpenView] =
    useState(false);

  const [openPrint, setOpenPrint] =
    useState(false);

  const filteredRows = useMemo(() => {
  const keyword = search.toLowerCase();

  return tableRows.filter((row) =>
    row.patientName.toLowerCase().includes(keyword) ||
    row.uhid.toLowerCase().includes(keyword) ||
    row.barcode.toLowerCase().includes(keyword)
  );
}, [tableRows, search]);

 const updateStatus = (
  id: number,
  nextStatus: SampleData["status"]
) => {
  setTableRows((prev) =>
    prev.map((row) =>
      row.id === id
        ? {
            ...row,
            status: nextStatus,
          }
        : row
    )
  );
};

const handleRefresh = () => {
  setSearch("")
  setTableRows(
  labPatients.map((patient) => ({
    id: Number(patient.patient.patientId.replace("P", "")),

    patientId: patient.patient.patientId,

    patientName: patient.patient.name,

    uhid: patient.patient.uhid,

    tests: patient.requestedTests.join(", "),

    barcode: patient.sample.barcode || "-",

    collectedAt: patient.sample.collectedAt || "-",

    status: "PROCESSING",

    sampleType: patient.sample.sampleType || "-",

    container: patient.sample.container || "-",

    priority: patient.order.priority,

    collectedBy: patient.sample.collectedBy || "-",

    doctor: patient.doctor.name,

    department: patient.doctor.department,
  }))
);
};
    return (
    <>
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
        {/* Toolbar */}
       <Stack
  direction={{ xs: "column", md: "row" }}
  spacing={2}
  p={2}
  justifyContent="space-between"
  alignItems="center"
>
  <TextField
    size="small"
    placeholder="Search Patient / UHID / Barcode"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    sx={{
      width: {
        xs: "100%",
        md: 600,
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

  <Tooltip title="Refresh">
    <IconButton onClick={handleRefresh}>
      <RefreshRoundedIcon />
    </IconButton>
  </Tooltip>
</Stack>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  "Patient",
                  "UHID",
                  "Tests",
                  "Barcode",
                  "Collected",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <TableCell
                    key={head}
                    align="center"
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
              {filteredRows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    "& td": {
                      verticalAlign: "middle",
                    },
                  }}
                >
                  <TableCell align="center">
                    <Typography fontWeight={600}>
                      {row.patientName}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    {row.uhid}
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={row.tests}
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      fontFamily="monospace"
                    >
                      {row.barcode}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    {row.collectedAt}
                  </TableCell>

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <WorkflowStatusStepper
                        currentStatus={row.status}
                        workflow={
                          SAMPLE_COLLECTION_WORKFLOW
                        }
                        onStatusChange={() => {}}
                      />

                      <WorkflowStatusAction
                        currentStatus={row.status}
                        workflow={
                          SAMPLE_COLLECTION_WORKFLOW
                        }
                        onAction={(action) =>
                          updateStatus(
                            row.id,
                            action.nextStatus as
                              SampleData["status"]
                          )
                        }
                      />
                    </Stack>
                  </TableCell>

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {row.status ===
                        "PROCESSING" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={
                            <CheckCircleRoundedIcon />
                          }
                          onClick={() =>
                            updateStatus(
                              row.id,
                              "COMPLETED"
                            )
                          }
                        >
                          Completed
                        </Button>
                      )}

                      <Tooltip title="View Sample">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedSample(
                              row
                            );
                            setOpenView(true);
                          }}
                        >
                          <VisibilityRoundedIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Print Barcode">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedSample(
                              row
                            );
                            setOpenPrint(true);
                          }}
                        >
                          <PrintRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {filteredRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <Typography color="text.secondary">
                      No samples found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
            <ViewSampleDialog
        open={openView}
        sample={selectedSample}
        onClose={() => {
          setOpenView(false);
          setSelectedSample(null);
        }}
      />

      <BarcodePrintDialog
        open={openPrint}
        sample={selectedSample}
        onClose={() => {
          setOpenPrint(false);
          setSelectedSample(null);
        }}
      />
    </>
  );
}