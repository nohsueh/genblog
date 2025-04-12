import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const BASE_URL = `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}${process.env.NEXT_PUBLIC_BASE_PATH || ""}`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
