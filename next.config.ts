import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // 🚨 TEMPORARY WORKAROUND FOR NEXT.JS 16 ROUTE HANDLER BUG
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
