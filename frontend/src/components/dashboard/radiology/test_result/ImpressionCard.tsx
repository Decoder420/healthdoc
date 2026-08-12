"use client";

import {
  Box,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface ImpressionCardProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function ImpressionCard({
  value,
  error,
  onChange,
}: ImpressionCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: error ? "error.main" : "divider",
        borderRadius: 2,
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
            >
              Impression
            </Typography>

            <Chip
              label="Required"
              size="small"
              variant="outlined"
              color="primary"
              sx={{
                height: 21,
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {value.length} characters
          </Typography>
        </Stack>

        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={5}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter the radiological impression..."
          error={Boolean(error)}
          helperText={error}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              fontSize: 14,
              lineHeight: 1.6,
              alignItems: "flex-start",
            },
            "& .MuiFormHelperText-root": {
              mx: 0,
            },
          }}
        />

        {!error && (
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Summarize the key findings and provide the most likely
              radiological diagnosis.
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
