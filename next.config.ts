// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export' を削除
  images: {
    domains: ['apod.nasa.gov'],
  },
};

export default nextConfig;
