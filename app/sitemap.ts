import { listAnalyses } from "@/lib/actions";
import { i18n } from "@/lib/i18n-config";
import { getBaseUrl, getGroupName } from "@/lib/utils";
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
  const analyses = await listAnalyses({
    pageNum: 1,
    pageSize: 49999,
    selectFields: ["analysisId", "jsonContent"],
    metadata: {
      group: getGroupName(),
      language: locale,
    },
  });

  return [
    {
      url: `${getBaseUrl()}/${locale}`,
    },
    ...analyses.map((analysis) => ({
      url: `${getBaseUrl()}/${locale}/${analysis.analysisId}/${analysis.jsonContent?.slug || ""}`,
    })),
  ];
}
