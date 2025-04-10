import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  return [
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/blog`,
      lastModified: now,
      priority: 1,
    },
  ];
}
