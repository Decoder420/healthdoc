"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Card,
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
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

interface Props {
  visits: any[];
}

export default function PatientVisits({
  visits,
}: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const filteredVisits = useMemo(() => {
    return visits.filter((visit) => {
      const matchesSearch =
        visit.visit.visitId
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        visit.doctor.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        visit.doctor.department
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "ALL" ||
        visit.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [visits, search, status]);

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "VERIFIED":
        return "success";

      case "READY":
        return "primary";

      case "PROCESSING":
        return "warning";

      case "QUEUE":
        return "info";

      default:
        return "default";
    }
  };

  return (
    <Card sx={{ borderRadius: 4 }}>

      {/* Toolbar */}

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
        justifyContent="space-between"
        p={3}
      >
        <TextField
          size="small"
          placeholder="Search Visit / Doctor / Department"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          sx={{
            width: {
              xs: "100%",
              md: 380,
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

        <Stack direction="row" spacing={2}>

          <TextField
            select
            size="small"
            value={status}
            sx={{ width: 170 }}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <MenuItem value="ALL">
              All Status
            </MenuItem>

            <MenuItem value="QUEUE">
              Queue
            </MenuItem>

            <MenuItem value="PROCESSING">
              Processing
            </MenuItem>

            <MenuItem value="READY">
              Ready
            </MenuItem>

            <MenuItem value="VERIFIED">
              Verified
            </MenuItem>
          </TextField>

          <Tooltip title="Refresh">

            <IconButton
              onClick={() => {
                setSearch("");
                setStatus("ALL");
              }}
            >
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

              <TableCell>
                <strong>Visit</strong>
              </TableCell>

              <TableCell>
                <strong>Date</strong>
              </TableCell>

              <TableCell>
                <strong>Doctor</strong>
              </TableCell>

              <TableCell>
                <strong>Department</strong>
              </TableCell>

              <TableCell>
                <strong>Priority</strong>
              </TableCell>

              <TableCell>
                <strong>Status</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Action</strong>
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {filteredVisits.map((visit) => (

              <TableRow
                hover
                key={visit.visit.visitId}
              >

                <TableCell>

                  <Typography
                    fontWeight={700}
                  >
                    {visit.visit.visitId}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {visit.visit.visitType}
                  </Typography>

                </TableCell>

                <TableCell>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >

                    <CalendarMonthRoundedIcon
                      fontSize="small"
                    />

                    <Typography
                      variant="body2"
                    >
                      {new Date(
                        visit.order.orderedAt
                      ).toLocaleDateString()}
                    </Typography>

                  </Stack>

                </TableCell>

                <TableCell>
                  {visit.doctor.name}
                </TableCell>

                <TableCell>
                  {visit.doctor.department}
                </TableCell>

                <TableCell>

                  <Chip
                    size="small"
                    label={
                      visit.order.priority
                    }
                    color={
                      visit.order.priority ===
                      "Emergency"
                        ? "error"
                        : visit.order.priority ===
                          "Urgent"
                        ? "warning"
                        : "default"
                    }
                  />

                </TableCell>

                <TableCell>

                  <Chip
                    size="small"
                    label={visit.status}
                    color={
                      getStatusColor(
                        visit.status
                      ) as any
                    }
                  />

                </TableCell>

                <TableCell align="center">

                  <Button
                    variant="outlined"
                    startIcon={
                      <VisibilityRoundedIcon />
                    }
                    onClick={() =>
                      router.push(
                        `/dashboard/pathology/visit/${visit.visit.visitId}`
                      )
                    }
                  >
                    View
                  </Button>

                </TableCell>

              </TableRow>

            ))}

            {filteredVisits.length === 0 && (

              <TableRow>

                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography color="text.secondary">
                    No visits found.
                  </Typography>
                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

      </TableContainer>

    </Card>
  );
}