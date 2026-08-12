"use client";

import { useState } from "react";
import Image from "next/image";

import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import ZoomOutRoundedIcon from "@mui/icons-material/ZoomOutRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  Tooltip,
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    null
  );

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const selectedImage =
    selectedIndex !== null
      ? images[selectedIndex]
      : null;

  const openViewer = (index: number) => {
    setSelectedIndex(index);
    setZoom(1);
    setRotation(0);
  };

  const closeViewer = () => {
    setSelectedIndex(null);
    setZoom(1);
    setRotation(0);
  };

  const zoomIn = () => {
    setZoom((current) =>
      Math.min(current + 0.25, 3)
    );
  };

  const zoomOut = () => {
    setZoom((current) =>
      Math.max(current - 0.25, 0.5)
    );
  };

  const rotate = () => {
    setRotation((current) => current + 90);
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
  };

  const showPrevious = () => {
    if (selectedIndex === null || images.length === 0) {
      return;
    }

    setSelectedIndex(
      selectedIndex === 0
        ? images.length - 1
        : selectedIndex - 1
    );

    setZoom(1);
    setRotation(0);
  };

  const showNext = () => {
    if (selectedIndex === null || images.length === 0) {
      return;
    }

    setSelectedIndex(
      selectedIndex === images.length - 1
        ? 0
        : selectedIndex + 1
    );

    setZoom(1);
    setRotation(0);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2.5,
            py: 1.75,
            bgcolor: "grey.50",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "primary.main",
                }}
              >
                <ImageOutlinedIcon fontSize="small" />
              </Avatar>

              <Box>
                <Typography
                  fontSize={16}
                  fontWeight={700}
                  lineHeight={1.3}
                >
                  Radiology Images
                </Typography>

                <Typography
                  fontSize={12}
                  color="text.secondary"
                  lineHeight={1.4}
                >
                  Click an image to view, zoom and rotate
                </Typography>
              </Box>
            </Stack>

            <Chip
              label={`${images.length} ${
                images.length === 1
                  ? "Image"
                  : "Images"
              }`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{
                height: 24,
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          </Stack>
        </Box>

        {/* Images */}
        <Box px={2.5} py={2}>
          {images.length === 0 ? (
            <Box
              sx={{
                minHeight: 150,
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 1.5,
                bgcolor: "grey.50",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <ImageOutlinedIcon
                sx={{
                  fontSize: 40,
                  color: "text.disabled",
                }}
              />

              <Typography
                fontSize={13}
                color="text.secondary"
                fontWeight={500}
              >
                No radiology images available
              </Typography>
            </Box>
          ) : (
            <Grid
              container
              spacing={1.5}
            >
              {images.map((image, index) => (
                <Grid
                  key={image.id}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1.5,
                      bgcolor: "background.paper",
                      transition:
                        "box-shadow 0.2s ease, transform 0.2s ease",

                      "&:hover": {
                        boxShadow: 3,
                        transform: "translateY(-2px)",
                      },

                      "@media print": {
                        transform: "none",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {/* Image */}
                    <Box
                      onClick={() =>
                        openViewer(index)
                      }
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: {
                          xs: 190,
                          sm: 180,
                          md: 190,
                        },
                        bgcolor: "#111827",
                        cursor: "pointer",
                        overflow: "hidden",

                        "&:hover .view-overlay": {
                          opacity: 1,
                        },
                      }}
                    >
                      <Image
                        src={image.url}
                        alt={
                          image.title ||
                          `Radiology image ${
                            index + 1
                          }`
                        }
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                        style={{
                          objectFit: "contain",
                          padding: 8,
                        }}
                      />

                      {/* Image Number */}
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          height: 23,
                          bgcolor:
                            "rgba(0, 0, 0, 0.7)",
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      />

                      {/* View Overlay */}
                      <Box
                        className="view-overlay"
                        sx={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor:
                            "rgba(0, 0, 0, 0.35)",
                          opacity: 0,
                          transition:
                            "opacity 0.2s ease",
                        }}
                      >
                        <Typography
                          sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                            bgcolor:
                              "rgba(0, 0, 0, 0.75)",
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          Click to view full image
                        </Typography>
                      </Box>
                    </Box>

                    {/* Image Details */}
                    <Box
                      sx={{
                        px: 1.5,
                        py: 1.25,
                      }}
                    >
                      <Typography
                        fontSize={13}
                        fontWeight={700}
                        noWrap
                      >
                        {image.title ||
                          `Radiology Image ${
                            index + 1
                          }`}
                      </Typography>

                      <Typography
                        fontSize={11}
                        color="text.secondary"
                        mt={0.25}
                      >
                        Click image for full view
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Paper>

      {/* Full Image Viewer */}
      <Dialog
        open={selectedIndex !== null}
        onClose={closeViewer}
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: "#111827",
          },
        }}
      >
        {/* Viewer Header */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            px: 2,
            py: 1.25,
            bgcolor: "rgba(0, 0, 0, 0.75)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                color="#fff"
                fontSize={14}
                fontWeight={700}
                noWrap
              >
                {selectedImage?.title ||
                  `Radiology Image ${
                    (selectedIndex ?? 0) + 1
                  }`}
              </Typography>

              <Typography
                color="rgba(255,255,255,0.65)"
                fontSize={11}
              >
                Image {(selectedIndex ?? 0) + 1} of{" "}
                {images.length}
              </Typography>
            </Box>

            <Tooltip title="Close">
              <IconButton
                onClick={closeViewer}
                sx={{
                  color: "#fff",
                }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <DialogContent
          sx={{
            p: 0,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Previous */}
          {images.length > 1 && (
            <IconButton
              onClick={showPrevious}
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 5,
                width: 44,
                height: 44,
                bgcolor: "rgba(0,0,0,0.65)",
                color: "#fff",

                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.85)",
                },
              }}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
          )}

          {/* Image */}
          {selectedImage && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "80%",
                  height: "80%",
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition:
                    "transform 0.25s ease",
                }}
              >
                <Image
                  src={selectedImage.url}
                  alt={
                    selectedImage.title ||
                    "Radiology image"
                  }
                  fill
                  priority
                  sizes="100vw"
                  style={{
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Next */}
          {images.length > 1 && (
            <IconButton
              onClick={showNext}
              sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 5,
                width: 44,
                height: 44,
                bgcolor: "rgba(0,0,0,0.65)",
                color: "#fff",

                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.85)",
                },
              }}
            >
              <ChevronRightRoundedIcon />
            </IconButton>
          )}

          {/* Controls */}
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              bgcolor: "rgba(0, 0, 0, 0.78)",
              borderRadius: 2,
              px: 1,
              py: 0.75,
            }}
          >
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
            >
              <Tooltip title="Zoom out">
                <span>
                  <IconButton
                    onClick={zoomOut}
                    disabled={zoom <= 0.5}
                    sx={{
                      color: "#fff",
                      "&.Mui-disabled": {
                        color:
                          "rgba(255,255,255,0.3)",
                      },
                    }}
                  >
                    <ZoomOutRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Typography
                sx={{
                  minWidth: 52,
                  textAlign: "center",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {Math.round(zoom * 100)}%
              </Typography>

              <Tooltip title="Zoom in">
                <span>
                  <IconButton
                    onClick={zoomIn}
                    disabled={zoom >= 3}
                    sx={{
                      color: "#fff",
                      "&.Mui-disabled": {
                        color:
                          "rgba(255,255,255,0.3)",
                      },
                    }}
                  >
                    <ZoomInRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Box
                sx={{
                  width: 1,
                  height: 24,
                  bgcolor:
                    "rgba(255,255,255,0.25)",
                  mx: 0.5,
                }}
              />

              <Tooltip title="Rotate">
                <IconButton
                  onClick={rotate}
                  sx={{
                    color: "#fff",
                  }}
                >
                  <RotateRightRoundedIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Reset view">
                <IconButton
                  onClick={resetView}
                  sx={{
                    color: "#fff",
                  }}
                >
                  <RestartAltRoundedIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
