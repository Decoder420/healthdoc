/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep tracing rooted in this package (avoid picking up ~/package-lock.json).
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
