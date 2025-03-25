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
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/blog",
      },
      {
        source: "/:path*",
        destination: "/blog/:path*",
      },
    ];
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["nextjs-boilerplate-eta-five-67.vercel.app"],
    },
  },
};

export default nextConfig;
