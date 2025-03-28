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
      // allowedOrigins: [process.env.NEXT_PUBLIC_SEARCHLYSIS_BLOG_ROOT_DOMAIN],
      allowedOrigins: ["**"],
    },
  },
};

export default nextConfig;
