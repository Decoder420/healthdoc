"use client";

import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import Button from "@mui/material/Button";
import { getCameraBlockedReason, getCameraErrorMessage } from "@/lib/utils/camera";

type WebcamCaptureProps = {
  photo: string;
  onCapture: (photo: string) => void;
  onClear: () => void;
  error?: string;
};

const videoConstraints: MediaTrackConstraints = {
  width: 480,
  height: 480,
  facingMode: "user",
};

export function WebcamCapture({
  photo,
  onCapture,
  onClear,
  error,
}: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setCameraError("Unable to capture photo. Please try again.");
      return;
    }
    setCameraError("");
    onCapture(imageSrc);
    setIsCameraOpen(false);
  }, [onCapture]);

  function handleOpenCamera() {
    const blocked = getCameraBlockedReason();
    if (blocked) {
      setCameraError(blocked);
      return;
    }
    setCameraError("");
    setIsCameraOpen(true);
  }

  function handleCloseCamera() {
    setIsCameraOpen(false);
    setCameraError("");
  }

  function handleRetake() {
    onClear();
    handleOpenCamera();
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
              <Button variant="contained" onClick={handleOpenCamera}>
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
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.92}
              videoConstraints={videoConstraints}
              mirrored
              className="h-auto w-full"
              onUserMediaError={(mediaError) => {
                setCameraError(getCameraErrorMessage(mediaError));
                setIsCameraOpen(false);
              }}
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
