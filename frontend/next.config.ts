import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

/** Every local IPv4 + localhost so LAN devices can load /_next CSS/JS in dev. */
function getAllowedDevOrigins(): string[] {
  const origins = new Set<string>([
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "*.localhost",
    "*.local",
  ]);

  for (const entries of Object.values(os.networkInterfaces())) {
    for (const entry of entries ?? []) {
      const family = String(entry.family);
      if ((family === "IPv4" || family === "4") && !entry.internal) {
        origins.add(entry.address);
      }
    }
  }

  // Broad private-network patterns (Next 16 cross-origin /_next guard)
  origins.add("*.*.*.*");
  origins.add("*.*.*");
  origins.add("*.*");

  return [...origins];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep Turbopack / tracing rooted at frontend/ even if a parent lockfile exists.
  turbopack: {
    root: frontendRoot,
  },
  outputFileTracingRoot: frontendRoot,
  allowedDevOrigins: getAllowedDevOrigins(),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Content-Type, Authorization, X-Requested-With, Accept, Origin",
          },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
