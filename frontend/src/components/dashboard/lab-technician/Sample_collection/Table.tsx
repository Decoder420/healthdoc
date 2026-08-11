"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  Chip,
  IconButton,
  InputAdornment,
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
  orderId: string;
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

function mapLabPatientToRow(
  patient: (typeof labPatients)[number],
): SampleData {
  return {
    id: Number(
      patient.order.orderId.replace(/\D/g, ""),
    ),

    orderId: patient.order.orderId,

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

    sampleType:
      patient.sample.sampleType || "-",

    container:
      patient.sample.container || "-",

    priority: patient.order.priority,

    collectedBy:
      patient.sample.collectedBy || "-",

    doctor: patient.doctor.name,

    department:
      patient.doctor.department,
  };
}

export default function SampleCollectionTable() {
  const router = useRouter();

  const [tableRows, setTableRows] =
    useState<SampleData[]>(() =>
      labPatients.map((patient) =>
        mapLabPatientToRow(patient),
      ),
    );

  const [search, setSearch] = useState("");

  const [selectedSample, setSelectedSample] =
    useState<SampleData | null>(null);

  const [openView, setOpenView] =
    useState(false);

  const [openPrint, setOpenPrint] =
    useState(false);

  /*
   * Filter only PROCESSING samples.
   */
  const filteredRows = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return tableRows.filter(
      (row) =>
        row.status === "PROCESSING" &&
        (
          row.patientName
            .toLowerCase()
            .includes(keyword) ||
          row.uhid
            .toLowerCase()
            .includes(keyword) ||
          row.orderId
            .toLowerCase()
            .includes(keyword) ||
          row.barcode
            .toLowerCase()
            .includes(keyword)
        ),
    );
  }, [tableRows, search]);

  /*
   * Update sample status.
   */
  const updateStatus = (
    id: number,
    nextStatus: SampleData["status"],
  ) => {
    setTableRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              status: nextStatus,
            }
          : row,
      ),
    );

    const patient = labPatients.find(
      (p) =>
        Number(
          p.order.orderId.replace(/\D/g, ""),
        ) === id,
    );

    if (!patient) {
      return;
    }

    /*
     * Update mock data as well so
     * refresh keeps the updated state.
     */
    patient.status = nextStatus;

    /*
     * When sample is completed,
     * navigate to result entry.
     */
    if (nextStatus === "COMPLETED") {
      router.push(
        `/lab/pathology/lab_results?orderId=${patient.order.orderId}`,
      );
    }
  };

  /*
   * Refresh table.
   */
  const handleRefresh = () => {
    setSearch("");

    setTableRows(
      labPatients.map((patient) =>
        mapLabPatientToRow(patient),
      ),
    );
  };

  return (
    <>
      <Card
        elevation={0}
        className="surface-card"
        sx={{
          mt: 3,
          overflow: "hidden",
          borderColor: "divider",
        }}
      >
        {/* =========================
            Toolbar
        ========================== */}
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1}
          px={1.75}
          py={1.25}
          justifyContent="space-between"
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
        >
          {/* Search */}
          <TextField
            size="small"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search patient, UHID, Order ID or barcode"
            sx={{
              width: {
                xs: "100%",
                sm: 380,
                md: 460,
              },

              "& .MuiOutlinedInput-root": {
                height: 34,
                borderRadius: 1.5,
                fontSize: "0.82rem",

                "& fieldset": {
                  borderColor: "divider",
                },

                "&:hover fieldset": {
                  borderColor: "text.secondary",
                },

                "&.Mui-focused fieldset": {
                  borderWidth: 1,
                },
              },

              "& .MuiInputBase-input": {
                padding: "6px 8px",
              },

              "& .MuiInputBase-input::placeholder": {
                opacity: 0.7,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{
                    mr: 0.5,
                  }}
                >
                  <SearchRoundedIcon
                    sx={{
                      fontSize: 18,
                      color: "text.secondary",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          {/* Refresh */}
          <Tooltip title="Refresh">
            <IconButton
              onClick={handleRefresh}
              size="small"
              sx={{
                width: 34,
                height: 34,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,

                "&:hover": {
                  backgroundColor:
                    "action.hover",
                },
              }}
            >
              <RefreshRoundedIcon
                sx={{
                  fontSize: 19,
                }}
              />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* =========================
            Table
        ========================== */}
        <TableContainer>
          <Table
            size="small"
            sx={{
              /*
               * Remove default MUI
               * cell borders.
               */
              "& .MuiTableCell-root": {
                borderBottom: "none",
              },

              /*
               * Divider between data rows.
               */
              "& .MuiTableBody-root .MuiTableRow-root:not(:last-child) .MuiTableCell-root":
                {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                },

              /*
               * Data row spacing.
               */
              "& .MuiTableBody-root .MuiTableCell-root":
                {
                  py: 1.25,
                  px: 1.5,
                },

              /*
               * Row hover.
               */
              "& .MuiTableBody-root .MuiTableRow-root:hover":
                {
                  backgroundColor:
                    "action.hover",
                },
            }}
          >
            {/* =========================
                Table Heading
            ========================== */}
            <TableHead>
              <TableRow
                sx={{
                  "& .MuiTableCell-root": {
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  },
                }}
              >
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
                      py: 1.25,
                      px: 1.5,

                      fontSize: "0.72rem",
                      fontWeight: 700,

                      letterSpacing:
                        "0.04em",

                      textTransform:
                        "uppercase",

                      whiteSpace: "nowrap",

                      color:
                        "text.secondary",

                      backgroundColor:
                        "action.hover",

                      "&:first-of-type": {
                        borderTopLeftRadius: 8,
                      },

                      "&:last-of-type": {
                        borderTopRightRadius: 8,
                      },
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* =========================
                Table Data
            ========================== */}
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow
                  key={row.orderId}
                  hover
                  sx={{
                    "& td": {
                      verticalAlign:
                        "middle",
                    },
                  }}
                >
                  {/* Patient */}
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {row.patientName}
                    </Typography>
                  </TableCell>

                  {/* UHID */}
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      color="text.primary"
                    >
                      {row.uhid}
                    </Typography>
                  </TableCell>

                  {/* Tests */}
                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={row.tests}
                      variant="outlined"
                      sx={{
                        maxWidth: 220,
                        height: 26,

                        fontSize:
                          "0.75rem",

                        "& .MuiChip-label": {
                          overflow:
                            "hidden",

                          textOverflow:
                            "ellipsis",

                          whiteSpace:
                            "nowrap",
                        },
                      }}
                    />
                  </TableCell>

                  {/* Barcode */}
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      fontFamily="monospace"
                      sx={{
                        whiteSpace:
                          "nowrap",

                        fontSize:
                          "0.78rem",
                      }}
                    >
                      {row.barcode}
                    </Typography>
                  </TableCell>

                  {/* Collected */}
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace:
                          "nowrap",

                        fontSize:
                          "0.78rem",
                      }}
                    >
                      {row.collectedAt}
                    </Typography>
                  </TableCell>

                  {/* Status */}
                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={0.75}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <WorkflowStatusStepper
                        currentStatus={
                          row.status
                        }
                        workflow={
                          SAMPLE_COLLECTION_WORKFLOW
                        }
                        onStatusChange={() => {}}
                      />

                      <WorkflowStatusAction
                        currentStatus={
                          row.status
                        }
                        workflow={
                          SAMPLE_COLLECTION_WORKFLOW
                        }
                        onAction={(action) =>
                          updateStatus(
                            row.id,
                            action.nextStatus as SampleData["status"],
                          )
                        }
                      />
                    </Stack>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {/* Complete */}
                      {row.status ===
                        "PROCESSING" && (
                        <Tooltip title="Mark as Completed">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() =>
                              updateStatus(
                                row.id,
                                "COMPLETED",
                              )
                            }
                            sx={{
                              width: 32,
                              height: 32,
                            }}
                          >
                            <CheckCircleRoundedIcon
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* View */}
                      <Tooltip title="View Sample">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedSample(
                              row,
                            );

                            setOpenView(true);
                          }}
                          sx={{
                            width: 32,
                            height: 32,
                          }}
                        >
                          <VisibilityRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Print */}
                      <Tooltip title="Print Barcode">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedSample(
                              row,
                            );

                            setOpenPrint(true);
                          }}
                          sx={{
                            width: 32,
                            height: 32,
                          }}
                        >
                          <PrintRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {/* =========================
                  Empty State
              ========================== */}
              {filteredRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{
                      py: 6,
                      borderBottom:
                        "none !important",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      No samples found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* =========================
          View Sample Dialog
      ========================== */}
      <ViewSampleDialog
        open={openView}
        sample={selectedSample}
        onClose={() => {
          setOpenView(false);
          setSelectedSample(null);
        }}
      />

      {/* =========================
          Barcode Print Dialog
      ========================== */}
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
