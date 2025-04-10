import { listAnalyses } from "@/lib/actions";
import { i18n } from "@/lib/i18n-config";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogUrls = (
    await listAnalyses(1, 10000, { group: process.env.NEXT_PUBLIC_ROOT_DOMAIN })
  ).map(
    (blog) =>
      `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/blog/${i18n.defaultLocale}/${blog.analysisId}`,
  );

  return [
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/blog/${i18n.defaultLocale}`,
    },
    ...blogUrls.map((url) => ({ url })),
  ];
}
