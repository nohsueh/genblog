import { PAGE_SIZE as BLOG_PAGE_SIZE } from "@/components/blog-list";
import { PAGE_SIZE as SITE_PAGE_SIZE } from "@/components/site-list";
import { listAnalyses } from "@/lib/actions";
import { i18n } from "@/lib/i18n-config";
import { getAppType, getBaseUrl, getGroup } from "@/lib/utils";
import type { MetadataRoute } from "next";

export async function generateSitemaps() {
  return i18n.locales.map((locale) => ({
    id: locale,
  }));
}

export default async function sitemap({
  id: locale,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const pageSize = getAppType() === "blog" ? BLOG_PAGE_SIZE : SITE_PAGE_SIZE;
  const analyses = await listAnalyses({
    pageNum: 1,
    pageSize: Math.floor((50000 * pageSize) / (pageSize + 1)),
    selectFields: ["analysisId", "jsonContent"],
    totalCount: true,
    metadata: {
      group: getGroup(),
      language: locale,
    },
  });
  const totalCount = analyses[0]?.totalCount || 0;
  const totalPage = Math.ceil(totalCount / pageSize);

  return [
    {
      url: `${getBaseUrl()}/${locale}`,
    },
    ...Array.from({ length: totalPage })
      .slice(1)
      .map((_, i) => ({
        url: `${getBaseUrl()}/${locale}/page/${i + 1}`,
      })),
    ...analyses.map((analysis) => ({
      url: `${getBaseUrl()}/${locale}/${analysis.analysisId}/${encodeURIComponent(analysis.jsonContent?.slug || "")}`,
    })),
  ];
}
