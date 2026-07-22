"use client";

import {
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface Props {
  interpretation: string;
  remarks: string;
  recommendation: string;

  onInterpretationChange: (value: string) => void;
  onRemarksChange: (value: string) => void;
  onRecommendationChange: (value: string) => void;
}

export default function RemarksCard({
  interpretation,
  remarks,
  recommendation,
  onInterpretationChange,
  onRemarksChange,
  onRecommendationChange,
}: Props) {
  return (
    <Card
      sx={{
        mt: 3,
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
        >
          Pathologist Remarks
        </Typography>

        <Stack spacing={3} mt={2}>
          <TextField
            label="Interpretation"
            placeholder="Enter interpretation of the laboratory findings..."
            multiline
            rows={3}
            fullWidth
            value={interpretation}
            onChange={(e) =>
              onInterpretationChange(e.target.value)
            }
            inputProps={{
              maxLength: 500,
            }}
            helperText={`${interpretation.length}/500`}
          />

          <TextField
            label="Remarks"
            placeholder="Enter additional clinical or laboratory remarks..."
            multiline
            rows={4}
            fullWidth
            value={remarks}
            onChange={(e) =>
              onRemarksChange(e.target.value)
            }
            inputProps={{
              maxLength: 1000,
            }}
            helperText={`${remarks.length}/1000`}
          />

          <TextField
            label="Recommendation"
            placeholder="Enter recommendations or follow-up advice..."
            multiline
            rows={3}
            fullWidth
            value={recommendation}
            onChange={(e) =>
              onRecommendationChange(
                e.target.value
              )
            }
            inputProps={{
              maxLength: 500,
            }}
            helperText={`${recommendation.length}/500`}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}