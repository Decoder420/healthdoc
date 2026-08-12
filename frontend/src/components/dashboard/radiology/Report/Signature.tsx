"use client";

import Image from "next/image";

import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

import {
  Avatar,
  Box,
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
        bgcolor: "background.paper",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          bgcolor: "grey.50",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "success.main",
            }}
          >
            <VerifiedOutlinedIcon fontSize="small" />
          </Avatar>

          <Box>
            <Typography
              fontSize={15}
              fontWeight={700}
              lineHeight={1.3}
            >
              Verified By
            </Typography>

            <Typography
              fontSize={11}
              color="text.secondary"
              lineHeight={1.4}
            >
              Electronically verified radiology report
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Content */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={3}
        px={2.5}
        py={2}
      >
        {/* Radiologist Details */}
        <Box>
          <Typography
            fontSize={16}
            fontWeight={700}
            color="text.primary"
          >
            {radiologist.name}
          </Typography>

          <Typography
            fontSize={12.5}
            color="text.secondary"
            mt={0.25}
          >
            {radiologist.qualification} •{" "}
            {radiologist.designation}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 0.25, sm: 2 }}
            mt={1}
          >
            <Typography fontSize={12}>
              <Box
                component="span"
                fontWeight={600}
                color="text.secondary"
              >
                Registration No:
              </Box>{" "}
              {radiologist.registrationNo}
            </Typography>

            <Typography
              fontSize={12}
              color="text.secondary"
            >
              Verified On:{" "}
              <Box
                component="span"
                color="text.primary"
                fontWeight={600}
              >
                {radiologist.verifiedOn}
              </Box>
            </Typography>
          </Stack>
        </Box>

        {/* Signature */}
        <Box
          sx={{
            minWidth: { sm: 210 },
            textAlign: "center",
          }}
        >
          {radiologist.signature ? (
            <Image
              src={radiologist.signature}
              alt="Digital Signature"
              width={180}
              height={60}
              style={{
                objectFit: "contain",
                maxWidth: "100%",
              }}
            />
          ) : (
            <Box
              sx={{
                width: 180,
                height: 60,
                mx: "auto",
                borderBottom: "1px dashed",
                borderColor: "text.disabled",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                fontSize={11}
                color="text.disabled"
              >
                Digital Signature
              </Typography>
            </Box>
          )}

          <Typography
            fontSize={10.5}
            color="success.main"
            fontWeight={700}
            mt={0.75}
          >
            Electronically Verified
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
