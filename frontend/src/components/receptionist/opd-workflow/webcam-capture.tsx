"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import { getCameraBlockedReason, getCameraErrorMessage } from "@/lib/utils/camera";

type WebcamCaptureProps = {
  photo: string;
  onCapture: (photo: string) => void;
  onClear: () => void;
  error?: string;
};

const videoConstraints: MediaStreamConstraints = {
  audio: false,
  video: {
    width: { ideal: 480 },
    height: { ideal: 480 },
    facingMode: "user",
  },
};

export function WebcamCapture({
  photo,
  onCapture,
  onClear,
  error,
}: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) {
      setCameraError("Unable to capture photo. Please try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setCameraError("Unable to capture photo. Please try again.");
      return;
    }

    // Mirror to match the preview
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageSrc = canvas.toDataURL("image/jpeg", 0.92);
    setCameraError("");
    onCapture(imageSrc);
    stopCamera();
    setIsCameraOpen(false);
  }, [onCapture, stopCamera]);

  async function handleOpenCamera() {
    const blocked = getCameraBlockedReason();
    if (blocked) {
      setCameraError(blocked);
      return;
    }

    setCameraError("");
    setIsCameraOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (mediaError) {
      setCameraError(getCameraErrorMessage(mediaError));
      stopCamera();
      setIsCameraOpen(false);
    }
  }

  function handleCloseCamera() {
    stopCamera();
    setIsCameraOpen(false);
    setCameraError("");
  }

  function handleRetake() {
    onClear();
    void handleOpenCamera();
  }

  const insecureContextHint = getCameraBlockedReason();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[200px_1fr]">
        <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt="Patient"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-3 text-center text-xs text-muted-foreground">
              No photo captured
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {!isCameraOpen && (
            <div className="flex flex-wrap gap-2">
              <Button variant="contained" onClick={() => void handleOpenCamera()}>
                {photo ? "Open Camera Again" : "Open Camera"}
              </Button>
              {photo && (
                <Button variant="outlined" color="error" onClick={onClear}>
                  Remove Photo
                </Button>
              )}
              {photo && (
                <Button variant="outlined" onClick={handleRetake}>
                  Retake
                </Button>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Capture a live photo using the webcam. Camera access is required.
          </p>

          {insecureContextHint && !cameraError && !error && (
            <p className="text-xs text-warning">{insecureContextHint}</p>
          )}

          {(error || cameraError) && (
            <p className="text-xs text-danger">{error || cameraError}</p>
          )}
        </div>
      </div>

      {isCameraOpen && (
        <div className="surface-card max-w-md space-y-4 p-4">
          <p className="text-sm font-medium text-foreground">Live Camera</p>

          <div className="overflow-hidden rounded-xl border border-border bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-auto w-full"
              style={{ transform: "scaleX(-1)" }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="contained" onClick={handleCapture}>
              Capture Photo
            </Button>
            <Button variant="outlined" onClick={handleCloseCamera}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
