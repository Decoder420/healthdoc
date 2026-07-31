/** Browsers only allow camera/mic on secure origins (HTTPS or localhost). */
export function isSecureCameraContext(): boolean {
  if (typeof window === "undefined") return true;
  return window.isSecureContext;
}

export function getCameraBlockedReason(): string | null {
  if (typeof window === "undefined") return null;

  if (!isSecureCameraContext()) {
    const host = window.location.hostname;
    const isLanIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
    if (isLanIp) {
      return `Camera is blocked on http://${host} because this is not a secure connection. Use https://${host}:${window.location.port || "3000"} (accept the certificate warning), or open the app on this PC at http://localhost:${window.location.port || "3000"}.`;
    }
    return "Camera requires HTTPS or localhost. Open the app over a secure connection.";
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    return "This browser does not support camera access.";
  }

  return null;
}

export function getCameraErrorMessage(error: unknown): string {
  const blocked = getCameraBlockedReason();
  if (blocked) return blocked;

  if (error instanceof DOMException) {
    switch (error.name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        return "Camera permission was denied. Allow camera access in your browser settings and try again.";
      case "NotFoundError":
      case "DevicesNotFoundError":
        return "No camera was found on this device.";
      case "NotReadableError":
      case "TrackStartError":
        return "Camera is in use by another app. Close other apps using the camera and try again.";
      case "SecurityError":
        return getCameraBlockedReason() ?? "Camera access blocked by browser security settings.";
      case "OverconstrainedError":
        return "Camera does not support the requested settings. Try another device.";
      default:
        return error.message || "Camera access failed. Please try again.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Camera access denied or unavailable. Please allow camera permission and try again.";
}
