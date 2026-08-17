"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import { MetricCard } from "@/components/ui";
import { formatDateTime } from "@/lib/api";
import { patients } from "@/lib/mock/lab_data";
import { meridian } from "@/styles/theme";

interface PatientInfoProps {
  patientId: string;
  /** Where "Back to Dashboard" goes when patient is missing. Defaults to browser back. */
  backHref?: string;
}

const cardSx = {
  borderRadius: "16px",
  border: `1px solid ${meridian.border}`,
  background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
  boxShadow:
    "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
};

export default function PatientInfo({ patientId, backHref }: PatientInfoProps) {
  const router = useRouter();

  const visits = useMemo(
    () =>
      patients.filter(
        (item) =>
          item.patient.patientId.trim().toLowerCase() ===
          patientId.trim().toLowerCase(),
      ),
    [patientId],
  );

  const patient = visits[0];

  if (!patient) {
    return (
      <Box sx={{ minHeight: "40vh", display: "grid", placeItems: "center" }}>
        <Paper elevation={0} sx={{ ...cardSx, p: 4, textAlign: "center", minWidth: 320 }}>
          <PersonRoundedIcon sx={{ fontSize: 56, color: meridian.textSecondary, mb: 1 }} />
          <Typography sx={{ fontWeight: 700, color: meridian.textPrimary }}>
            Patient Not Found
          </Typography>
          <Typography sx={{ mt: 1, color: meridian.textSecondary, fontSize: "0.875rem" }}>
            No patient exists with ID <b>{patientId}</b>
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ mt: 3, textTransform: "none", borderRadius: "10px", fontWeight: 600 }}
            onClick={() => (backHref ? router.push(backHref) : router.back())}
          >
            Back
          </Button>
        </Paper>
      </Box>
    );
  }

  const totalTests = visits.reduce((sum, visit) => sum + visit.requestedTests.length, 0);
  const latestVisit = [...visits].sort(
    (a, b) => new Date(b.order.orderedAt).getTime() - new Date(a.order.orderedAt).getTime(),
  )[0];

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            variant="outlined"
            onClick={() => router.back()}
            sx={{ textTransform: "none", borderRadius: "10px" }}
          >
            Back
          </Button>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: meridian.textPrimary }}>
            Patient Profile
          </Typography>
        </Stack>
        <Chip
          label={patient.status}
          size="small"
          sx={{
            borderRadius: "999px",
            fontWeight: 700,
            backgroundColor: "#e8eef5",
            color: meridian.brandPrimary,
            border: "1px solid rgb(0 31 84 / 0.14)",
          }}
        />
      </Stack>

      <Paper elevation={0} sx={{ ...cardSx, p: 3, mb: 3 }}>
        <Typography sx={{ fontWeight: 700, mb: 2, color: meridian.textPrimary }}>
          Patient Information
        </Typography>
        <Divider sx={{ mb: 3, borderColor: "rgb(0 31 84 / 0.08)" }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{ alignItems: { xs: "center", md: "center" } }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: meridian.brandPrimary,
              fontWeight: 700,
            }}
          >
            {patient.patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, color: meridian.textPrimary }}>
              {patient.patient.name}
            </Typography>
            <Typography sx={{ color: meridian.textSecondary, fontSize: "0.875rem" }}>
              UHID: {patient.patient.uhid}
            </Typography>
            <Typography sx={{ color: meridian.textSecondary, fontSize: "0.875rem" }}>
              Patient ID: {patient.patient.patientId}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 3, borderColor: "rgb(0 31 84 / 0.08)" }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          useFlexGap
          sx={{ gap: 4, flexWrap: "wrap" }}
        >
          {[
            ["Age", `${patient.patient.age} Years`],
            ["Gender", patient.patient.gender],
            ["Mobile", patient.patient.mobile],
            ["Doctor", patient.doctor.name],
            ["Department", patient.doctor.department],
          ].map(([label, value]) => (
            <Box key={label}>
              <Typography sx={{ fontSize: "0.75rem", color: meridian.textSecondary }}>
                {label}
              </Typography>
              <Typography sx={{ fontWeight: 700, color: meridian.textPrimary }}>{value}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        <MetricCard label="Total Visits" value={visits.length} size="sm" />
        <MetricCard label="Total Tests" value={totalTests} size="sm" />
        <MetricCard label="Latest Visit" value={latestVisit.visit.visitId} size="sm" />
        <MetricCard label="Current Status" value={patient.status} size="sm" />
      </Box>

      <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
        <Typography sx={{ fontWeight: 700, mb: 2, color: meridian.textPrimary }}>
          Recent Visits
        </Typography>
        <Divider sx={{ mb: 2, borderColor: "rgb(0 31 84 / 0.08)" }} />

        <Stack spacing={2}>
          {visits
            .slice()
            .sort(
              (a, b) =>
                new Date(b.order.orderedAt).getTime() -
                new Date(a.order.orderedAt).getTime(),
            )
            .map((visit) => (
              <Paper
                key={visit.visit.visitId}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  borderColor: meridian.border,
                }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  sx={{ justifyContent: "space-between", gap: 2 }}
                >
                  <Box>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: meridian.textPrimary }}>
                        {visit.visit.visitId}
                      </Typography>
                      <Chip size="small" label={visit.visit.visitType} sx={{ borderRadius: "8px" }} />
                    </Stack>
                    <Typography sx={{ fontSize: "0.875rem", color: meridian.textSecondary }}>
                      Doctor: {visit.doctor.name}
                    </Typography>
                    <Stack direction="row" useFlexGap sx={{ gap: 1, mt: 1, flexWrap: "wrap" }}>
                      {visit.requestedTests.map((test) => (
                        <Chip
                          key={test}
                          size="small"
                          label={test}
                          variant="outlined"
                          sx={{ borderRadius: "8px", borderColor: meridian.border }}
                        />
                      ))}
                    </Stack>
                  </Box>
                  <Stack spacing={1} sx={{ alignItems: { xs: "flex-start", md: "flex-end" } }}>
                    <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>
                      {formatDateTime(visit.order.orderedAt)}
                    </Typography>
                    <Chip
                      size="small"
                      label={visit.status}
                      sx={{
                        borderRadius: "999px",
                        fontWeight: 600,
                        backgroundColor: "#e8eef5",
                        color: meridian.brandPrimary,
                      }}
                    />
                  </Stack>
                </Stack>
              </Paper>
            ))}
        </Stack>
      </Paper>
    </Box>
  );
}
