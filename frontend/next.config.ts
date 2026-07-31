import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep Turbopack / tracing rooted at frontend/ even if a parent lockfile exists.
  turbopack: {
    root: frontendRoot,
  },
  outputFileTracingRoot: frontendRoot,
  // Allow every private/public IPv4 host to load Next.js HMR/dev assets
  allowedDevOrigins: [
    "*.*.*.*",
    "*.*.*",
    "*.*",
    "localhost",
    "*.localhost",
    "127.0.0.1",
  ],
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
