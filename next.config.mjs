export const i18n = {
  defaultLocale: "en",
  locales: ["en", "fr", "es", "de", "zh"],
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/blog",
  i18n: i18n,
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
