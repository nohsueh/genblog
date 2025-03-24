import { i18n } from "./lib/i18n-config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/blog",
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
