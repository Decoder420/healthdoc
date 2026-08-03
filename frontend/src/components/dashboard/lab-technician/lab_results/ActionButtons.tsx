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
  saving?: boolean;
  resetting?: boolean;

  disableSave?: boolean;
}

export default function ActionButtons({
  onSaveDraft,
  onApprove,
  onReset,
  approving = false,
  saving = false,
  resetting = false,
  disableSave = false,
}: Props) {

  const disabled =
    approving ||
    saving ||
    resetting;


  return (

    <Paper
      elevation={2}
      sx={{
        mt:3,
        p:2,
        borderRadius:3,
      }}
    >

      <Stack
        direction={{
          xs:"column",
          md:"row",
        }}
        spacing={2}
        justifyContent="flex-end"
      >


        <Button

          variant="outlined"

          startIcon={
            <RestartAltRoundedIcon />
          }

          onClick={onReset}

          disabled={disabled}

          sx={{
            minWidth:160,
          }}

        >

          {
            resetting
            ? "Resetting..."
            : "Reset"
          }

        </Button>





        <Button

          variant="contained"

          startIcon={
            <SaveRoundedIcon />
          }

          onClick={onSaveDraft}

          disabled={
            disableSave ||
            disabled
          }

          sx={{
            minWidth:160,
          }}

        >

          {
            saving
            ? "Saving..."
            : "Save Draft"
          }

        </Button>






        <Button

          variant="contained"

          color="success"

          startIcon={
            <VerifiedRoundedIcon />
          }

          onClick={onApprove}

          disabled={disabled}

          sx={{
            minWidth:160,
          }}

        >

          {
            approving
            ? "Approving..."
            : "Approve Report"
          }

        </Button>



      </Stack>


    </Paper>

  );

}