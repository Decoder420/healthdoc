"use client";

import type { ReactNode } from "react";

import {
  Button,
  Stack,
} from "@mui/material";

import type { ButtonProps } from "@mui/material";


export interface StatusAction {
  id: string;

  label: string;

  variant?: ButtonProps["variant"];

  color?: ButtonProps["color"];

  disabled?: boolean;

  icon?: ReactNode;

  requiresConfirmation?: boolean;

  requiresReason?: boolean;
}


interface StatusActionMenuProps {
  actions: StatusAction[];

  onAction: (
    action: StatusAction
  ) => void;
}



const BUTTON_STYLE = {
  height: 30,

  minWidth: 95,

  px: 1.5,

  borderRadius: 2,

  textTransform: "none",

  fontSize: 12,

  fontWeight: 600,

  backgroundColor: "#0F172A",

  color: "#FFFFFF",

  "&:hover": {
    backgroundColor: "#020617",
  },

  "&.Mui-disabled": {
    backgroundColor:
      "rgba(0,0,0,0.12)",
    color:
      "rgba(0,0,0,0.38)",
  },
};



export default function StatusActionMenu({
  actions,
  onAction,
}: StatusActionMenuProps) {


  if(actions.length===0){
    return null;
  }



  return (

    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      flexWrap="wrap"
    >

      {
        actions.map((action)=>(

          <Button

            key={action.id}

            size="small"

            variant="contained"

            disableElevation

            disabled={
              action.disabled
            }

            startIcon={
              action.icon
            }

            onClick={()=>
              onAction(action)
            }

            sx={BUTTON_STYLE}

          >

            {action.label}

          </Button>

        ))
      }


    </Stack>

  );
}