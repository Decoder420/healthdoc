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
  Stack,
  Tooltip,
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
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const selectedImage = images[selectedIndex];

  const handleZoomIn = () => {
    setZoom((value) => Math.min(value + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((value) => Math.max(value - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((value) => (value + 90) % 360);
  };

  const handleSelectImage = (index: number) => {
    setSelectedIndex(index);
    setZoom(1);
    setRotation(0);
  };

  const handleFullscreen = async () => {
    const element = document.getElementById(
      "radiology-image-viewer"
    );

    if (!element) return;

    try {
      if (!document.fullscreenElement) {
        await element.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  return (
    <Box
      id="radiology-image-viewer"
      className="surface-card"
      sx={{
        height: "100%",
        overflow: "hidden",
        bgcolor: "background.paper",

        "&:fullscreen": {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          border: 0,
          backgroundColor: "background.paper",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.25,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          justifyContent="space-between"
          spacing={1.5}
        >
          {/* Title */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{
                fontSize: 15,
                lineHeight: 1.3,
              }}
            >
              Study Images
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: 11.5,
              }}
            >
              Radiology image viewer
            </Typography>
          </Box>

          {/* Controls */}
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
          >
            <Tooltip title="Zoom out">
              <span>
                <IconButton
                  size="small"
                  onClick={handleZoomOut}
                  disabled={!selectedImage || zoom <= 0.5}
                  className="icon-button-compact"
                >
                  <ZoomOutRoundedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                minWidth: 42,
                textAlign: "center",
                fontFamily:
                  "IBM Plex Mono, monospace",
                fontSize: 10.5,
                fontWeight: 600,
              }}
            >
              {Math.round(zoom * 100)}%
            </Typography>

            <Tooltip title="Zoom in">
              <span>
                <IconButton
                  size="small"
                  onClick={handleZoomIn}
                  disabled={!selectedImage || zoom >= 3}
                  className="icon-button-compact"
                >
                  <ZoomInRoundedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Box
              sx={{
                width: 1,
                height: 20,
                bgcolor: "divider",
                mx: 0.5,
              }}
            />

            <Tooltip title="Rotate">
              <span>
                <IconButton
                  size="small"
                  onClick={handleRotate}
                  disabled={!selectedImage}
                  className="icon-button-compact"
                >
                  <RotateRightRoundedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Fullscreen">
              <span>
                <IconButton
                  size="small"
                  onClick={handleFullscreen}
                  disabled={!selectedImage}
                  className="icon-button-compact"
                >
                  <FullscreenRoundedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      {/* Image Viewport */}
      <Box
        sx={{
          mx: 2,
          mt: 1.5,
          height: {
            xs: 320,
            sm: 420,
            md: 500,
          },
          borderRadius: 1.5,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {selectedImage ? (
          <>
            <Box
              component="img"
              src={selectedImage.imageUrl}
              alt={`Study Image ${
                selectedIndex + 1
              }`}
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                transform: `
                  scale(${zoom})
                  rotate(${rotation}deg)
                `,
                transition:
                  "transform 0.25s ease",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />

            {/* Image Counter */}
            <Box
              sx={{
                position: "absolute",
                left: 12,
                bottom: 12,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: 10.5,
                  fontFamily:
                    "IBM Plex Mono, monospace",
                  fontWeight: 600,
                }}
              >
                IMAGE {selectedIndex + 1} /{" "}
                {images.length}
              </Typography>
            </Box>

            {/* Zoom Indicator */}
            {zoom !== 1 && (
              <Box
                sx={{
                  position: "absolute",
                  right: 12,
                  bottom: 12,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: 10.5,
                    fontWeight: 600,
                  }}
                >
                  {Math.round(zoom * 100)}%
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Stack
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <BrokenImageRoundedIcon
              sx={{
                fontSize: 48,
                color: "text.disabled",
              }}
            />

            <Typography
              variant="body2"
              color="text.secondary"
              fontSize={12}
            >
              No images available
            </Typography>
          </Stack>
        )}
      </Box>

      {/* Thumbnail Strip */}
      {images.length > 0 && (
        <Box
          sx={{
            px: 2,
            pt: 1.5,
            pb: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              overflowX: "auto",
              pb: 0.5,

              "&::-webkit-scrollbar": {
                height: 5,
              },

              "&::-webkit-scrollbar-thumb": {
                bgcolor: "divider",
                borderRadius: 5,
              },

              "&::-webkit-scrollbar-track": {
                bgcolor: "transparent",
              },
            }}
          >
            {images.map((image, index) => {
              const isSelected =
                selectedIndex === index;

              return (
                <Box
                  key={image.id}
                  onClick={() =>
                    handleSelectImage(index)
                  }
                  sx={{
                    flexShrink: 0,
                    width: 76,
                    height: 58,
                    borderRadius: 1,
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                    border: "2px solid",
                    borderColor: isSelected
                      ? "primary.main"
                      : "divider",
                    bgcolor:
                      "background.paper",
                    transition:
                      "border-color 0.2s ease, opacity 0.2s ease",
                    opacity: isSelected ? 1 : 0.7,

                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={image.thumbnailUrl}
                    alt={`Thumbnail ${
                      index + 1
                    }`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      px: 0.5,
                      py: 0.15,
                      bgcolor:
                        "background.paper",
                      borderTop: "1px solid",
                      borderLeft: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      color="text.secondary"
                      sx={{
                        fontSize: 9,
                        lineHeight: 1.2,
                        fontWeight: 600,
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* Footer */}
      <Box
        sx={{
          px: 2,
          pb: 1.25,
          pt: 0.5,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: 10.5,
            }}
          >
            {selectedImage
              ? `Image ${
                  selectedIndex + 1
                } of ${images.length}`
              : "No study images"}
          </Typography>

          {selectedImage && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: 10,
                fontFamily:
                  "IBM Plex Mono, monospace",
              }}
            >
              ID: {selectedImage.id}
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
