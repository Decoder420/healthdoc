"use client";

import Image from "next/image";
import {
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export interface SignatureProps {
  radiologist: {
    name: string;
    qualification: string;
    designation: string;
    registrationNo: string;
    signature?: string;
    verifiedOn: string;
  };
}

export default function Signature({
  radiologist,
}: SignatureProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        mb: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: "grey.100",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
        >
          Verified By
        </Typography>
      </Box>

      <Divider />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "flex-end" }}
        spacing={3}
        p={2}
      >
        {/* Doctor Details */}
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            {radiologist.name}
          </Typography>

          <Typography variant="body2">
            {radiologist.qualification}
          </Typography>

          <Typography variant="body2">
            {radiologist.designation}
          </Typography>

          <Typography variant="body2">
            <strong>Registration No:</strong>{" "}
            {radiologist.registrationNo}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={1}
          >
            Verified On: {radiologist.verifiedOn}
          </Typography>
        </Box>

        {/* Signature */}
        <Box
          sx={{
            textAlign: "center",
            minWidth: 180,
          }}
        >
          {radiologist.signature ? (
            <Image
              src={radiologist.signature}
              alt="Digital Signature"
              width={180}
              height={70}
              style={{
                objectFit: "contain",
              }}
            />
          ) : (
            <Box
              sx={{
                height: 70,
                width: 180,
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Digital Signature
              </Typography>
            </Box>
          )}

          <Typography
            variant="caption"
            display="block"
            mt={1}
            fontWeight={600}
          >
            Electronically Verified Report
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}