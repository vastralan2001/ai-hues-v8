import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  // 支持 workspace 中的本地包
  transpilePackages: ['@aiushtha/shared-types'],
};

export default nextConfig;
