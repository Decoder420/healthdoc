"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

import {
  Box,
  Button,
  Card,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { LabPatientOrder } from "@/lib/mock/lab_data";

type LabResult = LabPatientOrder["results"][number];

interface Props {
  tests: LabResult[];

  onChange: (
    index: number,
    field: keyof LabResult,
    value: string
  ) => void;

  onAddRow: () => void;
}

/* -------------------------------------------------------------------------- */
/* Result Flag                                                               */
/* -------------------------------------------------------------------------- */

function getFlag(
  result: string,
  referenceRange: string
): string {
  const value = Number(result);

  if (!result.trim() || Number.isNaN(value)) {
    return "-";
  }

  const range = referenceRange.trim();

  // Example: 3.5-5.5
  if (range.includes("-")) {
    const [min, max] = range
      .split("-")
      .map((v) => Number(v.trim()));

    if (!Number.isNaN(min) && !Number.isNaN(max)) {
      if (value < min) {
        return "Low";
      }

      if (value > max) {
        return "High";
      }

      return "Medium";
    }
  }

  // Example: <5
  if (range.startsWith("<")) {
    const max = Number(
      range.replace("<", "").trim()
    );

    if (!Number.isNaN(max)) {
      return value < max
        ? "Medium"
        : "High";
    }
  }

  // Example: >10
  if (range.startsWith(">")) {
    const min = Number(
      range.replace(">", "").trim()
    );

    if (!Number.isNaN(min)) {
      return value > min
        ? "Medium"
        : "Low";
    }
  }

  return "-";
}

/* -------------------------------------------------------------------------- */
/* Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function TestResultsTable({
  tests,
  onChange,
  onAddRow,
}: Props) {
  const fieldSx = {
    width: "100%",

    "& .MuiOutlinedInput-root": {
      height: 34,
      borderRadius: 1.5,
      fontSize: "0.82rem",
      backgroundColor: "background.paper",
    },

    "& .MuiInputBase-input": {
      px: 1.25,
      py: 0.5,
      textAlign: "center",
    },

    "& .MuiSelect-select": {
      minHeight: "unset !important",
      px: 1,
      py: 0.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
  };

  return (
    <Card
      elevation={0}
      className="surface-card"
      sx={{
        mt: 2,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              lineHeight: 1.3,
            }}
          >
            Test Results
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 0.25,
            }}
          >
            Enter and review laboratory test results
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          startIcon={
            <AddRoundedIcon fontSize="small" />
          }
          onClick={onAddRow}
          sx={{
            height: 34,
            px: 1.75,
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 600,
            whiteSpace: "nowrap",
            boxShadow: "none",
          }}
        >
          Add Row
        </Button>
      </Box>

      {/* Table */}
      <TableContainer
        sx={{
          overflowX: "auto",
        }}
      >
        <Table
          stickyHeader
          size="small"
          sx={{
            minWidth: 950,

            "& .MuiTableCell-root": {
              textAlign: "center",
              verticalAlign: "middle",
              borderColor: "divider",
            },
          }}
        >
          {/* Header */}
          <TableHead>
            <TableRow>
              {[
                "Test",
                "Result",
                "Unit",
                "Reference Range",
                "Flag",
                "Remarks",
              ].map((heading) => (
                <TableCell
                  key={heading}
                  align="center"
                  sx={{
                    py: 1.25,
                    px: 1.25,
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    color: "text.primary",
                    whiteSpace: "nowrap",
                    backgroundColor: "action.hover",
                  }}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
            {tests.map((test, index) => {
              const calculatedFlag = getFlag(
                test.result,
                test.referenceRange
              );

              /*
               * Use manually selected flag if available.
               * Otherwise use calculated flag.
               */
              const currentFlag =
                test.flag && test.flag !== "-"
                  ? test.flag
                  : calculatedFlag;

              const abnormal =
                currentFlag === "Low" ||
                currentFlag === "High";

              return (
                <TableRow
                  key={test.id}
                  hover
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0,
                    },

                    "& td": {
                      py: 1,
                      px: 1,
                    },
                  }}
                >
                  {/* Test */}
                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 170,
                    }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      value={test.testName}
                      onChange={(e) =>
                        onChange(
                          index,
                          "testName",
                          e.target.value
                        )
                      }
                      sx={fieldSx}
                    />
                  </TableCell>

                  {/* Result */}
                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 120,
                    }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      value={test.result}
                      error={abnormal}
                      onChange={(e) =>
                        onChange(
                          index,
                          "result",
                          e.target.value
                        )
                      }
                      sx={{
                        ...fieldSx,

                        ...(abnormal && {
                          "& .MuiOutlinedInput-root": {
                            height: 34,
                            borderRadius: 1.5,
                            fontSize: "0.82rem",
                            backgroundColor:
                              currentFlag === "High"
                                ? "error.50"
                                : "warning.50",
                          },
                        }),
                      }}
                    />
                  </TableCell>

                  {/* Unit */}
                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 100,
                    }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      value={test.unit}
                      onChange={(e) =>
                        onChange(
                          index,
                          "unit",
                          e.target.value
                        )
                      }
                      sx={fieldSx}
                    />
                  </TableCell>

                  {/* Reference Range */}
                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 150,
                    }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      value={test.referenceRange}
                      onChange={(e) =>
                        onChange(
                          index,
                          "referenceRange",
                          e.target.value
                        )
                      }
                      sx={fieldSx}
                    />
                  </TableCell>

                  {/* Flag */}
                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 120,
                    }}
                  >
                    <Select
                      fullWidth
                      size="small"
                      value={currentFlag}
                      onChange={(e) =>
                        onChange(
                          index,
                          "flag",
                          e.target.value
                        )
                      }
                      displayEmpty
                      sx={{
                        height: 34,
                        borderRadius: 1.5,
                        fontSize: "0.82rem",
                        fontWeight: 600,

                        backgroundColor:
                          currentFlag === "High"
                            ? "error.50"
                            : currentFlag === "Medium"
                              ? "warning.50"
                              : currentFlag === "Low"
                                ? "info.50"
                                : "background.paper",

                        "& .MuiSelect-select": {
                          minHeight:
                            "unset !important",
                          py: 0.5,
                          px: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "center",
                          textAlign: "center",
                        },

                        "& .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor:
                              "divider",
                          },

                        "&:hover .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor:
                              "text.secondary",
                          },
                      }}
                    >
                      <MenuItem value="-">
                        -
                      </MenuItem>

                      <MenuItem value="Low">
                        Low
                      </MenuItem>

                      <MenuItem value="Medium">
                        Medium
                      </MenuItem>

                      <MenuItem value="High">
                        High
                      </MenuItem>
                    </Select>
                  </TableCell>

                  {/* Remarks */}
                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 180,
                    }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      value={test.remarks}
                      onChange={(e) =>
                        onChange(
                          index,
                          "remarks",
                          e.target.value
                        )
                      }
                      sx={fieldSx}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            {/* Empty State */}
            {tests.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{
                    py: 5,
                    borderBottom: 0,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    No test results added yet.
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={
                      <AddRoundedIcon />
                    }
                    onClick={onAddRow}
                    sx={{
                      mt: 1.5,
                      height: 34,
                      borderRadius: 1.5,
                      textTransform: "none",
                    }}
                  >
                    Add Test
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}