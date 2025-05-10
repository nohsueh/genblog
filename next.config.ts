import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        process.env.NEXT_PUBLIC_ROOT_DOMAIN || "searchlysis.com",
        `*.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || "*.searchlysis.com"}`,
      ],
    },
  },
};

export default nextConfig;
