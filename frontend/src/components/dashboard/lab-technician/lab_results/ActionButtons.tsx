"use client";

import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

import { Button, Paper, Stack } from "@mui/material";

interface Props {
  onSaveDraft: () => void;
  onApprove: () => void;
  onReset: () => void;

  approving?: boolean;

  disableSave?: boolean;
}

export default function ActionButtons({
  onSaveDraft,
  onApprove,
  onReset,
  approving = false,
  disableSave = false,
}: Props) {
  return (
    <Paper
      elevation={2}
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 3,
      }}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
        justifyContent="flex-end"
        flexWrap="wrap"
        useFlexGap
      >
        <Button
          variant="outlined"
          startIcon={<RestartAltRoundedIcon />}
          onClick={onReset}
          sx={{ minWidth: 160 }}
        >
          Reset
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          onClick={onSaveDraft}
          disabled={disableSave}
          sx={{ minWidth: 160 }}
        >
          Save Draft
        </Button>

        <Button
          variant="contained"
          color="success"
          disabled={approving}
          startIcon={<VerifiedRoundedIcon />}
          onClick={onApprove}
          sx={{ minWidth: 160 }}
        >
          {approving ? "Approving..." : "Approve Report"}
        </Button>
      </Stack>
    </Paper>
  );
}