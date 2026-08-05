"use client";

import { useState } from "react";

import BrokenImageRoundedIcon from "@mui/icons-material/BrokenImageRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import ZoomOutRoundedIcon from "@mui/icons-material/ZoomOutRounded";

import {
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export interface RadiologyImage {
  id: number;
  imageUrl: string;
  thumbnailUrl: string;
}

interface ImageViewerProps {
  images: RadiologyImage[];
}

export default function ImageViewer({
  images,
}: ImageViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = images[selectedIndex];

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={600}>
            Study Images
          </Typography>

          <Stack direction="row" spacing={1}>
            <IconButton>
              <ZoomInRoundedIcon />
            </IconButton>

            <IconButton>
              <ZoomOutRoundedIcon />
            </IconButton>

            <IconButton>
              <RotateRightRoundedIcon />
            </IconButton>

            <IconButton>
              <FullscreenRoundedIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Box
          sx={{
            height: 500,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "grey.100",
          }}
        >
          {selectedImage ? (
            <Box
              component="img"
              src={selectedImage.imageUrl}
              alt={`Study Image ${selectedIndex + 1}`}
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <Stack
              spacing={2}
              alignItems="center"
            >
              <BrokenImageRoundedIcon
                sx={{ fontSize: 60 }}
                color="disabled"
              />

              <Typography color="text.secondary">
                No images available
              </Typography>
            </Stack>
          )}
        </Box>

        {images.length > 0 && (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              overflowX: "auto",
              py: 1,
            }}
          >
            {images.map((image, index) => (
              <Box
                key={image.id}
                component="img"
                src={image.thumbnailUrl}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setSelectedIndex(index)}
                sx={{
                  width: 100,
                  height: 80,
                  borderRadius: 1,
                  cursor: "pointer",
                  objectFit: "cover",
                  border: 3,
                  borderColor:
                    selectedIndex === index
                      ? "primary.main"
                      : "transparent",
                  transition: ".2s",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              />
            ))}
          </Stack>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          align="right"
        >
          {images.length > 0
            ? `Image ${selectedIndex + 1} of ${images.length}`
            : ""}
        </Typography>
      </Stack>
    </Paper>
  );
}