"use client";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

import {
  Avatar,
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid2";

export interface PatientCardProps {
  patient: {
    uhid: string;
    name: string;
    age: number;
    gender: string;
    dob?: string;
    mobile?: string;
    address?: string;
  };

  doctor: {
    name: string;
    department?: string;
  };

  visit?: {
    type?: string;
    visitNo?: string;
  };
}

interface InfoItemProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}

function InfoItem({
  label,
  value,
  icon,
}: InfoItemProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        minWidth: 0,
        width: "100%",
      }}
    >
      {icon && (
        <Box
          sx={{
            width: 32,
            height: 32,
            minWidth: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1.5,
            bgcolor: "grey.100",
            color: "primary.main",
          }}
        >
          {icon}
        </Box>
      )}

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 600,
            color: "text.secondary",
            lineHeight: 1.2,
            mb: 0.4,
            textTransform: "uppercase",
            letterSpacing: 0.35,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: 13.5,
            fontWeight: 600,
            color: "text.primary",
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "-"}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function PatientCard({
  patient,
  doctor,
  visit,
}: PatientCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {/* Patient Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          bgcolor: "grey.50",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 1.5, md: 3 }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          {/* Patient */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
              minWidth: 0,
            }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: "primary.main",
              }}
            >
              <PersonOutlineRoundedIcon fontSize="small" />
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography
                  fontSize={16}
                  fontWeight={700}
                  lineHeight={1.3}
                >
                  {patient.name}
                </Typography>

                <Chip
                  label={patient.gender}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 21,
                    fontSize: 10.5,
                    fontWeight: 600,
                  }}
                />
              </Stack>

              <Typography
                fontSize={12}
                color="text.secondary"
                lineHeight={1.4}
              >
                {patient.age} Years
                {patient.mobile ? ` • ${patient.mobile}` : ""}
              </Typography>
            </Box>
          </Stack>

          {/* UHID */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              minWidth: { md: 140 },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1.5,
                bgcolor: "grey.100",
                color: "primary.main",
              }}
            >
              <BadgeOutlinedIcon sx={{ fontSize: 17 }} />
            </Box>

            <Box>
              <Typography
                fontSize={10.5}
                color="text.secondary"
                fontWeight={600}
                lineHeight={1.2}
              >
                UHID
              </Typography>

              <Typography
                fontSize={13}
                fontWeight={700}
                lineHeight={1.4}
              >
                {patient.uhid}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Information */}
      <Box
        px={2.5}
        py={2}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
        >
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoItem
              label="Date of Birth"
              value={patient.dob}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoItem
              label="Visit Type"
              value={visit?.type}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoItem
              label="Visit No."
              value={visit?.visitNo}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoItem
              label="Referring Doctor"
              value={doctor.name}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoItem
              label="Department"
              value={doctor.department}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoItem
              label="Mobile"
              value={patient.mobile}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoItem
              label="Address"
              value={patient.address}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
