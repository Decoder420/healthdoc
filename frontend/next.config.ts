import type { NextConfig } from "next";

/**
 * Do not set Access-Control-Allow-Origin: * here.
 * Credentialed CORS is handled in proxy.ts via an allowlist
 * (see src/config/cors.ts + NEXT_PUBLIC_ALLOWED_ORIGINS).
 */
const nextConfig: NextConfig = {
  // Dev HMR from LAN hosts listed in NEXT_PUBLIC_ALLOWED_ORIGINS / local network
  allowedDevOrigins: [
    "localhost",
    "*.localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
