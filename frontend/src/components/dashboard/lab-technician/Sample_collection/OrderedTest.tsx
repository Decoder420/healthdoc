"use client";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";

import { Patient } from "./PatientSearch";

interface OrderedTestsProps {
  patient: Patient | null;
}

export default function OrderedTests({
  patient,
}: OrderedTestsProps) {
  return (
    <Paper
      elevation={0}
      className="surface-card"
      sx={{
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ lineHeight: 1.3 }}
            >
              Ordered Tests
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.3,
              }}
            >
              Laboratory investigations requested for this order
            </Typography>
          </Box>

          {patient && patient.tests.length > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ whiteSpace: "nowrap" }}
            >
              {patient.tests.length}{" "}
              {patient.tests.length === 1 ? "test" : "tests"}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
        }}
      >
        {!patient ? (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Select a patient to view ordered tests.
          </Typography>
        ) : patient.tests.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            No tests ordered for this patient.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              columnGap: 4,
              rowGap: 1.5,
            }}
          >
            {patient.tests.map((test, index) => (
              <Box
                key={`${test}-${index}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: 0,
                }}
              >
                <ScienceRoundedIcon
                  sx={{
                    fontSize: 18,
                    color: "text.secondary",
                    flexShrink: 0,
                  }}
                />

                <Typography
                  variant="body2"
                  fontWeight={600}
                  noWrap
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={test}
                >
                  {test}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
