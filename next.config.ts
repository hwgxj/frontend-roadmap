import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 临时跳过类型检查
  },
  eslint: {
    ignoreDuringBuilds: true, // 临时跳过 ESLint
  },
};

export default nextConfig;
