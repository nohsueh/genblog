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
      allowedOrigins: [
        "searchlysis.com",
        "*.searchlysis.com",
        process.env.NEXT_PUBLIC_SEARCHLYSIS_BLOG_ROOT_DOMAIN,
        `*.${process.env.NEXT_PUBLIC_SEARCHLYSIS_BLOG_ROOT_DOMAIN}`,
      ],
    },
  },
};

export default nextConfig;
