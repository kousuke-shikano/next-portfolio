// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静的エクスポート対応
  output: 'export',

  // 外部画像ドメイン許可
  images: {
    domains: ['apod.nasa.gov'],
  },
};

export default nextConfig;
