"use client";

import {
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";


export type ReportData = {
  interpretation: string;
  remarks: string;
  recommendation: string;
};


interface Props {

  report: ReportData;

  remarkError?: string;

  onChange: (
    field: keyof ReportData,
    value: string
  ) => void;

}



export default function RemarksCard({

  report,

  remarkError = "",

  onChange,

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



        <Stack
          spacing={3}
          mt={2}
        >


          <TextField

            label="Interpretation"

            placeholder="Enter interpretation of the laboratory findings..."

            multiline

            rows={3}
            required

            fullWidth

            value={
              report.interpretation
            }


            onChange={(e)=>
              onChange(
                "interpretation",
                e.target.value
              )
            }


            inputProps={{
              maxLength:500,
            }}


            helperText={
              `${report.interpretation.length}/500`
            }

          />





          <TextField

            label="Remarks"

            placeholder="Enter additional clinical or laboratory remarks..."

            multiline

            rows={4}

            fullWidth

            required


            value={
              report.remarks
            }


            onChange={(e)=>
              onChange(
                "remarks",
                e.target.value
              )
            }


            error={
              Boolean(remarkError)
            }


            helperText={
              remarkError ||
              `${report.remarks.length}/1000`
            }


            inputProps={{
              maxLength:1000,
            }}

          />





          <TextField

            label="Recommendation"

            placeholder="Enter recommendations or follow-up advice..."

            multiline

            rows={3}

            fullWidth
            required


            value={
              report.recommendation
            }


            onChange={(e)=>
              onChange(
                "recommendation",
                e.target.value
              )
            }


            inputProps={{
              maxLength:500,
            }}


            helperText={
              `${report.recommendation.length}/500`
            }

          />


        </Stack>


      </CardContent>

    </Card>

  );

}