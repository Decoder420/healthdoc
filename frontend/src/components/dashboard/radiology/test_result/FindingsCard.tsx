"use client";

import {
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface FindingsCardProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function FindingsCard({
  value,
  error,
  onChange,
}: FindingsCardProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
      }}
    >
      <Stack spacing={2}>
        <Typography
          variant="h6"
          fontWeight={600}
        >
          Findings *
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={8}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="Enter detailed radiological findings..."
          error={Boolean(error)}
          helperText={error}
        />
      </Stack>
    </Paper>
  );
}