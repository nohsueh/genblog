import { getBaseUrl } from "@/lib/utils";
import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  return {
    rules: [
      {
        userAgent: ["*"],
        allow: ["/"],
        disallow: ["/_next"],
      },
    ],
    sitemap: [`${getBaseUrl()}/sitemap_index.xml`],
  };
}
