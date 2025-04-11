import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
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
        "searchlysis.com",
        "*.searchlysis.com",
        process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost",
        `*.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost"}`,
      ],
    },
  },
};

export default nextConfig;
