/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/blog",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
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
      allowedOrigins: ["nextjs-boilerplate-eta-five-67.vercel.app"],
    },
  },
};

export default nextConfig;
