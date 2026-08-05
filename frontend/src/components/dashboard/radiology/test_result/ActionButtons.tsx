"use client";

import { LoadingButton } from "@mui/lab";
import {
  Button,
  Stack,
} from "@mui/material";

interface ActionButtonsProps {
  loading?: boolean;
  canVerify: boolean;
  onSaveDraft: () => void;
  onVerify: () => void;
}

export default function ActionButtons({
  loading = false,
  canVerify,
  onSaveDraft,
  onVerify,
}: ActionButtonsProps) {

  
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="flex-end"
      sx={{ mt: 3 }}
    >
      <Button
        variant="outlined"
        size="large"
        disabled={loading}
        onClick={onSaveDraft}
      >
        Save Draft
      </Button>

      <LoadingButton
        variant="contained"
        size="large"
        loading={loading}
        disabled={!canVerify}
        onClick={onVerify}
      >
        Verify Report
      </LoadingButton>
    </Stack>
  );
}