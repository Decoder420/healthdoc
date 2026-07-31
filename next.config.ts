import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import path from "path";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep tracing rooted in this package (avoid picking up ~/package-lock.json)
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
