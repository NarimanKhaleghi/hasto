import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/hasto",
  turbopack: { root: "./" },
  output: "export",
  images: { unoptimized: true },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
