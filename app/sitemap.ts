import { listAnalyses } from "@/lib/actions";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogUrls = (
    await listAnalyses(1, 10000, { group: process.env.NEXT_PUBLIC_ROOT_DOMAIN })
  ).map(
    (blog) => `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/blog/${blog.analysisId}`,
  );

  return [
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/blog`,
    },
    ...blogUrls.map((url) => ({ url })),
  ];
}
