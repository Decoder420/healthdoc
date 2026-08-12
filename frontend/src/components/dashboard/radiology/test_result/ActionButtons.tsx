"use client";

import {
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

interface ActionButtonsProps {
  loading?: boolean;
  canVerify: boolean;
  onSaveDraft: () => void;
  onVerify: () => void;
  onViewReport: () => void;
}

export default function ActionButtons({
  loading = false,
  canVerify,
  onSaveDraft,
  onVerify,
  onViewReport,
}: ActionButtonsProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      justifyContent="flex-end"
      sx={{ mt: 2 }}
    >
      <Button
        variant="outlined"
        size="medium"
        disabled={loading}
        onClick={onSaveDraft}
        startIcon={<SaveOutlinedIcon />}
        sx={{
          minWidth: 130,
          fontWeight: 600,
          borderRadius: 1.5,
          textTransform: "none",
        }}
      >
        Save Draft
      </Button>

      <Button
        variant="outlined"
        color="success"
        size="medium"
        disabled={!canVerify || loading}
        onClick={onViewReport}
        startIcon={<VisibilityOutlinedIcon />}
        sx={{
          minWidth: 130,
          fontWeight: 600,
          borderRadius: 1.5,
          textTransform: "none",
        }}
      >
        View Report
      </Button>

      <Button
        variant="contained"
        size="medium"
        disabled={!canVerify || loading}
        onClick={onVerify}
        startIcon={
          loading ? (
            <CircularProgress size={17} color="inherit" />
          ) : (
            <VerifiedOutlinedIcon />
          )
        }
        sx={{
          minWidth: 150,
          fontWeight: 600,
          borderRadius: 1.5,
          textTransform: "none",
        }}
      >
        {loading ? "Verifying..." : "Verify Report"}
      </Button>
    </Stack>
  );
}
