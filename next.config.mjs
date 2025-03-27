/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/blog",
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
      allowedOrigins: [process.env.SEARCHLYSIS_ROOT_DOMAIN],
    },
  },
};

export default nextConfig;
