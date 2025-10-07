import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['apod.nasa.gov'],
  },
  output: 'export', // ← 追加
};

export default nextConfig;
