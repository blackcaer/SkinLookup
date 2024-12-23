import type { NextConfig } from "next";


/** @type {NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'steamuserimages-a.akamaihd.net',
          },
      ],
      minimumCacheTTL: 3600
  },
};

module.exports = nextConfig;

export default nextConfig;
