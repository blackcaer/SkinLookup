import type { NextConfig } from "next";

/** @type {NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "steamuserimages-a.akamaihd.net",
      },
    ],
    minimumCacheTTL: 3600,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

export default nextConfig;
