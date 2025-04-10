import type { MetadataRoute } from "next";


export default async function robots(): Promise<MetadataRoute.Robots> {

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
