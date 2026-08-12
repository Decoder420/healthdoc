"use client";

import {
  Box,
  Chip,
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
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
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
              Recommendation
            </Typography>

            <Chip
              label="Optional"
              size="small"
              variant="outlined"
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
          placeholder="Enter recommendations (optional)..."
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              fontSize: 14,
              lineHeight: 1.6,
              alignItems: "flex-start",
            },
          }}
        />

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Add follow-up imaging, clinical correlation, or other relevant
            recommendations when required.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
