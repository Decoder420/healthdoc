"use client";

import { useState, type FormEvent } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ApiError } from "@/lib/api";
import { searchPatients } from "./api";
import type { PatientSearchField, PatientSearchResponse } from "./types";

const PAGE_SIZE = 20;

const FIELD_LABELS: Record<PatientSearchField, string> = {
  uhid: "UHID",
  mobile: "Mobile",
  full_name: "Full name",
  abha_number: "ABHA",
};

const MATCH_LABELS: Record<string, string> = {
  uhid: "UHID",
  mobile: "Mobile",
  abha: "ABHA",
  name_dob: "Name",
  aadhaar: "Aadhaar",
};

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code === 401) {
      return "Sign in required. Patient search uses the Keycloak session (F1-W1-03).";
    }
    if (err.code === 403) {
      return "You do not have access to patient search.";
    }
    if (err.isModuleDisabled) {
      return "Patient search is not offered at this facility.";
    }
    return err.message;
  }
  return "Search failed. Try again.";
}

export function PatientSearchScreen() {
  const [field, setField] = useState<PatientSearchField>("uhid");
  const [value, setValue] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PatientSearchResponse | null>(null);

  async function runSearch(nextPage: number) {
    const trimmed = value.trim();
    if (!trimmed) {
      setError(`Enter a ${FIELD_LABELS[field].toLowerCase()} to search.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchPatients({
        field,
        value: trimmed,
        page: nextPage,
        pageSize: PAGE_SIZE,
      });
      setResult(data);
      setPage(nextPage);
    } catch (err) {
      setResult(null);
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runSearch(1);
  }

  const pageCount = result ? Math.max(1, Math.ceil(result.total / result.page_size)) : 1;

  return (
    <Box component="main" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: "auto" }}>
      <Typography variant="overline" color="text.secondary">
        Receptionist
      </Typography>
      <Typography variant="h4" component="h1" gutterBottom>
        Patient search
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Search the facility register by UHID, mobile, name, or ABHA. Results stay
        inside your facility; mobile numbers are masked.
      </Typography>

      <Paper component="form" onSubmit={onSubmit} sx={{ p: 2.5, mb: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="flex-start">
          <TextField
            select
            label="Search by"
            value={field}
            onChange={(e) => setField(e.target.value as PatientSearchField)}
            sx={{ minWidth: 160 }}
          >
            {(Object.keys(FIELD_LABELS) as PatientSearchField[]).map((key) => (
              <MenuItem key={key} value={key}>
                {FIELD_LABELS[key]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={FIELD_LABELS[field]}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            inputProps={{ "aria-label": FIELD_LABELS[field] }}
          />
          <Button type="submit" variant="contained" disabled={loading} sx={{ height: 40 }}>
            {loading ? <CircularProgress size={18} color="inherit" /> : "Search"}
          </Button>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper sx={{ overflow: "hidden" }}>
          <Box sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: "divider" }}>
            <Typography fontWeight={600}>Results</Typography>
            <Typography variant="body2" color="text.secondary">
              {result.total} match{result.total === 1 ? "" : "es"}
            </Typography>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>UHID</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Matched on</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    No patients match this search.
                  </TableCell>
                </TableRow>
              ) : (
                result.items.map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{patient.uhid ?? "—"}</TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>{patient.full_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {patient.age_years != null ? `${patient.age_years} yrs` : "Age unknown"}
                        {" · "}
                        {patient.sex}
                      </Typography>
                    </TableCell>
                    <TableCell>{patient.mobile_masked ?? "—"}</TableCell>
                    <TableCell>{MATCH_LABELS[patient.matched_on] ?? patient.matched_on}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {result.total > PAGE_SIZE && (
            <Stack alignItems="center" sx={{ py: 2 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, next) => void runSearch(next)}
                disabled={loading}
              />
            </Stack>
          )}
        </Paper>
      )}
    </Box>
  );
}
