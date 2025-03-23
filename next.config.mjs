/** @type {import('next').NextConfig} */
const nextConfig = {
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
        source: "/blog/:path*",
        destination: "/en/:path*",
      },
    ];
  },
};

export default nextConfig;
