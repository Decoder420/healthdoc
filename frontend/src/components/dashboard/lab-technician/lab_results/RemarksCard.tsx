"use client";

import {
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export type ReportData = {
  interpretation: string;
  remarks: string;
  recommendation: string;
};

interface Props {
  report: ReportData;
  remarkError?: string;
  onChange: (
    field: keyof ReportData,
    value: string
  ) => void;
}

export default function RemarksCard({
  report,
  remarkError = "",
  onChange,
}: Props) {
  const interpretationError =
    !report.interpretation.trim();

  const remarksError =
    Boolean(remarkError) || !report.remarks.trim();

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1.5,
      fontSize: "0.82rem",
    },

    "& .MuiInputBase-inputMultiline": {
      padding: "8px 10px",
      lineHeight: 1.45,
    },

    "& .MuiInputLabel-root": {
      fontSize: "0.82rem",
    },

    "& .MuiFormHelperText-root": {
      fontSize: "0.68rem",
      marginTop: "3px",
      marginLeft: "2px",
    },
  };

  return (
    <Card
      className="surface-card"
      elevation={0}
      sx={{
        mt: 3,
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        {/* Header */}
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            lineHeight: 1.3,
          }}
        >
          Pathologist Remarks
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.25,
          }}
        >
          Add interpretation, clinical remarks and
          recommendations
        </Typography>

        {/* Fields */}
        <Stack spacing={1.75} mt={2}>
          {/* Interpretation */}
          <TextField
            label="Interpretation"
            placeholder="Enter interpretation of the laboratory findings..."
            multiline
            rows={2}
            fullWidth
            required
            value={report.interpretation}
            onChange={(e) =>
              onChange(
                "interpretation",
                e.target.value
              )
            }
            error={interpretationError}
            helperText={
              interpretationError
                ? "Interpretation is required."
                : `${report.interpretation.length}/500`
            }
            inputProps={{
              maxLength: 500,
            }}
            sx={textFieldSx}
          />

          {/* Remarks */}
          <TextField
            label="Remarks"
            placeholder="Enter additional clinical or laboratory remarks..."
            multiline
            rows={3}
            fullWidth
            required
            value={report.remarks}
            onChange={(e) =>
              onChange("remarks", e.target.value)
            }
            error={remarksError}
            helperText={
              remarkError ||
              (remarksError
                ? "Remarks are required."
                : `${report.remarks.length}/1000`)
            }
            inputProps={{
              maxLength: 1000,
            }}
            sx={textFieldSx}
          />

          {/* Recommendation */}
          <TextField
            label="Recommendation"
            placeholder="Enter recommendations or follow-up advice..."
            multiline
            rows={2}
            fullWidth
            value={report.recommendation}
            onChange={(e) =>
              onChange(
                "recommendation",
                e.target.value
              )
            }
            helperText={`${report.recommendation.length}/500`}
            inputProps={{
              maxLength: 500,
            }}
            sx={textFieldSx}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
