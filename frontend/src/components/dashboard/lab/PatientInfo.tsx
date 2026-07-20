"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { patients } from "@/lib/mock/lab_data";
import { formatDateTime } from "@/lib/format-datetime";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

interface PatientInfoProps {
  patientId: string;
}

interface LabPatient {
  status: string;

  patient: {
    patientId: string;
    uhid: string;
    name: string;
    age: number;
    gender: string;
    mobile: string;
  };

  visit: {
    visitId: string;
    visitType: string;
  };

  doctor: {
    doctorId: string;
    name: string;
    department: string;
  };

  order: {
    orderId: string;
    priority: string;
    orderedAt: string;
  };

  sample: {
    sampleId: string;
    barcode: string;
    sampleType: string;
    container: string;
    collectedAt: string;
  };

  requestedTests: string[];

  results: any[];
}

export default function PatientInfo({
  patientId,
}: PatientInfoProps) {
  const router = useRouter();

  /**
   * All visits of current patient
   */
  const visits = useMemo<LabPatient[]>(() => {
    return patients.filter(
      (item) =>
        item.patient.patientId.trim().toLowerCase() ===
        patientId.trim().toLowerCase()
    );
  }, [patientId]);

  /**
   * Current patient
   */
  const patient = visits[0];

  if (!patient) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            minWidth: 350,
          }}
        >
          <PersonRoundedIcon
            sx={{
              fontSize: 70,
              color: "text.secondary",
              mb: 2,
            }}
          />

          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
          >
            Patient Not Found
          </Typography>

          <Typography color="text.secondary">
            No patient exists with ID
            <br />
            <b>{patientId}</b>
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ mt: 4 }}
            onClick={() =>
              router.push("/dashboard/pathology")
            }
          >
            Back to Dashboard
          </Button>
        </Card>
      </Box>
    );
  }

  /**
   * Status Colors
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "success";

      case "PROCESSING":
        return "warning";

      case "QUEUE":
        return "info";

      case "COLLECTED":
        return "secondary";

      case "READY":
        return "primary";

      default:
        return "default";
    }
  };

  /**
   * Statistics
   */
  const totalTests = visits.reduce(
    (sum, visit) => sum + visit.requestedTests.length,
    0
  );

  const latestVisit =
    [...visits].sort(
      (a, b) =>
        new Date(b.order.orderedAt).getTime() -
        new Date(a.order.orderedAt).getTime()
    )[0];

  return (
    <Box p={4}>
    {/* ================= HEADER ================= */}

<Stack
  direction={{ xs: "column", md: "row" }}
  justifyContent="space-between"
  alignItems={{ xs: "flex-start", md: "center" }}
  spacing={2}
  mb={4}
>
  <Stack direction="row" spacing={2} alignItems="center">
    <Button
      startIcon={<ArrowBackRoundedIcon />}
      variant="outlined"
      onClick={() => router.back()}
    >
      Back
    </Button>

    <Typography variant="h4" fontWeight={700}>
      Patient Profile
    </Typography>
  </Stack>

  <Chip
    label={patient.status}
    color={getStatusColor(patient.status) as any}
    sx={{
      fontWeight: 700,
      px: 1,
    }}
  />
</Stack>

{/* ================= PATIENT CARD ================= */}

<Card
  elevation={3}
  sx={{
    borderRadius: 4,
    mb: 4,
  }}
>
  <CardContent>

    <Typography
      variant="h6"
      fontWeight={700}
      gutterBottom
    >
      Patient Information
    </Typography>

    <Divider sx={{ mb: 4 }} />

    <Stack
      direction={{
        xs: "column",
        md: "row",
      }}
      spacing={4}
      alignItems={{
        xs: "center",
        md: "center",
      }}
    >

      <Avatar
        sx={{
          width: 90,
          height: 90,
          bgcolor: "primary.main",
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        {patient.patient.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)}
      </Avatar>

      <Box flex={1}>

        <Typography
          variant="h5"
          fontWeight={700}
        >
          {patient.patient.name}
        </Typography>

        <Typography color="text.secondary">
          UHID : {patient.patient.uhid}
        </Typography>

        <Typography color="text.secondary">
          Patient ID : {patient.patient.patientId}
        </Typography>

      </Box>

      <Chip
        label={patient.status}
        color={getStatusColor(patient.status) as any}
      />

    </Stack>

    <Divider sx={{ my: 4 }} />

    <Stack
      direction={{
        xs: "column",
        md: "row",
      }}
      spacing={6}
      flexWrap="wrap"
      useFlexGap
    >

      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Age
        </Typography>

        <Typography fontWeight={700}>
          {patient.patient.age} Years
        </Typography>
      </Box>

      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Gender
        </Typography>

        <Typography fontWeight={700}>
          {patient.patient.gender}
        </Typography>
      </Box>

      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Mobile
        </Typography>

        <Typography fontWeight={700}>
          {patient.patient.mobile}
        </Typography>
      </Box>

      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Current Doctor
        </Typography>

        <Typography fontWeight={700}>
          {patient.doctor.name}
        </Typography>
      </Box>

      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Department
        </Typography>

        <Typography fontWeight={700}>
          {patient.doctor.department}
        </Typography>
      </Box>

    </Stack>

  </CardContent>
</Card>

{/* ================= SUMMARY ================= */}

<Stack
  direction={{
    xs: "column",
    md: "row",
  }}
  spacing={3}
  mb={4}
>

  <Card
    sx={{
      flex: 1,
      borderRadius: 4,
    }}
  >
    <CardContent>

      <Typography
        color="text.secondary"
        variant="body2"
      >
        Total Visits
      </Typography>

      <Typography
        variant="h3"
        fontWeight={700}
      >
        {visits.length}
      </Typography>

    </CardContent>
  </Card>

  <Card
    sx={{
      flex: 1,
      borderRadius: 4,
    }}
  >
    <CardContent>

      <Typography
        color="text.secondary"
        variant="body2"
      >
        Total Tests
      </Typography>

      <Typography
        variant="h3"
        fontWeight={700}
      >
        {totalTests}
      </Typography>

    </CardContent>
  </Card>

  <Card
    sx={{
      flex: 1,
      borderRadius: 4,
    }}
  >
    <CardContent>

      <Typography
        color="text.secondary"
        variant="body2"
      >
        Latest Visit
      </Typography>

      <Typography
        variant="h6"
        fontWeight={700}
      >
        {latestVisit.visit.visitId}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        {new Date(
          latestVisit.order.orderedAt
        ).toLocaleDateString()}
      </Typography>

    </CardContent>
  </Card>

  <Card
    sx={{
      flex: 1,
      borderRadius: 4,
    }}
  >
    <CardContent>

      <Typography
        color="text.secondary"
        variant="body2"
      >
        Current Status
      </Typography>

      <Chip
        sx={{ mt: 2 }}
        label={patient.status}
        color={getStatusColor(patient.status) as any}
      />

    </CardContent>
  </Card>

</Stack>

{/* ================= RECENT VISITS ================= */}

<Card
  elevation={3}
  sx={{
    borderRadius: 4,
  }}
>
  <CardContent>

    <Typography
      variant="h6"
      fontWeight={700}
      gutterBottom
    >
      Recent Visits
    </Typography>

    <Divider sx={{ mb: 4 }} />

    {visits.length === 0 ? (
      <Typography
        color="text.secondary"
        textAlign="center"
        py={6}
      >
        No previous visits found.
      </Typography>
    ) : (
      <Stack spacing={3}>

        {visits
          .sort(
            (a, b) =>
              new Date(b.order.orderedAt).getTime() -
              new Date(a.order.orderedAt).getTime()
          )
          .map((visit) => (
            <Card
              key={visit.visit.visitId}
              variant="outlined"
              sx={{
                borderRadius: 3,
                transition: "0.25s",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>

                <Stack
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  justifyContent="space-between"
                  spacing={4}
                >

                  {/* Left */}

                  <Box flex={1}>

                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      mb={2}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        {visit.visit.visitId}
                      </Typography>

                      <Chip
                        size="small"
                        label={visit.visit.visitType}
                      />
                    </Stack>

                    <Typography
                      color="text.secondary"
                    >
                      Doctor : {visit.doctor.name}
                    </Typography>

                    <Typography
                      color="text.secondary"
                    >
                      Department : {visit.doctor.department}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      Requested Tests
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      mt={1}
                      useFlexGap
                      flexWrap="wrap"
                    >
                      {visit.requestedTests.map(
                        (test) => (
                          <Chip
                            key={test}
                            label={test}
                            size="small"
                            variant="outlined"
                          />
                        )
                      )}
                    </Stack>

                  </Box>

                  {/* Right */}

                  <Stack
                    spacing={2}
                    alignItems={{
                      xs: "flex-start",
                      md: "flex-end",
                    }}
                  >

                    <Typography
                      color="text.secondary"
                    >
                      <CalendarMonthRoundedIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          verticalAlign: "middle",
                        }}
                      />

                      {formatDateTime(visit.order.orderedAt)}
                    </Typography>

                    <Chip
                      label={visit.status}
                      color={
                        getStatusColor(
                          visit.status
                        ) as any
                      }
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Priority :
                      <strong>
                        {" "}
                        {visit.order.priority}
                      </strong>
                    </Typography>

                    <Button
                      variant="contained"
                      startIcon={
                        <VisibilityRoundedIcon />
                      }
                      onClick={() =>
                        router.push(
                          `/dashboard/pathology/visit/${visit.visit.visitId}`
                        )
                      }
                    >
                      View Details
                    </Button>

                  </Stack>

                </Stack>

              </CardContent>
            </Card>
          ))}

      </Stack>
    )}

  </CardContent>
</Card>

</Box>
);
}