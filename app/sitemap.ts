import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  return [
    {
      url: "/",
      lastModified: now,
      priority: 1,
    }
  ];
}
