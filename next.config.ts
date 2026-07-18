import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Keep authenticated, dynamic page segments in the browser cache. This
    // makes repeat Dashboard, Review, and About navigations instant.
    staleTimes: {
      dynamic: 300,
      static: 300,
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
