"use client";

import {
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface RecommendationCardProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RecommendationCard({
  value,
  onChange,
}: RecommendationCardProps) {
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
          Recommendation
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
          placeholder="Enter recommendations (optional)..."
        />
      </Stack>
    </Paper>
  );
}