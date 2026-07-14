/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.ELECTRON_BUILD ? "export" : undefined,
};
export default nextConfig;
