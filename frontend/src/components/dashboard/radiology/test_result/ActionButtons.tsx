"use client";

import {
  Button,
   CircularProgress,
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

      <Button
  variant="contained"
  size="large"
  disabled={!canVerify || loading}
  onClick={onVerify}
  startIcon={
    loading ? (
      <CircularProgress
        size={18}
        color="inherit"
      />
    ) : undefined
  }
>
  {loading ? "Verifying..." : "Verify Report"}
</Button>
    </Stack>
  );
}