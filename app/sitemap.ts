import { listAnalysesIds } from "@/lib/actions";
import { i18n } from "@/lib/i18n-config";
import { getBaseUrl, getGroupName } from "@/lib/utils";
import type { MetadataRoute } from "next";

export async function generateSitemaps() {
  return i18n.locales.map((locale) => ({
    language: locale,
  }));
}

export default async function sitemap({
  language,
}: {
  language: string;
}): Promise<MetadataRoute.Sitemap> {
  const CURRENT_DATE = new Date();
  const analyses = await listAnalysesIds(1, 10000, {
    group: getGroupName(),
    language,
  });

  return [
    {
      url: `${getBaseUrl()}/${language}`,
      lastModified: CURRENT_DATE,
    },
    ...analyses.map((analysis) => ({
      url: `${getBaseUrl()}/${language}/${analysis.analysisId}`,
      lastModified: analysis.updatedAt,
    })),
  ];
}
