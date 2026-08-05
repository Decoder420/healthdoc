"use client";

import {
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
          Impression *
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
          placeholder="Enter the radiological impression..."
          error={Boolean(error)}
          helperText={error}
        />
      </Stack>
    </Paper>
  );
}