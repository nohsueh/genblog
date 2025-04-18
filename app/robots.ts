import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const BASE_URL = `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}${BASE_PATH}`;

  return {
    rules: [
      {
        userAgent: ["*"],
        allow: ["/"],
        disallow: ["/_next"],
      },
    ],
    sitemap: [`${BASE_URL}/sitemap.xml`],
  };
}
