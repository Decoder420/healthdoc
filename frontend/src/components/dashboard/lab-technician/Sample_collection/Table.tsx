"use client";

import { useState } from "react";

import {
  Box,
  Chip,
  IconButton,
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
  Tooltip,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import WorkflowStatusStepper from "@/components/shared/StatusStepper/WorkflowStatusStepper";
import { SAMPLE_COLLECTION_WORKFLOW } from "./sampleWorkflow";

import ViewSampleDialog from "./ViewSampleDialog";
import BarcodePrintDialog from "./BarcodePrintDialog";

interface SampleData {
  id: number;

  patientName: string;

  uhid: string;

  tests: string;

  barcode: string;

  collectedAt: string;

  status: "COLLECTED" | "PROCESSING";

  sampleType: string;

  container: string;

  priority: string;

  collectedBy: string;

  doctor: string;

  department: string;
}

const initialRows: SampleData[] = [
  {
    id: 1,
    patientName: "John Doe",
    uhid: "UH10021",
    tests: "CBC",
    barcode: "LAB240001",
    collectedAt: "10:30 AM",
    status: "COLLECTED",
    sampleType: "Blood",
    container: "EDTA Tube",
    priority: "Routine",
    collectedBy: "Ishika",
    doctor: "Dr. Sharma",
    department: "Medicine",
  },
  {
    id: 2,
    patientName: "Aman Singh",
    uhid: "UH10022",
    tests: "LFT",
    barcode: "LAB240002",
    collectedAt: "10:45 AM",
    status: "COLLECTED",
    sampleType: "Blood",
    container: "Plain Tube",
    priority: "Urgent",
    collectedBy: "Rahul",
    doctor: "Dr. Mehta",
    department: "Cardiology",
  },
  {
    id: 3,
    patientName: "Neha Sharma",
    uhid: "UH10023",
    tests: "CBC, LFT",
    barcode: "LAB240003",
    collectedAt: "11:15 AM",
    status: "COLLECTED",
    sampleType: "Blood",
    container: "EDTA Tube",
    priority: "Routine",
    collectedBy: "Priya",
    doctor: "Dr. Gupta",
    department: "General Medicine",
  },
];

export default function SampleCollectionTable() {
  const [tableRows, setTableRows] =
  useState(initialRows);

const [search, setSearch] =
  useState("");

const [status, setStatus] =
  useState("All");

const [selectedSample, setSelectedSample] =
  useState<SampleData | null>(null);

const [openView, setOpenView] =
  useState(false);

const [openPrint, setOpenPrint] =
  useState(false);

  const filteredRows =tableRows.filter((row) => {
    const matchesSearch =
      row.patientName.toLowerCase().includes(search.toLowerCase()) ||
      row.uhid.toLowerCase().includes(search.toLowerCase()) ||
      row.barcode.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "All" || row.status === status;

    return matchesSearch && matchesStatus;
  });

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
      >
        <TextField
          size="small"
          placeholder="Search Patient / UHID / Barcode"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: "100%", md: 350 } }}
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
            onChange={(e) => setStatus(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Collected">Collected</MenuItem>
          </TextField>

          <Tooltip title="Refresh">
            <IconButton>
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
              <TableCell><strong>Patient</strong></TableCell>
              <TableCell><strong>UHID</strong></TableCell>
              <TableCell><strong>Tests</strong></TableCell>
              <TableCell><strong>Barcode</strong></TableCell>
              <TableCell><strong>Collected</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row) => (
              <TableRow hover key={row.id}>
                <TableCell>
                  <Typography fontWeight={600}>
                    {row.patientName}
                  </Typography>
                </TableCell>

                <TableCell>{row.uhid}</TableCell>

                <TableCell>
                  <Chip
                    label={row.tests}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    fontFamily="monospace"
                  >
                    {row.barcode}
                  </Typography>
                </TableCell>

                <TableCell>{row.collectedAt}</TableCell>

               <TableCell>
  <WorkflowStatusStepper
    currentStatus={row.status}
    workflow={SAMPLE_COLLECTION_WORKFLOW}
    buttonText="Start Processing"
    onStatusChange={({ to }) => {
      setTableRows((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? {
                ...item,
                status: to as "COLLECTED" | "PROCESSING",
              }
            : item
        )
      );
    }}
  />
</TableCell>
                <TableCell align="center">
                  <Box>
                   <Tooltip title="View">
  <IconButton
    size="small"
    onClick={() => {
      setSelectedSample(row);
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
      setSelectedSample(row);
      setOpenPrint(true);
    }}
  >
    <PrintRoundedIcon />
  </IconButton>
</Tooltip>
                  </Box>
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