"use client";

import Image from "next/image";

import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

import {
  Avatar,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid2";

export interface RadiologyImage {
  id: string;
  url: string;
  title?: string;
}

export interface ImageGalleryProps {
  images: RadiologyImage[];
}

export default function ImageGallery({
  images,
}: ImageGalleryProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#F8FAFC",
          borderLeft: "6px solid",
          borderColor: "primary.main",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 46,
                height: 46,
              }}
            >
              <ImageOutlinedIcon />
            </Avatar>

            <Box>
              <Typography
                fontSize={18}
                fontWeight={700}
              >
                Radiology Images
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Representative Diagnostic Images
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={`${images.length} Image${
              images.length !== 1 ? "s" : ""
            }`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Stack>
      </Box>

      <Divider />

      {/* Images */}
      <Box p={3}>
        {images.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              height: 180,
              borderStyle: "dashed",
              borderRadius: 2,
              bgcolor: "#FAFBFC",

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",

              gap: 1.5,
            }}
          >
            <ImageOutlinedIcon
              sx={{
                fontSize: 50,
                color: "text.disabled",
              }}
            />

            <Typography color="text.secondary">
              No Radiology Images Available
            </Typography>
          </Paper>
        ) : (
          <Grid
            container
            spacing={2}
          >
            {images.map((image, index) => (
              <Grid
                key={image.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 6,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",

                    transition: ".2s",

                    "&:hover": {
                      boxShadow: 4,
                      transform:
                        "translateY(-2px)",
                    },

                    "@media print": {
                      transform: "none",
                      boxShadow: "none",
                    },
                  }}
                >
                  {/* Image Viewer */}
                  <Box
                    sx={{
                      position: "relative",

                      width: "100%",

                      height: {
                        xs: 160,
                        sm: 180,
                        md: 200,
                      },

                      bgcolor: "#111827",

                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={
                        image.title ||
                        `Image ${index + 1}`
                      }
                      fill
                      style={{
                        objectFit: "contain",
                        padding: "8px",
                      }}
                    />

                    {/* Image Number */}
                    <Chip
                      label={`Image ${index + 1}`}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,

                        bgcolor:
                          "rgba(0,0,0,0.65)",

                        color: "#fff",

                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  {/* Footer */}
                  <Box
                    sx={{
                      px: 2,
                      py: 1.25,
                    }}
                  >
                    <Typography
                      fontWeight={600}
                      fontSize={14}
                    >
                      {image.title ??
                        `Radiology Image ${
                          index + 1
                        }`}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Representative diagnostic
                      image
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Paper>
  );
}