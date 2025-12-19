import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 确保API路由正确构建
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb'
    }
  },
  // 配置静态资源
  output: 'standalone',
  // 确保环境变量在客户端可用
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
};

export default nextConfig;
