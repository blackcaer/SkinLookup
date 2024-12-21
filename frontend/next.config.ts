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
  },
};

module.exports = nextConfig;


export default nextConfig;
