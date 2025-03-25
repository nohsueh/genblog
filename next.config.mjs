/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/blog",
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: '/blog'
      }
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
